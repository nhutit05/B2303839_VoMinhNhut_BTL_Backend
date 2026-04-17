import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { ApiError } from "../config/api-error.js";
import DocGia from "../models/DocGia.js";
import NhanVien from "../models/NhanVien.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_tam_thoi";
//const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, role) => {
	return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "1d" });
};

export const loginNhanVien = async (email, password) => {
	const nhanVien = await NhanVien.findOne({ email });

	if (!nhanVien) {
		throw new ApiError(404, "Email nhân viên không tồn tại");
	}

	if (!nhanVien.password) {
		throw new ApiError(400, "Vui lòng nhập password");
	}
	const isMatch = await bcrypt.compare(password, nhanVien.password);

	if (!isMatch) {
		throw new ApiError(400, "Mật khẩu không đúng");
	}
	const token = generateToken(nhanVien._id, "ADMIN");
	return {
		token,
		user: {
			id: nhanVien._id,
			hoTenNV: nhanVien.hoTenNV,
			chucVu: nhanVien.chucVu,
			role: "ADMIN",
		},
	};
};

export const loginDocGia = async (email, password) => {
	const docGia = await DocGia.findOne({ email });
	if (!docGia) {
		throw new ApiError(400, "Email độc giả không tồn tại.");
	}
	if (!docGia.password) {
		throw new ApiError(
			400,
			"Vui lòng nhập password hoặc đăng nhập bằng Google/Facebook trước tiên!",
		);
	}
	const isMatch = await bcrypt.compare(password, docGia.password);
	if (!isMatch) {
		throw new ApiError(400, "Mật khẩu không đúng");
	}

	const token = generateToken(docGia._id, "READER");

	return {
		token,
		user: {
			id: docGia._id,
			hoTen: `${docGia.hoLot} ${docGia.ten}`,
			role: "READER",
			bannedUntil: docGia.bannedUntil,
		},
	};
};



const googleClient = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

export const loginGoogle = async (code) => {
	try {
		// 1. Exchange code → tokens
		const { tokens } = await googleClient.getToken({
			code,
			redirect_uri: process.env.GOOGLE_REDIRECT_URI,
		});

		if (!tokens?.id_token) {
			throw new Error("Google không trả id_token");
		}

		// 2. Verify id_token
		const ticket = await googleClient.verifyIdToken({
			idToken: tokens.id_token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		const { email, sub: googleId, name: fullName } = payload;

		// 3. tách tên
		const nameParts = fullName.split(" ");
		const ten = nameParts.pop();
		const hoLot = nameParts.join(" ");

		// 4. find or create user
		let docGia = await DocGia.findOne({ email });

		if (!docGia) {
			docGia = await DocGia.create({
				email,
				googleId,
				hoLot: hoLot || "Độc",
				ten: ten || "Giả",
			});
		} else {
			if (!docGia.googleId) {
				docGia.googleId = googleId;
				await docGia.save();
			}
		}

		// 5. check ban
		if (docGia.bannedUntil && new Date(docGia.bannedUntil) > new Date()) {
			const dateStr = new Date(docGia.bannedUntil).toLocaleDateString("vi-VN");
			throw new ApiError(403, `Tài khoản bị khóa đến ngày ${dateStr}`);
		}

		// 6. generate JWT
		const token = generateToken(docGia._id, "READER");

		return {
			token,
			user: {
				id: docGia._id,
				hoLot: docGia.hoLot,
				ten: docGia.ten,
				email: docGia.email,
				role: "READER",
			},
		};
	} catch (err) {
		console.error("Google login error:", err);
		throw new ApiError(401, "Google login thất bại");
	}
};

export const registerDocGia = async (data) => {
	const { hoLot, ten, email, password, ngaySinh, phai, diaChi, dienThoai } =
		data;

	const docGiaExists = await DocGia.findOne({ email });

	if (docGiaExists) {
		throw new ApiError(400, "Email bị trùng");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newDocGia = new DocGia({
		hoLot,
		ten,
		email,
		password: hashedPassword,
		ngaySinh,
		phai,
		diaChi,
		dienThoai,
	});

	await newDocGia.save();

	const token = generateToken(newDocGia._id, "READER");

	return {
		token,
		user: {
			id: newDocGia._id,
			hoLot: newDocGia.hoLot,
			ten: newDocGia.ten,
			email: newDocGia.email,
			role: "READER",
		},
	};
};

export const forgotPasswordDocGia = async (email) => {
    // 1. Kiểm tra email có tồn tại không
    const docGia = await DocGia.findOne({ email });
    if (!docGia) {
        throw new ApiError(404, "Email không tồn tại trong hệ thống.");
    }

    // 2. Tạo một mật khẩu ngẫu nhiên (ví dụ: chuỗi 8 ký tự)
    const newPassword = crypto.randomBytes(4).toString('hex');

    // 3. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Cập nhật mật khẩu mới vào cơ sở dữ liệu
    docGia.password = hashedPassword;
    await docGia.save();

    // 5. Cấu hình Nodemailer để gửi email
    // LƯU Ý: Cần thêm EMAIL_USER và EMAIL_PASS vào file .env của bạn
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // VD: thuvien.admin@gmail.com
            pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng (App Password) của Gmail
        }
    });

    const mailOptions = {
        from: `Libverse Library ${process.env.EMAIL_USER}`,
        to: docGia.email,
        subject: '🔑 Khôi phục mật khẩu tài khoản Thư Viện',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #10b981;">Khôi phục mật khẩu thành công</h2>
                <p>Xin chào <strong>${docGia.hoLot} ${docGia.ten}</strong>,</p>
                <p>Hệ thống đã nhận được yêu cầu cấp lại mật khẩu cho tài khoản của bạn.</p>
                <p>Mật khẩu tạm thời mới của bạn là: <strong style="font-size: 18px; color: #f97316; padding: 5px 10px; background: #fff3e0; border-radius: 5px;">${newPassword}</strong></p>
                <p>Vui lòng đăng nhập bằng mật khẩu này và thay đổi mật khẩu ngay lập tức để đảm bảo an toàn.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999;">Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
        `
    };

    // 6. Gửi mail
    await transporter.sendMail(mailOptions);
    
    return true; // Trả về true nếu thành công
};