import { Server, Socket } from "socket.io";
import loggerHelper from "../helpers/logger.helper";

let io: Server | null = null;
const userSocketId = new Map<string, string>();

export const initializeSocket = async (server: any): Promise<void> => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("connect-user", (data) => {
      if (data.userId) userSocketId.set(data.userId, socket.id);
    });
    socket.on("join-room", (data) => {
      socket.join(data.chatId);
      console.log("joined-room", socket.id, data.chatId);
    });
    socket.on("message", (data) => {
      io?.to(data.chatId).emit(`${data.chatId}`, data);
    });
    socket.on("start-interview", (data) => {
      console.log("strt int", data, userSocketId);

      socket.broadcast.emit("interview-start-request", {
        room: data.room,
        offer: data.offer,
        peerId: data.userId, // have to exchange the tag as while reciving it will change only
        userId: data.peerId,
      });
    });
    socket.on("request-declined", (data) => {
      socket.broadcast.emit(`declined-${data.room}`, { room: data.room });
    });
    socket.on("call-accepted", (data) => {
      socket.broadcast.emit(`call-accepted-${data.room}`, {
        room: data.room,
        answer: data.answer,
      });
    });
    socket.on("nego-needed", (data) => {
      socket.broadcast.emit(`nego-need-${data.room}`, { offer: data.offer });
    });
    socket.on("nego-done", (data) => {
      socket.broadcast.emit(`nego-done-${data.room}`, { answer: data.answer });
    });
    socket.on("ice-candidate", (data) => {
      socket.broadcast.emit(`ice-candidate-${data.room}`, {
        candidate: data.candidate,
      });
    });
    socket.on("screen-recording", (data) => {
      socket
        .to(data.room)
        .emit(`screen-recording-${data.room}`, { videoBlob: data.videoBlob });
    });
    socket.on("share-screen", (data) => {
      console.log("got share screen");

      socket.broadcast.emit(`screen-${data.room}`, { room: data.room });
    });
    socket.on("camera-permission", (data) => {
      socket.broadcast.emit(`camera-permission-${data.roomId}`, {
        room: data.room,
      });
    });
    socket.on("audio-permission", (data) => {
      console.log("hit audio permission");

      socket.broadcast.emit(`audio-permission-${data.roomId}`, {
        room: data.room,
      });
    });

    socket.on("sharing-screen-tracks", (data) => {
      socket.broadcast.emit(`incoming-screen-sharing-${data.roomId}`, {
        trackId: data.trackId,
      });
    });
    socket.on("end-meeting", (data) => {
      console.log("ending meeting", data);

      socket.broadcast.emit(`end-meeting-${data}`);
    });
    socket.on("stoping-screen-sharing", (data) => {
      socket.broadcast.emit(`end-screen-sharing-${data.roomId}`);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("disconnect due to ", reason);
    });
  });
  loggerHelper.info("⚡ Socket connected successfully");
};

export const getIo = (): any => {
  if (!io) {
    throw new Error("⚡ Socket.io not initialized");
  }
  return { io, userSocketId };
};
