import { ApiError } from "../config/api-error.js";
import NXB from "../models/NhaXuatBan.js";
import Sach from "../models/Sach.js";

export const createNXB = async (data) => {
	const { tenNXB, diaChi } = data;

	const existingNXB = await NXB.findOne({ tenNXB: tenNXB.trim() }).select(
		"_id",
	);

	if (existingNXB) {
		throw new ApiError(400, "Tên NXB bị trùng.");
	}

	return await NXB.create({ tenNXB: tenNXB.trim(), diaChi });
};

export const updateNXB = async (id, data) => {
	const trimTenNXB = data.tenNXB?.trim();
	const { diaChi } = data;

	if (!trimTenNXB) {
		throw new ApiError(400, "Vui lòng nhập tên nhà xuất bản!");
	}

	const existingNXB = await NXB.findOne({
		_id: { $ne: id },
		tenNXB: trimTenNXB,
	}).select("_id");

	if (existingNXB) {
		throw new ApiError(400, "Tên NXB bị trùng.");
	}

	const updatedNXB = await NXB.findByIdAndUpdate(
		id,
		{ tenNXB: trimTenNXB, diaChi },
		{ new: true },
	).lean();

	if (!updatedNXB) {
		throw new ApiError(404, "Không tìm thấy nhà xuất bản để cập nhật!");
	}

	return updatedNXB;
};

export const deleteNXB = async (id) => {

	const deletedNXB = await NXB.findById(id).lean();

	if (!deletedNXB) {
		throw new ApiError(404, "Không tìm thấy nhà xuất bản để xóa!");
	}
	
	const countBooks = await Sach.countDocuments({ maNXB: id });

	if (countBooks > 0) {
		throw new ApiError(400, "Không thể xóa nhà xuất bản có sách!");
	}

	return await NXB.findByIdAndDelete(id);
};

export const getNXBs = async (query) => {
	const { keyword, tenNXB, diaChi, sapXep, page = 1, limit = 5 } = query;

	const filter = {};

	if (keyword) {
		filter.$text = { $search: keyword };
	}

	if (tenNXB) {
		filter.tenNXB = tenNXB;
	}

	if (diaChi) {
		filter.diaChi = diaChi;
	}

	let dkSort = { createdAt: -1 };

	if (sapXep === "ten_A_Z") dkSort = { tenNXB: 1 };

	const skip = (Number(page) - 1) * Number(limit);

	const listNXBs = await NXB.find(
		filter,
		keyword ? { score: { $meta: "textScore" } } : {},
	)
		.sort(dkSort)
		.skip(skip)
		.limit(Number(limit))
		.lean();

	const totalNXBs = await NXB.countDocuments(filter);

	return {
		totalNXBs,
		totalPages: Math.ceil(totalNXBs / Number(limit)),
		currentPage: Number(page),
		nxb: listNXBs,
	};
};

export const getAllNXB = async () => {
	return await NXB.find().lean();
}