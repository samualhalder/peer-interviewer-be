import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import { createChatId } from "../helpers/createChatId.helper";
import ResponseWrapper from "../helpers/response.helper";

class ChatControllersClass {
  send = async (req: Request, res: Response) => {
    const from = req.user?.id as string;

    await prisma.chats.create({
      data: {
        text: req.body.text as string,
        from: from,
        to: req.body.to as string,
        chatId: createChatId(from, req.body.to),
      },
    });
    ResponseWrapper(res).status(200).message("ok").send();
  };
  list = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("id is", id);

    const results = await prisma.chats.findMany({
      where: {
        chatId: createChatId(req.user?.id as string, id),
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        fromUser: true,
        toUser: true,
      },
    });
    ResponseWrapper(res).status(200).body(results).send();
  };
}
export const ChatControllers = new ChatControllersClass();
