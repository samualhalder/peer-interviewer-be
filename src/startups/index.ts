import { Application } from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import routesStartup from "./routes.startup";
import errorStartup from "./error.startup";
import loggerHelper from "../helpers/logger.helper";
import socketStartup from "./socket.startup";
dotenv.config();
const PORT = process.env.PORT || 8081;

export default (app: Application) => {
  const server = createServer(app);
  routesStartup(app);
  errorStartup();
  socketStartup(server);
  server.listen(PORT, () => {
    loggerHelper.info(`🚀 Server Started At PORT ${PORT}`);
  });
};
