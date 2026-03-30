import mongoose from "mongoose";
import { ApiError } from "../config/api-error.js";

export const validateId = (paramName) => {
	return (req, res, next) => {
		const id = req.params[paramName];

		if (!mongoose.isValidObjectId(id)) {
			return next(new ApiError(400, `ID ${paramName} không đúng định dạng!`));
		}
		next();
	};
};
