import mongoose from "mongoose";

const theoDoiMuonSachSchema = new mongoose.Schema(
  {
    maDocGia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocGia",
      required: true,
    },
    maSach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sach",
      required: true,
    },
    ngayMuon: {
      type: Date,
      default: Date.now,
    },
    ngayTra: {
      type: Date,
    },
    hanTra: {
      type: Date,
      required: true,
    },
    trangThai: {
      type: String,
      enum: ["Đang mượn", "Đã trả", "Quá hạn"],
      default: "Đang mượn",
    },
    trangThaiNhan: {
      type: String,
      enum: ['Chưa nhận', 'Đã nhận'],
      default: 'Chưa nhận',
    },
    tienPhat: {
      type: Number,
      default: 0,
      min: 0,
    },
    daGiaHan: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

export default mongoose.model("TheoDoiMuonSach", theoDoiMuonSachSchema);
