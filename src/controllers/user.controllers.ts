import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import HttpError from "../helpers/httpError.helper";
import ResponseWrapper from "../helpers/response.helper";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../helpers/token.helper";
import { UserType } from "../types";

class UserControllers {
  signUp = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new HttpError(400, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });
    ResponseWrapper(res).status(200).message("Signup Successfull").send();
  };

  signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const findUser = (await prisma.user.findUnique({
      where: {
        email: email,
      },
    })) as UserType;
    if (!findUser) {
      throw new HttpError(400, "No Such User");
    }
    const isValidPassword = await bcrypt.compare(
      password,
      findUser.password as string
    );
    if (!isValidPassword) {
      throw new HttpError(400, "Wrong credentials");
    }
    const accessToken = generateAccessToken(
      findUser.id,
      findUser.email,
      findUser.name
    );
    ResponseWrapper(res)
      .status(200)
      .body(accessToken)
      .message("Sign in successfull"!)
      .send();
  };
}

export default new UserControllers();
