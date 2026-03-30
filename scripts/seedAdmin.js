import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import NhanVien from "../models/NhanVien.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const adminExists = await NhanVien.findOne({ email: "admin1@gmail.com" });
    if (adminExists) {
      console.log("Tài khoản Admin đã tồn tại");
      process.exit();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.password_admin, salt);
    const newAdmin = new NhanVien({
      hoTenNV: "Admin",
      email: "admin1@gmail.com",
      password: hashedPassword,
    });
    await newAdmin.save();
    console.log("Tạo tài khoản Admin thành công");
    process.exit();
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản Admin:", error);
    process.exit(1);
  }
};

seedAdmin();
