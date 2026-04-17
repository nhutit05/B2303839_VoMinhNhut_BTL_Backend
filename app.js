import cors from "cors";
import express from "express";
import { ApiError } from "./config/api-error.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import borrowReturnRoutes from "./routes/muonTraRoutes.js";
import nxbRoutes from "./routes/nxbRoutes.js";
import sachRoutes from "./routes/sachRoutes.js";
import thongKeRoutes from "./routes/thongKeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get("/", (req, res) => {
	res.send("CHÀO MỪNG BẠN ĐẾN VỚI THƯ VIỆN LIBVERSE !!");
});




app.use("/auth", authRoutes);
app.use("/books", sachRoutes);
app.use("/publishers", nxbRoutes);
app.use("/borrowings", borrowReturnRoutes);
app.use("/statistics", thongKeRoutes);
app.use("/users", userRoutes);
app.use("/admins", adminRoutes);

app.use((req, res, next) => {
	return next(new ApiError(404, "Đường dẫn không tồn tại!"));
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	return res.status(statusCode).json({
		status: "error",
		message: message,
		// Chỉ hiện stack trace khi ở môi trường development
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
});

export default app;
