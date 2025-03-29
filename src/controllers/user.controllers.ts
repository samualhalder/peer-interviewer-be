import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import HttpError from "../helpers/httpError.helper";
import ResponseWrapper from "../helpers/response.helper";

class UserControllers {
  signUp = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (user) {
        throw new HttpError(400, "User already exists");
      }
      await prisma.user.create({
        data: {
          email: email,
          password: password,
          name: name,
        },
      });
      ResponseWrapper(res).status(200).message("Signup Successfull").send();
    } catch (error) {
      throw new HttpError(400, "Some thing went wrong");
    }
  };
  //   ignIn = async (req, res) => {};
  //   resetPassword = async (req, res) => {};
  //   deleteAccount = async (req, res) => {};s
}

export default new UserControllers();
