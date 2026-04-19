import mongoose from "mongoose";

const sachSchema = new mongoose.Schema(
  {
    tenSach: {
      type: String,
      required: true,
    },
    donGia: {
      type: Number,
      required: true,
    },
    soQuyen: {
      type: Number,
      required: true,
      min: 0,
    },
    namXuatBan: {
      type: Number,
      min: 1800,
    },
    maNXB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhaXuatBan",
    },
    tacGia: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://i0.wp.com/ph.ctu.edu.vn/wp-content/uploads/2024/07/bia_eidt.png?fit=800%2C1099&ssl=1",
    }
  },
  { timestamps: true },
);

sachSchema.index({ tenSach: "text", tacGia: "text" });

export default mongoose.model("Sach", sachSchema);
