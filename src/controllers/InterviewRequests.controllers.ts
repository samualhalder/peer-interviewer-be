import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import ResponseWrapper from "../helpers/response.helper";

class InterviewRequestControllerClass {
  sent = async (req: Request, res: Response) => {
    const { to } = req.body;
    const from = req.user?.id as string;
    await prisma.interviewRequests.create({
      data: {
        from: from,
        to: to,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("Request sent  Successfulley")
      .send();
  };
  unsent = async (req: Request, res: Response) => {
    const { to } = req.body;
    const from = req.user?.id as string;
    await prisma.interviewRequests.deleteMany({
      where: {
        from: from,
        to: to,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("Request removed  Successfulley")
      .send();
  };
  issent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const from = req.user?.id as string;
    const findRequest = await prisma.interviewRequests.findMany({
      where: {
        from: from,
        to: id,
      },
    });
    if (findRequest.length > 0) {
      ResponseWrapper(res).status(200).body(true).send();
    } else {
      ResponseWrapper(res).status(200).body(false).send();
    }
  };
}
export const InterviewRequestControllers =
  new InterviewRequestControllerClass();
