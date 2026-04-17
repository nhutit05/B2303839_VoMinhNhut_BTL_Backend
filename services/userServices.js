import DocGia from "../models/DocGia.js";
import bcrypt from 'bcrypt';

export const getProfile = async (userId) => {
	const docGia = await DocGia.findById(userId).select("-password").lean();
	return docGia;
};



export const updateProfile = async (userId, data) => {
  const {
    hoLot,
    ten,
    email,
    ngaySinh,
    phai,
    diaChi,
    dienThoai,
    password,
  } = data;

  // Kiểm tra email trùng
  const existingDocGia = await DocGia.findOne({
    _id: { $ne: userId },
    email: email,
  }).select("_id").lean();

  if (existingDocGia) {
    throw new ApiError(400, "Email bị trùng");
  }

  const updatedData = { hoLot, ten, email, ngaySinh, phai, diaChi, dienThoai };

  // Nếu có password mới, hash trước khi cập nhật
  if (password && password.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updatedData.password = hashedPassword;
  }

  const updatedDocGia = await DocGia.findByIdAndUpdate(
    userId,
    { $set: updatedData },
    { new: true, runValidators: true }
  ).select("-password"); // Không trả về password

  if (!updatedDocGia) {
    throw new ApiError(404, "Không tìm thấy độc giả để cập nhật!");
  }

  return updatedDocGia;
};
