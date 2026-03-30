import mongoose from "mongoose";

const nxbSchema = new mongoose.Schema(
  {
    tenNXB: {
      type: String,
      required: true,
    },
    diaChi: {
      type: String,
    },
  },
  { timestamps: true },
);

nxbSchema.index({ tenNXB: "text" });

export default mongoose.model("NhaXuatBan", nxbSchema);
