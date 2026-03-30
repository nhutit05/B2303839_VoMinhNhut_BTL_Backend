import express from "express";
import * as thongKeControllers from "../controllers/thongKeControllers.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, thongKeControllers.getStatistics);

export default router;
