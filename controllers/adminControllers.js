import { ApiError } from "../config/api-error.js";
import * as adminServices from "../services/adminServices.js";

export const getProfileNhanVien = async (req, res, next) => {
	try {
		const nhanVien = await adminServices.getProfileAdmin(req.user._id);
		return res
			.status(200)
			.json({ message: "Lấy thông tin nhân viên thành công", data: nhanVien });
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const updateProfileNhanVien = async (req, res, next) => {
	try {
		const updatedNhanVien = await adminServices.updateProfileAdmin(
			req.user._id,
			req.body,
		);
		return res
			.status(200)
			.json({
				message: "Cập nhật thông tin nhân viên thành công",
				data: updatedNhanVien,
			});
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};
