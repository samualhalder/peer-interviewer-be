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
        noOfFollowings: {
          increment: 1,
        },
      },
    });
  };
  unFollow = async (req: Request, res: Response) => {
    const { followed } = req.body;
    const followerId = req.user?.id as string;
    await prisma.follower.deleteMany({
      where: {
        userId: followed,
        followerId: followerId,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("User Un-Followed Successfulley")
      .send();
    await prisma.user.update({
      where: {
        id: followed,
      },
      data: {
        noOfFollowers: {
          decrement: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: followerId,
      },
      data: {
        noOfFollowings: {
          decrement: 1,
        },
      },
    });
  };
  isFollowed = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const findFollow = await prisma.follower.findMany({
      where: {
        userId: id,
        followerId: userId,
      },
    });
    console.log("ff", findFollow);

    if (findFollow.length > 0) {
      ResponseWrapper(res).status(200).body(true).send();
      return;
    }
    ResponseWrapper(res).status(200).body(false).send();
  };
}
export const FollowerControllers = new FollowerControllersClass();
