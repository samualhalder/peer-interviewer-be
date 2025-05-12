import { Server, Socket } from "socket.io";
import loggerHelper from "../helpers/logger.helper";

let io: Server | null = null;

export const initializeSocket = async (server: any): Promise<void> => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on("message", (data) => {
      io?.emit(`${data.chatId}`, data);
      console.log("emit succesfull");
    });
    socket.emit("get-socketId", socket.id);

    socket.on("disconnect", (reason: string) => {
      console.log("disconnect due to ", reason);
    });
  });
  loggerHelper.info("⚡ Socket connected successfully");
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error("⚡ Socket.io not initialized");
  }
  return io;
};
