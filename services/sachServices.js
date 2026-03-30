import { ApiError } from "../config/api-error.js";
import NhaXuatBan from "../models/NhaXuatBan.js";
import Sach from "../models/Sach.js";

export const createBook = async (data) => {
	const { tenSach, donGia, soQuyen, namXuatBan, maNXB, tacGia } = data;

	if (!tenSach || donGia === undefined || soQuyen === undefined) {
		throw new ApiError(
			400,
			"Vui lòng nhập đầy đủ Tên sách, Đơn giá và Số quyển!",
		);
	}

	const existingNXB = await NhaXuatBan.findById({ _id: maNXB.trim() }).select(
		"_id tenNXB",
	);

	if (!existingNXB) {
		throw new ApiError(404, "Không tìm thấy nhà xuất bản để tạo sách!");
	}

	if (donGia < 0 || soQuyen < 0) {
		throw new ApiError(400, "Đơn giá > 0");
	}

	const newSach = new Sach({
		tenSach,
		donGia,
		soQuyen,
		namXuatBan,
		maNXB: existingNXB._id,
		tacGia,
	});

	return await newSach.save();
};

export const updateBook = async (id, data) => {
	const sachUpdate = await Sach.findByIdAndUpdate(
		id,
		{ $set: data },
		{ new: true, runValidators: true },
	).lean();

	if (!sachUpdate) throw new ApiError(404, "Không tìm thấy sách để cập nhật!");

	return sachUpdate;
};

export const searchBooks = async (query) => {
	const {
		keyword,
		maNXB,
		giaMin,
		giaMax,
		tonKho,
		sapXep,
		page = 1,
		limit = 5,
	} = query;

	const filter = {};

	if (keyword) {
		filter.$text = { $search: keyword };
	}

	if (maNXB) {
		filter.maNXB = maNXB;
	}

	if (giaMin || giaMax) {
		filter.donGia = {};
		if (giaMin) filter.donGia.$gte = Number(giaMin);
		if (giaMax) filter.donGia.$lte = Number(giaMax);
	}

	if (tonKho === "true") {
		filter.soQuyen = { $gt: 0 };
	}

	let dkSort = { createdAt: -1 };

	if (sapXep === "gia_tang") dkSort = { donGia: -1 };

	const skip = (Number(page) - 1) * Number(limit);

	const listBooks = await Sach.find(
		filter,
		keyword ? { score: { $meta: "textScore" } } : {},
	)
		.populate("maNXB", "tenNXB")
		.sort(dkSort)
		.skip(skip)
		.limit(Number(limit))
		.lean();

	const totalBooks = await Sach.countDocuments(filter);
	return {
		totalBooks,
		totalPages: Math.ceil(totalBooks / Number(limit)),
		currentPage: Number(page),
		sach: listBooks,
	};
};

export const deleteBook = async (id) => {
	const sachDelete = await Sach.findByIdAndDelete(id);

	if (!sachDelete) throw new ApiError(404, "Không tìm thấy sách để xóa!");

	return sachDelete;
};
