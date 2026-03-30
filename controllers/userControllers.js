import * as userServices from "../services/userServices.js";
import { ApiError } from "../config/api-error.js";

export const getProfile = async (req, res, next) => {
	try {
		const docGia = await userServices.getProfile(req.user._id);
		return res.status(200).json(docGia);
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};

export const updateProfile = async (req, res, next) => {
	try {
		const updatedDocGia = await userServices.updateProfile(
			req.user._id,
			req.body,
		);
		return res.status(200).json({
			message: "Cập nhật thông tin độc giả thành công",
			data: updatedDocGia,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(new ApiError(error.statusCode || 500, error.message));
	}
};
