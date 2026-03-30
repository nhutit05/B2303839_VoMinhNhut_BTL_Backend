import express from "express";
import * as userControllers from "../controllers/userControllers.js";
import { isReader, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile", verifyToken, isReader, userControllers.getProfile);

router.patch(
	"/profile/edit",
	verifyToken,
	isReader,
	userControllers.updateProfile,
);

export default router;
