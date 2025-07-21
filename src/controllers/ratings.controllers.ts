import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import HttpError from "../helpers/httpError.helper";
import ResponseWrapper from "../helpers/response.helper";

class RatingControllersClass {
  getRatingByIntId = async (req: Request, res: Response) => {
    const id = req.params.id;
    const rating = await prisma.ratings.findFirst({
      where: {
        interviewId: id,
      },
    });
    if (!rating) {
      throw new HttpError(400, "No rating for this interview is given");
    }
    ResponseWrapper(res).status(200).body(rating).send();
  };
  give = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!req.body.rating) {
      throw new HttpError(400, "Rating field is required");
    }
    const rating = await prisma.ratings.findFirst({
      where: {
        interviewId: id,
      },
    });
    if (rating) {
      throw new HttpError(400, "Already given rating for this interview");
    }
    const intrerview = await prisma.interviewRequests.findUnique({
      where: {
        id: id,
      },
    });
    if (intrerview?.from != req.user?.id) {
      throw new HttpError(
        400,
        "You are not allowed to give a rating on this interview"
      );
    }
    const ratingInt = parseInt(req.body.rating);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      throw new HttpError(400, "Rating is invalid");
    }
    await prisma.ratings.create({
      data: {
        userId: req.user?.id as string,
        interviewerId: intrerview?.to as string,
        interviewId: id,
        rating: req.body.rating,
        review: req.body.review,
      },
    });
    ResponseWrapper(res).status(201).message("Rating is added").send();
  };
  delete = async (req: Request, res: Response) => {
    const id = req.params.id;

    const rating = await prisma.ratings.findFirst({
      where: {
        id: id,
      },
    });
    if (!rating) {
      throw new HttpError(400, "No such rating");
    }
    const intrerview = await prisma.interviewRequests.findUnique({
      where: {
        id: id,
      },
    });
    if (intrerview?.from != req.user?.id) {
      throw new HttpError(
        400,
        "You are not allowed to delete this rating on this interview"
      );
    }

    await prisma.ratings.delete({
      where: {
        id: id,
      },
    });
    ResponseWrapper(res).status(201).message("Rating is deleted").send();
  };
  update = async (req: Request, res: Response) => {
    const id = req.params.id;
    const rating = await prisma.ratings.findFirst({
      where: {
        interviewId: id,
      },
    });
    if (!rating) {
      throw new HttpError(400, "No rating is given");
    }

    const intrerview = await prisma.interviewRequests.findUnique({
      where: {
        id: id,
      },
    });
    if (intrerview?.from != req.user?.id) {
      throw new HttpError(
        400,
        "You are not allowed to give a rating on this interview"
      );
    }

    const ratingInt = parseInt(req.body.rating);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      throw new HttpError(400, "Rating is invalid");
    }
    await prisma.ratings.update({
      where: {
        id: rating.id,
      },
      data: {
        rating: ratingInt,
        review: req.body.review,
      },
    });
    ResponseWrapper(res).status(200).message("Rating is Updatd").send();
  };
  listGiven = async (req: Request, res: Response) => {
    const ratings = await prisma.ratings.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        interview: true,
        interviewer: true,
      },
    });
    ResponseWrapper(res).status(200).body(ratings).send();
  };
  listRecived = async (req: Request, res: Response) => {
    const ratings = await prisma.ratings.findMany({
      where: {
        interviewerId: req.user?.id,
      },
      include: {
        interview: true,
        User: true,
      },
    });
    ResponseWrapper(res).status(200).body(ratings).send();
  };
  avg = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await prisma.ratings.aggregate({
      where: {
        interviewerId: id,
      },
      _avg: {
        rating: true,
      },
    });
    ResponseWrapper(res).body(result).status(200).send();
  };
}
export const RatingController = new RatingControllersClass();
