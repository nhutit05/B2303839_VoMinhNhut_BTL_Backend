import cron from "node-cron";
import TheoDoiMuonSach from "../models/TheoDoiMuonSach.js";
import * as emailServices from "../services/emailServices.js";

export const initNhacNhoJob = () => {
	// Lên lịch chạy vào lúc 8 giờ sáng hàng ngày
	cron.schedule("0 8 * * *", async () => {
		console.log("Bắt đầu kiểm tra sách quá hạn...");
		try {
			const today = new Date();
			const startOfToday = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate(),
			);

			// Tìm tất cả các bản ghi mượn sách chưa trả và đã quá hạn
			const overdueRecords = await TheoDoiMuonSach.find({
				ngayTra: null,
				hanTra: { $lt: today },
				$or: [
					{ ngayNhacNhoCuoi: { $exists: false } },
					{
						ngayNhacNhoCuoi: {
							$lt: startOfToday,
						},
					},
				],
			})
				.populate("maDocGia", "ten email")
				.populate("maSach", "tenSach");

			if (overdueRecords.length === 0) {
				console.log("Không có sách nào quá hạn.");
				return;
			}

			let setCount = 0;
			const emailPromises = overdueRecords.map(async (record) => {
				const { maDocGia: docGia, maSach: sach, hanTra } = record;

				if (!docGia?.email || !sach?.tenSach) return;

				const soNgayTre = Math.ceil(
					(today.getTime() - hanTra.getTime()) / (1000 * 60 * 60 * 24),
				);
				const tienPhat = soNgayTre * 5000;

				try {
					await emailServices.sendEmail({
						emailDocGia: docGia.email,
						tenDocGia: docGia.ten,
						tenSach: sach.tenSach,
						hanTra,
						soNgayTre,
						tienPhat,
					});

					// Cập nhật ngày nhắc nhở để mai không gửi trùng nữa
					record.ngayNhacNhoCuoi = new Date();
					await record.save();
					setCount++;
				} catch (err) {
					console.error(`❌ Lỗi gửi mail cho ${docGia.email}:`, err.message);
				}
			});
			await Promise.allSettled(emailPromises);
			console.log(
				` ✅ [Cron] Hoàn tất! Đã gửi thành công ${setCount}/${overdueRecords.length} email nhắc nhở.`,
			);
		} catch (error) {
			console.error(" ❌ [Cron] Lỗi khi kiểm tra sách quá hạn:", error);
		}
	});
};
