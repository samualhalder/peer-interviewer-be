import express, {
  Application,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import morgan from "morgan";
import cors from "cors";
import UserRouter from "../routes/user.route";
import FollowerRouter from "../routes/followers.route";
import ChatRouter from "../routes/chat.routes";
import NotificationRouter from "../routes/notification.routes";

import InterviewRequestRouter from "../routes/interviewRequest.route";

import errorhandlerMiddleware from "../middlewares/errorhandler.middleware";
import loggerHelper from "../helpers/logger.helper";
export default (app: Application) => {
  app.use(express.json());
  app.use(cors());
  app.use(morgan("tiny"));
  app.use("/api/auth", UserRouter);
  app.use("/api/followers", FollowerRouter);
  app.use("/api/interview-requests", InterviewRequestRouter);
  app.use("/api/chats", ChatRouter);
  app.use("/api/notifications",NotificationRouter );
  app.use(errorhandlerMiddleware);
  app.use("*", (req: Request, res: Response) => {
    res
      .send({ error: true, message: "Route Not Found", result: null })
      .status(404);
  });
};

loggerHelper.info("🛣️ Route Setup completed");
