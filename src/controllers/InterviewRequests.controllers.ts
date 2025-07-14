import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import ResponseWrapper from "../helpers/response.helper";
import HttpError from "../helpers/httpError.helper";
import { Status } from "@prisma/client";
import { SendNotificaiton } from "../helpers/sendNotification";

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
    await SendNotificaiton(to,"Incoming Interview Request","You got a interview request","/requests")
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
    const findRequest = await prisma.interviewRequests.findFirst({
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
    if (findRequest) {
      ResponseWrapper(res)
        .status(200)
        .body({ flag: true, status: findRequest.status })
        .send();
    } else {
      ResponseWrapper(res).status(200).body({ flag: false, status: "" }).send();
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
      } else if (status == "completed") {
        queryObj.where.status = "completed";
      } else if (status == "rejected") {
        queryObj.where.status = "rejected";
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
    await prisma.interviewRequests.update({
      where: {
        id: id,
      },
      data:{
        status:"rejected"
      }
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

    if (status == "pending") {
      queryObj.where.status = "pending";
    } else if (status == "accepted") {
      queryObj.where.status = "accepted";
    } else if (status == "completed") {
      queryObj.where.status = "completed";
    } else if (status == "rejected") {
      queryObj.where.status = "rejected";
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
  getInterviewId = async (req: Request, res: Response) => {
    const { from, to } = req.query;
    const int = await prisma.interviewRequests.findFirst({
      where: {
        from: from as string,
        to: to as string,
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
    if (!int) {
      ResponseWrapper(res).body(null).status(200).send();
    } else {
      ResponseWrapper(res).body(int.id).status(200).send();
    }
  };
  endMeeting = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("endind id", id);

    const bod = await prisma.interviewRequests.update({
      where: {
        id: id,
      },
      data: {
        status: "completed",
      },
    });
    console.log("int bdy", bod);

    ResponseWrapper(res).status(200).message("interview ended").send();
  };
}
export const InterviewRequestControllers =
  new InterviewRequestControllerClass();
