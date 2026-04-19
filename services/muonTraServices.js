import { ApiError } from "../config/api-error.js";
import Sach from "../models/Sach.js";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.js";

export const borrowBook = async (data) => {
	const MAX_DAY = 14;
	const { maDocGia, maSach, soNgayMuon = 14 } = data;

	const sach = await Sach.findById(maSach).select("_id tenSach soQuyen");
	if (!sach) throw new ApiError(404, "Không tìm thấy sách để mượn!");

	if (sach.soQuyen <= 0) throw new ApiError(400, "Sách đã hết hàng!");

	const dangMuon = await TheoDoiMuonSach.findOne({
		maDocGia: maDocGia,
		maSach: maSach,
		trangThai: "Đang mượn",
	});

	if (dangMuon) {
		throw new ApiError(400, "Độc giả đang mượn sách này rồi!");
	}

	if (Number(soNgayMuon) > MAX_DAY) {
		throw new ApiError(400, "Số ngày mượn tối đa là 14 ngày!");
	}

	const ngayMuon = new Date();
	const hanTra = new Date();
	hanTra.setDate(ngayMuon.getDate() + Number(soNgayMuon));

	await sach.updateOne({ $inc: { soQuyen: -1 } });

	try {
		const phieuMuon = await TheoDoiMuonSach.create({
			maDocGia: maDocGia,
			maSach: maSach,
			ngayMuon: ngayMuon,
			hanTra: hanTra,
			trangThai: "Đang mượn",
		});

		return phieuMuon;
	} catch (error) {
		await sach.updateOne({ $inc: { soQuyen: 1 } });
		throw new ApiError(500, "Mượn sách thất bại, vui lòng thử lại!");
	}
};

export const returnBook = async (idPhieuMuon) => {
	const phieuMuon = await TheoDoiMuonSach.findById(idPhieuMuon);

	if (!phieuMuon) throw new ApiError(404, "Không tìm thấy phiếu mượn!");
	if (phieuMuon.trangThai !== "Đang mượn")
		throw new ApiError(400, "Phiếu mượn này đã trả rồi!");

	const ngayTra = new Date();
	phieuMuon.ngayTra = ngayTra;

	const timeDelay = ngayTra.getTime() - phieuMuon.hanTra.getTime();
	const MAX_DAY = 30;
	const soNgayTre = Math.ceil(timeDelay / (1000 * 3600 * 24));

	if (timeDelay > 0) {
		const soNgayTre = Math.ceil(timeDelay / (1000 * 3600 * 24));
		phieuMuon.trangThai = "Quá hạn";
		phieuMuon.tienPhat = soNgayTre * 2000;
	} else {
		phieuMuon.tienPhat = 0;
		phieuMuon.trangThai = "Đã trả";
	}
	await Sach.findByIdAndUpdate(phieuMuon.maSach, { $inc: { soQuyen: 1 } });

	await phieuMuon.save();

	let notifyLock = null;

	if (phieuMuon.trangThai === "Quá hạn" || soNgayTre >= 30) {
		const threeMonthsBefore = new Date();
		threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3);

		const soLanTre = await TheoDoiMuonSach.countDocuments({
			maDocGia: phieuMuon.maDocGia,
			ngayTra: { $gte: threeMonthsBefore },
			trangThai: "Quá hạn",
		});

		if (soLanTre >= 3) {
			const oneMonthAfter = new Date();
			oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);
			await DocGia.findByIdAndUpdate(
				phieuMuon.maDocGia,
				{ bannedUntil: oneMonthAfter },
				{ new: true },
			);
			notifyLock = `Độc giả vi phạm ${soLanTre} lần. Đã khóa tài khoản đến: ${oneMonthAfter.toLocaleDateString("vi-VN")}`;
		}
	}

	return {
		phieuMuon,
		notifyLock,
	};
};

export const getHistoryBorrow = async (maDocGia, query) => {
	const { trangThai, locQuaHan } = query;
	const filter = { maDocGia: maDocGia };

	if (locQuaHan === "true") {
		filter.trangThai = "Đang mượn";
		filter.hanTra = { $lt: new Date() };
	} else if (trangThai) {
		filter.trangThai = trangThai;
	}

	const listPhieuMuons = await TheoDoiMuonSach.find(filter)
		.populate("maSach", "tenSach tacGia")
		.sort({ ngayMuon: -1 })
		.lean();

	return listPhieuMuons;
};

export const getAllBorrowings = async (query) => {
    const { trangThai } = query;
    const filter = {};

    // chỉ filter khi có giá trị hợp lệ
    if (trangThai && trangThai !== "all") {
        filter.trangThai = trangThai;
    }

    return await TheoDoiMuonSach.find(filter).populate("maDocGia", "hoLot ten email").populate("maSach", "tenSach tacGia").sort({ ngayMuon: -1 });
};

export const receiveBook = async (idPhieuMuon) => {
	const phieuMuon = await TheoDoiMuonSach.findById(idPhieuMuon);

	if (!phieuMuon) throw new ApiError(404, "Không tìm thấy phiếu mượn!");
	if (phieuMuon.trangThaiNhan === "Đã nhận")
		throw new ApiError(400, "Phiếu mượn này đã được nhận rồi!");

	phieuMuon.trangThaiNhan = "Đã nhận";
	await phieuMuon.save();

	return phieuMuon;
}

export const extendBorrow = async (borrowId) => {
  const borrowRecord = await TheoDoiMuonSach.findById(borrowId);
  if (!borrowRecord) throw new ApiError(404, "Không tìm thấy phiếu mượn sách!");

  if (borrowRecord.trangThai !== "Đang mượn") {
    throw new ApiError(400, "Chỉ có thể gia hạn sách đang mượn!");
  }

  if (borrowRecord.daGiaHan) {
    throw new ApiError(400, "Sách này chỉ được gia hạn 1 lần duy nhất!");
  }

  // Cộng thêm 7 ngày vào hạn trả
  const newDueDate = new Date(borrowRecord.hanTra);
  newDueDate.setDate(newDueDate.getDate() + 7);

  borrowRecord.hanTra = newDueDate;
  borrowRecord.daGiaHan = true;

  await borrowRecord.save();

  return borrowRecord;
};