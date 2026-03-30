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
  },
  { timestamps: true },
);

sachSchema.index({ tenSach: "text", tacGia: "text" });

export default mongoose.model("Sach", sachSchema);
