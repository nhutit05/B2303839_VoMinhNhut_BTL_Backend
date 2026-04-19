import cron from "node-cron";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.js";
import DocGia from "../models/DocGia.js";
//import * as emailServices from "../services/emailServices.js";

export const lockReader = () => {
    cron.schedule("0 8 * * *", async () => {
    const today = new Date();

    const records = await TheoDoiMuonSach.find({
        ngayTra: null,
        hanTra: {
            $lt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
    }).populate("maDocGia");

    for (const record of records) {
        const docGia = record.maDocGia;

        if (!docGia || docGia.biKhoa) continue;

        const khoaDenNgay = new Date();
        khoaDenNgay.setFullYear(khoaDenNgay.getFullYear() + 1);

        await DocGia.findByIdAndUpdate(docGia._id, {
            bannedUntil: khoaDenNgay
        });

        console.log(`🔒 Khóa ${docGia.email}`);
    }
});
}