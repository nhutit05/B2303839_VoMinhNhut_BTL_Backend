import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { ApiError } from "../config/api-error.js";
import DocGia from "../models/DocGia.js";
import NhanVien from "../models/NhanVien.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_tam_thoi";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const loginGoogle = async (googleToken) => {
	const ticket = await googleClient.verifyIdToken({
		idToken: googleToken,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	const payload = ticket.getPayload();

	const { email, sub: googleId, name: fullName } = payload;

	const nameParts = fullName.split(" ");
	const ten = nameParts.pop();
	const hoLot = nameParts.join(" ");

	let docGia = await DocGia.findOne({ email: email });

	if (docGia) {
		if (!docGia.googleId) {
			docGia.googleId = googleId;
			await docGia.save();
		}
	} else {
		docGia = new DocGia({
			email: email,
			googleId: googleId,
			hoLot: hoLot || "Độc",
			ten: ten || "Giả",
		});
	}

	if (docGia.bannedUntil && new Date(docGia.bannedUntil) > new Date()) {
		const dateStr = new Date(docGia.bannedUntil).toLocaleDateString("vi-VN");
		throw new ApiError(403, `Tài khoản bị khóa đến ngày ${dateStr}`);
	}

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
