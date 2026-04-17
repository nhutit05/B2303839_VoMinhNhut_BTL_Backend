import { ApiError } from "../config/api-error.js";
import * as nxbServices from "../services/nxbServices.js";

export const createNXB = async (req, res, next) => {
  try {
    const { tenNXB, diaChi } = req.body;

    if (!tenNXB)
      return next(new ApiError(400, "Vui lòng nhập tên nhà xuất bản!"));

    const result = await nxbServices.createNXB({ tenNXB, diaChi });

    return res
      .status(201)
      .json({ message: "Tạo nhà xuất bản thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) return next(error);

    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const updateNXB = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tenNXB, diaChi } = req.body;

    if (!tenNXB) {
      throw new ApiError(400, "Vui lòng nhập tên nhà xuất bản!");
    }

    const result = await nxbServices.updateNXB(id, { tenNXB, diaChi });

    return res
      .status(200)
      .json({ message: "Cập nhật thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const deleteNXB = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await nxbServices.deleteNXB(id);

    return res.status(200).json({ message: "Xóa thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const getNXBs = async (req, res, next) => {
  try {
    const nxb = await nxbServices.getNXBs(req.query);

    return res
      .status(200)
      .json({ message: "Lấy danh sách thành công", data: nxb });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const getAllNXB = async (req, res, next) => {
  try {
    const nxb = await nxbServices.getAllNXB();
    if (!nxb || nxb.length === 0) {
      return res.status(200).json({ message: "Không có nhà xuất bản nào", data: [] });
    }

    return res
      .status(200)
      .json({ message: "Lấy danh sách thành công", data: nxb });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(error.statusCode || 500, error.message));  
    }
};