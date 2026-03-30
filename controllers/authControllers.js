import { ApiError } from "../config/api-error.js";
import * as authServices from "../services/authServices.js";

export const loginNhanVien = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const result = await authServices.loginNhanVien(email, password);

		return res
			.status(200)
			.json({ message: "Login tài khoản nhân viên thành công", data: result });
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const loginDocGia = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const result = await authServices.loginDocGia(email, password);

		return res
			.status(200)
			.json({ message: "Login tài khoản độc giả thành công", data: result });
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const loginGoogle = async (req, res, next) => {
	try {
		const { googleToken } = req.body;

		if (!googleToken) {
			return res
				.status(400)
				.json({ message: "Vui lòng cung cấp Google Token" });
		}
		const result = await authServices.loginGoogle(googleToken);

		return res
			.status(200)
			.json({ message: "Đăng nhập Google thành công", data: result });
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(
			new ApiError(
				error.statusCode || 401,
				error.message || "Xác thực Google thất bại",
			),
		);
	}
};

export const registerDocGia = async (req, res, next) => {
	try {
		const { hoLot, ten, email, password } = req.body;
		if (!hoLot || !ten || !email || !password) {
			return res.status(403).json({ message: "Nhập đầy đủ trường" });
		}
		const newDocGia = await authServices.registerDocGia(req.body);

		if (!newDocGia) {
			return res.status(400).json({ message: "Không thể tạo tài khoản" });
		}

		return res.status(201).json({
			message: "Đăng ký tài khoản Độc giả thành công!",
			user: newDocGia,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};
