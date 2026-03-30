import express from "express";
import * as nxbControllers from "../controllers/nxbControllers.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";
import { validateId } from "../middlewares/validateId.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, nxbControllers.createNXB);

router.patch(
	"/:id",
	verifyToken,
	validateId("id"),
	isAdmin,
	nxbControllers.updateNXB,
);

router.delete(
	"/:id",
	verifyToken,
	validateId("id"),
	isAdmin,
	nxbControllers.deleteNXB,
);

router.get("/", nxbControllers.getNXBs);

export default router;
