import mongoose from "mongoose";

const nhanVienSchema = new mongoose.Schema(
  {
    hoTenNV: {
      type: String,
      required: true,
    },
    chucVu: {
      type: String,
    },
    diaChi: {
      type: String,
    },
    soDienThoai: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("NhanVien", nhanVienSchema);
