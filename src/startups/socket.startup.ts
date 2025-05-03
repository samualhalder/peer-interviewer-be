import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import loggerHelper from "../helpers/logger.helper";

export default (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("new user is connected", socket.id);
  });
  loggerHelper.info("⚡ Socket Connected successsfully");
};
