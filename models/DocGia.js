import mongoose from "mongoose";

const docGiaSchema = new mongoose.Schema(
  {
    hoLot: {
      type: String,
      required: true,
    },
    ten: {
      type: String,
      required: true,
    },
    ngaySinh: {
      type: Date,
      default: Date.now,
    },
    phai: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Nam",
    },
    diaChi: {
      type: String,
    },
    dienThoai: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    bannedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("DocGia", docGiaSchema);
