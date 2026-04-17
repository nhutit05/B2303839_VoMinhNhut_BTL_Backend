import { ApiError } from "../config/api-error.js";
import * as muonTraServices from "../services/muonTraServices.js";

export const borrowBook = async (req, res, next) => {
	try {
		const maDocGia = req.user._id;
		const { maSach, soNgayMuon = 14 } = req.body;

		if (!maSach) {
			return next(new ApiError(400, "Vui lòng cung cấp mã sách!"));
		}

		if (soNgayMuon < 0 || soNgayMuon > 14 || Number.isNaN(soNgayMuon)) {
			return next(
				new ApiError(400, "Số ngày mượn là số dương và nhỏ hơn 14 ngày!"),
			);
		}

		const result = await muonTraServices.borrowBook({
			maDocGia,
			maSach,
			soNgayMuon: Number(soNgayMuon),
		});
		return res
			.status(201)
			.json({ message: "Mượn sách thành công", data: result });
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const returnBook = async (req, res, next) => {
	try {
		const { idPhieuMuon } = req.params;

		if (!idPhieuMuon) {
			return next(new ApiError(400, "Vui lòng cung cấp mã phiếu mượn!"));
		}
		const result = await muonTraServices.returnBook(idPhieuMuon);
		return res.status(200).json({
			message: "Trả sách thành công",
			data: result.phieuMuon,
			note: result.notifyLock || "Độc giả không bị khóa tài khoản!",
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const getHistoryBorrow = async (req, res, next) => {
	try {
		const maDocGia = req.user._id;
		const { trangThai, locQuaHan } = req.query;

		const result = await muonTraServices.getHistoryBorrow(maDocGia, {
			trangThai,
			locQuaHan,
		});

		return res.status(200).json({
			message: "Lấy lịch sử mượn thành công",
			total: result.length,
			data: result,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const getAllBorrowings = async (req, res, next) => {
	try {
		const { trangThai } = req.query;

		const result = await muonTraServices.getAllBorrowings({
			trangThai,
			// locQuaHan,
		});
		return res.status(200).json({
			message: "Lấy tất cả phiếu mượn thành công",
			total: result.length,
			data: result,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const receiveBook = async (req, res, next) => {
	try {
		const { idPhieuMuon } = req.params;

		if (!idPhieuMuon) {
			return next(new ApiError(400, "Vui lòng cung cấp mã phiếu mượn!"));
		}
		const result = await muonTraServices.receiveBook(idPhieuMuon);
		return res.status(200).json({
			message: "Xác nhận đã nhận sách thành công",
			data: result,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
}


export const extendBorrowController = async (req, res, next) => {
  try {
    const { borrowId } = req.params; // lấy borrowId từ params

    if (!borrowId) {
      throw new ApiError(400, "Vui lòng cung cấp ID phiếu mượn sách!");
    }

    const updatedBorrow = await muonTraServices.extendBorrow(borrowId);

    return res.status(200).json({
      status: "success",
      message: "Gia hạn mượn sách thành công! Thời hạn trả đã được cộng thêm 7 ngày.",
      data: updatedBorrow,
    });
  } catch (error) {
    next(error); // truyền lỗi xuống middleware xử lý
  }
};