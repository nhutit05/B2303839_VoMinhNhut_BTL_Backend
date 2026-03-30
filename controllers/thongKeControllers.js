import { ApiError } from "../config/api-error.js";
import * as thongKeServices from "../services/thongKeServices.js";

export const getStatistics = async (req, res, next) => {
	try {
		const stats = await thongKeServices.getStaticalData();
		return res
			.status(200)
			.json({ message: "Lấy thống kê thành công", data: stats });
	} catch (error) {
		if (error instanceof ApiError) {
			return next(error);
		}
		return next(
			new ApiError(error.statusCode || 500, "Lỗi khi lấy dữ liệu thống kê!!!"),
		);
	}
};
