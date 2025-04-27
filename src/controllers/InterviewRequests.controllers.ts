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
  list = async (req: Request, res: Response) => {
    const id = req.user?.id as string;
    const { status, order } = req.query;
    const queryObj: {
      where: { to: string; status?: boolean };
      orderBy: { createdAt: "asc" | "desc" };
      include: { touser: boolean; fromuser: boolean };
    } = {
      where: {
        to: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        touser: true,
        fromuser: true,
      },
    };

    if (status?.length) {
      if (status == "pending") {
        queryObj.where.status = false;
      } else if (status == "accepted") {
        queryObj.where.status = true;
      }
    }
    if (order == "asc") {
      queryObj.orderBy.createdAt = "asc";
    }

    const result = await prisma.interviewRequests.findMany(queryObj);
    ResponseWrapper(res).status(200).body(result).send();
  };
  accpet = async (req: Request, res: Response) => {
    const id = req.params.id;
    await prisma.interviewRequests.update({
      where: {
        id: id,
      },
      data: {
        seen: true,
        status: true,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("Interview Request Accepted Successfully")
      .send();
  };
  reject = async (req: Request, res: Response) => {
    const id = req.params.id;
    await prisma.interviewRequests.delete({
      where: {
        id: id,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("Interview Request Rejected Successfully")
      .send();
  };
  listSend = async (req: Request, res: Response) => {
    const id = req.user?.id as string;
    const { status, order } = req.query;
    const queryObj: {
      where: { from: string; status?: boolean };
      orderBy: { createdAt: "asc" | "desc" };
      include: { touser: boolean; fromuser: boolean };
    } = {
      where: {
        from: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        touser: true,
        fromuser: true,
      },
    };

    if (status?.length) {
      if (status == "pending") {
        queryObj.where.status = false;
      } else if (status == "accepted") {
        queryObj.where.status = true;
      }
    }
    if (order == "asc") {
      queryObj.orderBy.createdAt = "asc";
    }

    const result = await prisma.interviewRequests.findMany(queryObj);
    ResponseWrapper(res).status(200).body(result).send();
  };
}
export const InterviewRequestControllers =
  new InterviewRequestControllerClass();
