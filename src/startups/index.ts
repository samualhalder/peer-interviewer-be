import { Application } from "express";
import http from "http";
import dotenv from "dotenv";
import routesStartup from "./routes.startup";
import errorStartup from "./error.startup";
import loggerHelper from "../helpers/logger.helper";
import { initializeSocket } from "./socket.startup";
dotenv.config();
const PORT = process.env.PORT || 8081;

export default async (app: Application) => {
  const server = http.createServer(app);
  routesStartup(app);
  errorStartup();
  await initializeSocket(server);
  server.listen(PORT, () => {
    loggerHelper.info(`🚀 Server Started At PORT ${PORT}`);
  });
};
