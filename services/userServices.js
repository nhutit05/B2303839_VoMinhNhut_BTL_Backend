import DocGia from "../models/DocGia.js";

export const getProfile = async (userId) => {
	const docGia = await DocGia.findById(userId).select("-password").lean();
	return docGia;
};

export const updateProfile = async (userId, data) => {
	const { hoLot, ten, email, ngaySinh, phai, diaChi, dienThoai } = data;
	const updatedData = { hoLot, ten, email, ngaySinh, phai, diaChi, dienThoai };

	const existingDocGia = await DocGia.findOne({
		_id: { $ne: userId },
		email: email,
	})
		.select("_id")
		.lean();

	if (existingDocGia) {
		throw new ApiError(400, "Email bị trùng");
	}

	const updatedDocGia = await DocGia.findByIdAndUpdate(
		userId,
		{ $set: updatedData },
		{
			new: true,
			runValidators: true,
		},
	).select("-password");

	if (!updatedDocGia) {
		throw new ApiError(404, "Không tìm thấy độc giả để cập nhật!");
	}

	return updatedDocGia;
};
