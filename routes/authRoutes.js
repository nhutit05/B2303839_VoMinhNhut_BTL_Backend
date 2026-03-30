import express from "express";
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.post("/login/admin", authControllers.loginNhanVien);
router.post("/login/reader", authControllers.loginDocGia);
router.post("/login/google", authControllers.loginGoogle);
router.post("/register/reader", authControllers.registerDocGia);

export default router;
