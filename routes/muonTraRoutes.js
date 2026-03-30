import express from "express";
import * as muonTraControllers from "../controllers/muonTraControllers.js";
import {
	checkNotBanned,
	isAdmin,
	isReader,
	verifyToken,
} from "../middlewares/auth.js";
import { validateId } from "../middlewares/validateId.js";

const router = express.Router();

router.post(
	"/",
	verifyToken,
	isReader,
	checkNotBanned,
	muonTraControllers.borrowBook,
);

router.get(
	"/history",
	verifyToken,
	isReader,
	muonTraControllers.getHistoryBorrow,
);

router.patch(
	"/:idPhieuMuon/return",
	verifyToken,
	isAdmin,
	validateId("idPhieuMuon"),
	muonTraControllers.returnBook,
);

export default router;
