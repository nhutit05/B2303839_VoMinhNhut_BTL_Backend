import { ApiError } from "../config/api-error.js";
import * as sachServices from "../services/sachServices.js";

export const createBook = async (req, res, next) => {
  try {
    const { tenSach, donGia, soQuyen, namXuatBan, maNXB, tacGia, image } = req.body;
    const result = await sachServices.createBook({
      tenSach,
      donGia,
      soQuyen,
      namXuatBan,
      maNXB,
      tacGia,
      image,
    });
    return res
      .status(201)
      .json({ message: "Tạo sách thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const searchBooks = async (req, res, next) => {
  try {
    const result = await sachServices.searchBooks(req.query);
    return res
      .status(200)
      .json({ message: "Lấy danh sách sách thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const allowedUpdates = [
      "tenSach",
      "donGia",
      "soQuyen",
      "namXuatBan",
      "maNXB",
      "tacGia",
      "image",
    ];

    const updateData = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return next(
        new ApiError(400, "Dữ liệu cập nhật không hợp lệ hoặc trống!"),
      );
    }

    const result = await sachServices.updateBook(req.params.id, updateData);

    return res
      .status(200)
      .json({ message: "Cập nhật sách thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const result = await sachServices.deleteBook(req.params.id);
    return res
      .status(200)
      .json({ message: "Xóa sách thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(error.statusCode || 500, error.message));
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const result = await sachServices.getBooks(req.query);
    return res
      .status(200)
      .json({ message: "Lấy danh sách sách thành công", data: result });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(error.statusCode || 500, error.message));
  }
}