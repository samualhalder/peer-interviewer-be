import prisma from "../startups/prisma.startup";
import { getIo } from "../startups/socket.startup";

export async function SendNotificaiton(
  userId: string,
  title: string,
  content: string,
  link: string
) {
  const notificationObj = {
    userId: userId,
    title: title,
    content: content,
    link: link,
    seen: false,
  };
  const notification = await prisma.notifications.create({
    data: notificationObj,
  });
  const { io, userSocketId } = getIo();
  io.to(userSocketId.get(userId)).emit("notification", notification);
}
