import express from "express";
import * as sachControllers from "../controllers/sachControllers.js";
import { validateId } from "../middlewares/validateId.js";

const router = express.Router();

router.post("/", sachControllers.createBook);
router.patch("/:id", validateId("id"), sachControllers.updateBook);
router.get("/", sachControllers.getBooks);
router.delete("/:id", validateId("id"), sachControllers.deleteBook);

export default router;
