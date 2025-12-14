import express from "express";
import upload from "../middlewares/uploads.middleware";
import { UploadController } from "../controllers/upload.controllers";

const router = express.Router();

router.post("/", upload.single("image"), UploadController.uploadImage);

export default router;
