import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import ResponseWrapper from "../helpers/response.helper";

class FollowerControllersClass {
  follow = async (req: Request, res: Response) => {
    const { followed } = req.body;
    const followerId = req.user?.id as string;
    await prisma.follower.create({
      data: {
        userId: followed,
        followerId: followerId,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("User Followed Successfulley")
      .send();
    await prisma.user.update({
      where: {
        id: followed,
      },
      data: {
        noOfFollowers: {
          increment: 1,
        },
      },
    });
    await prisma.user.update({
      where: {
        id: followerId,
      },
      data: {
        totalFollowed: {
          increment: 1,
        },
      },
    });
  };
}
export const FollowerControllers = new FollowerControllersClass();
