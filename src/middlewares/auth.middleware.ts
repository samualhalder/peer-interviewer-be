import { NextFunction, Request, Response } from "express";

import jwt, { decode } from "jsonwebtoken";
import HttpError from "../helpers/httpError.helper";
import prisma from "../startups/prisma.startup";
import { UserType } from "../types";
import loggerHelper from "../helpers/logger.helper";

const { JWT_SECRET } = process.env;




const Auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  try {
    if (!authHeader) {
      throw new HttpError(401, "Authorization header is missing");
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new HttpError(401, "Unauthorized: Missing Token");
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as UserType;
    const user = (await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    })) as UserType;

    if (!user || decoded.id !== user.id) {
      throw new HttpError(401, "Unauthorized: Invalid Token");
    }
    req.user = user;

    loggerHelper.info(`User authenticated: ${user}`);
    next();
  } catch (error) {
    throw new HttpError(401, "Unauthorized");
  }
};

export default Auth;
