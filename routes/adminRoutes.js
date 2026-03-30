import * as adminControllers from "../controllers/adminControllers.js";
import express from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get(
	"/profile",
	verifyToken,
	isAdmin,
	adminControllers.updateProfileNhanVien,
);

router.patch(
	"/profile/edit",
	verifyToken,
	isAdmin,
	adminControllers.updateProfileNhanVien,
);

export default router;
