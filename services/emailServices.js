import nodemailer from "nodemailer";
import { ApiError } from "../config/api-error.js";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendEmail = async (data) => {
	const { emailDocGia, tenDocGia, tenSach, hanTra, soNgayTre, tienPhat } = data;
	const mailOptions = {
		from: `"Thư viện Libverse" <${process.env.EMAIL_USER}>`,
		to: emailDocGia,
		subject: `🚨Thông báo quá hạn trả sách: ${tenSach}`,
		html: `
                <h3>Chào bạn ${tenDocGia},</h3>
                <p>Thư viện Libverse xin thông báo, cuốn sách bạn đang mượn đã <b style="color:red">QUÁ HẠN TRẢ</b>.</p>
                <ul>
                    <li><b>Tên sách:</b> ${tenSach}</li>
                    <li><b>Hạn trả:</b> ${hanTra.toLocaleDateString("vi-VN")}</li>
                    <li><b>Số ngày trễ:</b> <span style="color:red">${soNgayTre} ngày</span></li>
                    <li><b>Tiền phạt dự kiến:</b> ${tienPhat.toLocaleString("vi-VN")} VNĐ</li>
                </ul>
                <p>Vui lòng mang sách đến thư viện trả trong thời gian sớm nhất để tránh phát sinh thêm phí phạt hoặc bị khóa tài khoản.</p>
                <p>Trân trọng,<br/><b>Ban quản lý Thư viện</b></p>
            `,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`Đã gửi email thông báo quá hạn trả sách đến ${emailDocGia}`);
	} catch (error) {
		console.error(`Lỗi khi gửi email đến ${emailDocGia}:`, error);
		throw new ApiError(500, "Gửi email thất bại. Vui lòng thử lại sau.");
	}
};
