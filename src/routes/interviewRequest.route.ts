import express from "express";
import Auth from "../middlewares/auth.middleware";
import { InterviewRequestControllers } from "../controllers/InterviewRequests.controllers";

const router = express.Router();

router
  .post("/sent", Auth, InterviewRequestControllers.sent)
  .post("/unsend", Auth, InterviewRequestControllers.unsent)
  .get("/issend/:id", Auth, InterviewRequestControllers.issent)
  .get("/list", Auth, InterviewRequestControllers.list)
  .get("/list-sent", Auth, InterviewRequestControllers.listSend)
  .get("/is-new-requests", Auth, InterviewRequestControllers.haveNewRequest)
  .get("/is-accepted/:to", Auth, InterviewRequestControllers.isAccepted)
  .get("/can-chat/:to", Auth, InterviewRequestControllers.canChat)
  .get("/int-stats/:id", Auth, InterviewRequestControllers.interviewStatsbyId)
  .get("/get-int-id", Auth, InterviewRequestControllers.getInterviewId)
  .put("/accept/:id", Auth, InterviewRequestControllers.accpet)
  .put("/reject/:id", Auth, InterviewRequestControllers.reject)
  .put("/end/:id", Auth, InterviewRequestControllers.endMeeting);

export default router;
