import jwt from "jsonwebtoken";
import DocGia from "../models/DocGia.js";
import NhanVien from "../models/NhanVien.js";

export const verifyToken = async (req, res, next) => {
	try {
		// Lấy token từ header: "Bearer <token>"
		const authHeader = req.headers.authorization;
		if (!authHeader?.startsWith("Bearer ")) {
			return res.status(401).json({ message: "Chưa cung cấp Token hợp lệ!" });
		}

		const token = authHeader.split(" ")[1];

		// Giải mã token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Tìm user trong CSDL dựa trên role
		let user;
		if (decoded.role === "ADMIN") {
			user = await NhanVien.findById(decoded.id);
		} else if (decoded.role === "READER") {
			user = await DocGia.findById(decoded.id);
		}

		if (!user) {
			return res.status(404).json({ message: "Không tìm thấy người dùng!" });
		}

		// Gắn thông tin user và role vào request để các controller sau sử dụng
		req.user = user;
		req.userRole = decoded.role; // Lưu riêng role để dễ kiểm tra
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token đã hết hạn!" });
		}
		return res.status(403).json({ message: "Token không hợp lệ!" });
	}
};

// 2. Middleware dành riêng cho Nhân viên (Admin)
export const isAdmin = (req, res, next) => {
	if (req.userRole === "ADMIN") {
		next();
	} else {
		res.status(403).json({
			message: "Truy cập bị từ chối! Chỉ Nhân viên mới có quyền thực hiện.",
		});
	}
};

// 3. Middleware dành riêng cho Độc giả
export const isReader = (req, res, next) => {
	if (req.userRole === "READER") {
		next();
	} else {
		res.status(403).json({
			message: "Truy cập bị từ chối! Chỉ Độc giả mới có quyền thực hiện.",
		});
	}
};

// 4. Middleware kiểm tra Độc giả có đang bị cấm mượn không
export const checkNotBanned = (req, res, next) => {
	if (req.userRole === "READER" && req.user.bannedUntil) {
		const today = new Date();
		const bannedDate = new Date(req.user.bannedUntil);

		if (bannedDate > today) {
			return res.status(403).json({
				message: `Tài khoản của bạn đang bị khóa tính năng mượn sách đến ngày ${bannedDate.toLocaleDateString("vi-VN")}`,
			});
		}
	}
	next();
};
