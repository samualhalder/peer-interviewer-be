import express, {
  Application,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import morgan from "morgan";
import UserRouter from "../routes/user.route";

import errorhandlerMiddleware from "../middlewares/errorhandler.middleware";
import loggerHelper from "../helpers/logger.helper";
export default (app: Application) => {
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use("/api/auth", UserRouter);
  app.use(errorhandlerMiddleware);
  app.use("*", (req: Request, res: Response) => {
    res
      .send({ error: true, message: "Route Not Fould", result: null })
      .status(404);
  });
};

loggerHelper.info("🛣️ Route Setup completed");
