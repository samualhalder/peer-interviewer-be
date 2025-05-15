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
    socket.on("join-room", (data) => {
      socket.join(data.chatId);
      console.log("joined-room", socket.id, data.chatId);
    });
    socket.on("message", (data) => {
      io?.to(data.chatId).emit(`${data.chatId}`, data);
    });
    socket.on("start-interview", (data) => {
      console.log("sit", data);

      socket.broadcast.emit("interview-start-request", { room: data.room });
    });
    socket.on("request-declined", (data) => {
      socket.broadcast.emit(`declined-${data.room}`, { room: data.room });
    });

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
