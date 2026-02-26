import express from "express";
import multer from "multer";
import { analyzeImage } from "../controllers/imageController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), analyzeImage);

export default router;