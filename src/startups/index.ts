import { Application } from "express";
import dotenv from "dotenv";
import routesStartup from "./routes.startup";
import errorStartup from "./error.startup";
import loggerHelper from "../helpers/logger.helper";
dotenv.config();
const PORT = process.env.PORT || 8081;

export default (app: Application) => {
  routesStartup(app);
  errorStartup();
  app.listen(PORT, () => {
    loggerHelper.info(`🚀 Server Started At PORT ${PORT}`);
  });
};
