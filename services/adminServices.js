import NhanVien from "../models/NhanVien.js";

export const getProfileAdmin = async (adminId) => {
	const result = await NhanVien.findById(adminId).select("-password").lean();

	if (!result) {
		throw new ApiError(404, "Không tìm thấy nhân viên!");
	}

	return result;
};

export const updateProfileAdmin = async (adminId, data) => {
	const { hoTenNV, chucVu, diaChi, soDienThoai, email } = data;

	const updatedData = { hoTenNV, chucVu, diaChi, soDienThoai, email };

	// Kiểm tra nếu email được cung cấp thì mới kiểm tra trùng lặp

	if (email) {
		const existingNhanVien = await NhanVien.findOne({
			_id: { $ne: adminId },
			email: email,
		}).select("_id");

		if (existingNhanVien) {
			throw new ApiError(400, "Email bị trùng");
		}
	}

	const updatedNhanVien = await NhanVien.findByIdAndUpdate(
		adminId,
		{ $set: updatedData },
		{
			new: true,
			runValidators: true,
		},
	).select("-password");

	if (!updatedNhanVien) {
		throw new ApiError(404, "Không tìm thấy nhân viên để cập nhật!");
	}

	return updatedNhanVien;
};
