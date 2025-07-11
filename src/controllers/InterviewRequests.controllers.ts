import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import ResponseWrapper from "../helpers/response.helper";
import HttpError from "../helpers/httpError.helper";
import { Status } from "@prisma/client";

class InterviewRequestControllerClass {
  sent = async (req: Request, res: Response) => {
    const { to } = req.body;
    const from = req.user?.id as string;
    const findReq = await prisma.interviewRequests.findMany({
      where: {
        from: from,
        to: to,
        OR: [
          {
            status: "pending",
          },
          {
            status: "accepted",
          },
        ],
      },
    });

    if (findReq.length) {
      throw new HttpError(400, "Already have sent a request");
    }
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
    const findReq = await prisma.interviewRequests.findMany({
      where: {
        from: from,
        to: to,
        OR: [
          {
            status: "pending",
          },
          {
            status: "accepted",
          },
        ],
      },
    });

    if (findReq.length == 0) {
      throw new HttpError(400, "No requect to unsend");
    }
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
        OR: [
          {
            status: "pending",
          },
          {
            status: "accepted",
          },
        ],
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
      where: { to: string; status?: Status };
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
        queryObj.where.status = "pending";
      } else if (status == "accepted") {
        queryObj.where.status = "accepted";
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
        status: "accepted",
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
      where: { from: string; status?: Status };
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
        queryObj.where.status = "pending";
      } else if (status == "accepted") {
        queryObj.where.status = "accepted";
      }
    }
    if (order == "asc") {
      queryObj.orderBy.createdAt = "asc";
    }

    const result = await prisma.interviewRequests.findMany(queryObj);
    ResponseWrapper(res).status(200).body(result).send();
  };
  haveNewRequest = async (req: Request, res: Response) => {
    const id = req.user?.id as string;
    const newRequests = await prisma.interviewRequests.count({
      where: {
        to: id,
        status: "pending",
      },
    });
    ResponseWrapper(res).status(200).body(newRequests).send();
  };
  isAccepted = async (req: Request, res: Response) => {
    const { to } = req.params;
    const userId = req.user?.id as string;
    const findAcceptedRequest = await prisma.interviewRequests.findMany({
      where: {
        from: to,
        to: userId,
        status: "accepted",
      },
    });

    ResponseWrapper(res).status(200).body(findAcceptedRequest).send();
  };
  canChat = async (req: Request, res: Response) => {
    const { to } = req.params;
    const userId = req.user?.id as string;
    const findAcceptedRequest1 = await prisma.interviewRequests.findMany({
      where: {
        from: to,
        to: userId,
        status: "accepted",
      },
    });
    const findAcceptedRequest2 = await prisma.interviewRequests.findMany({
      where: {
        from: userId,
        to: to,
        status: "accepted",
      },
    });
    console.log("hit", findAcceptedRequest1, findAcceptedRequest2);
    if (findAcceptedRequest1.length || findAcceptedRequest2.length) {
      ResponseWrapper(res).status(200).body(true).send();
    } else {
      ResponseWrapper(res).status(200).body(false).send();
    }
  };
  interviewStatsbyId = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("id", id);

    const intGiven = await prisma.interviewRequests.findMany({
      where: {
        from: id,
        status: "completed",
      },
    });
    const intTaken = await prisma.interviewRequests.findMany({
      where: {
        to: id,
        status: "completed",
      },
    });
    const upcommings = await prisma.interviewRequests.findMany({
      where: {
        from: id,
        status: "pending",
      },
    });
    ResponseWrapper(res)
      .status(200)
      .body({
        intGiven: intGiven.length,
        intTaken: intTaken.length,
        upcommings: upcommings.length,
        canceled: 0,
      })
      .send();
  };
}
export const InterviewRequestControllers =
  new InterviewRequestControllerClass();
