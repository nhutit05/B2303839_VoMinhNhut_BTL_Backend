import DocGia from "../models/DocGia.js";
import Sach from "../models/Sach.js";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.js";

export const getStaticalData = async () => {
	const soSachDangMuon = await TheoDoiMuonSach.countDocuments({
		trangThai: "Đang mượn",
	});
	const soSachQuaHan = await TheoDoiMuonSach.countDocuments({
		trangThai: "Quá hạn",
	});

	const ketQuaPhat = await TheoDoiMuonSach.aggregate([
		{
			$match: {
				tienPhat: { $gt: 0 },
			},
		},
		{
			$group: {
				_id: null,
				tongTienPhat: { $sum: "$tienPhat" },
			},
		},
	]);

	const tongTienPhat = ketQuaPhat.length > 0 ? ketQuaPhat[0].tongTienPhat : 0;
	const tongSoSach = await Sach.countDocuments();
	const tongSoDocGia = await DocGia.countDocuments();

	const soSachTrongKho = await Sach.countDocuments({ soQuyen: { $gt: 0 } });

	return {
		soSachDangMuon,
		soSachQuaHan,
		tongSoDocGia,
		tongSoSach,
		soSachTrongKho,
		tongTienPhat,
	};
};
