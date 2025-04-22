import express from "express";
import Auth from "../middlewares/auth.middleware";
import { InterviewRequestControllers } from "../controllers/InterviewRequests.controllers";

const router = express.Router();

router
  .post("/sent", Auth, InterviewRequestControllers.sent)
  .post("/unsend", Auth, InterviewRequestControllers.unsent)
  .get("/issend/:id", Auth, InterviewRequestControllers.issent);

export default router;
