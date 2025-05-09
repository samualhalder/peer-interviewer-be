import express from "express";
import { ChatControllers } from "../controllers/chats.controllers";
import Auth from "../middlewares/auth.middleware";

const router = express.Router();

router
  .post("/send", Auth, ChatControllers.send)
  .get("/list/:id", Auth, ChatControllers.list);

export default router;
