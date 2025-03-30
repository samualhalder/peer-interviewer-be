import winston from "winston";
import Logger from "../helpers/logger.helper";

export default () => {
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
      }),
      winston.format.prettyPrint()
    ),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [
      new winston.transports.File({ filename: "logs/exception.log" }),
      new winston.transports.Console(),
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: "logs/rejections.log" }),
      new winston.transports.Console(),
    ],
  });
  Logger.info("🚧 Error Handler Applied");
};
