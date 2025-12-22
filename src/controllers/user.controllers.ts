import { Request, Response } from "express";
import prisma from "../startups/prisma.startup";
import HttpError from "../helpers/httpError.helper";
import ResponseWrapper from "../helpers/response.helper";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../helpers/token.helper";
import { UserType } from "../types";
import jwt from "jsonwebtoken";
import { sendMail } from "../helpers/mail.helper";
import crypto, { BinaryLike } from "crypto";

class UserControllerClass {
  signUp = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    console.log(email, password, name);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new HttpError(400, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });
    const token = generateAccessToken(newUser.id, newUser.email, newUser.name);
    ResponseWrapper(res)
      .status(200)
      .body(token)
      .message("Signup Successfull")
      .send();
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

  OAuthFuntion = async (req: Request, res: Response) => {
    const { email, name, image } = req.body;
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findUser) {
      const accessToken = generateAccessToken(
        findUser.id,
        findUser.email,
        findUser.name
      );
      ResponseWrapper(res)
        .status(200)
        .body(accessToken)
        .message("Login Successfull")
        .send();
    } else {
      const Randompassword = Math.random().toString(36).slice(-8);
      const hasdedPassword = await bcrypt.hash(Randompassword, 10);
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hasdedPassword,
          name: name,
          image: image,
        },
      });
      const accessToken = generateAccessToken(user.id, user.email, user.name);
      ResponseWrapper(res)
        .status(200)
        .body(accessToken)
        .message("Signup Successfull")
        .send();
    }
  };
  googelAuth = async (req: Request, res: Response) => {
    const { email, name, image } = req.body;
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findUser) {
      const accessToken = generateAccessToken(
        findUser.id,
        findUser.email,
        findUser.name
      );
      return ResponseWrapper(res)
        .status(200)
        .body(accessToken)
        .message("Login Successfull")
        .send();
    } else {
      const Randompassword = Math.random().toString(36).slice(-8);
      const hasdedPassword = bcrypt.hashSync(Randompassword, 10);
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hasdedPassword,
          name: name,
          image: image,
        },
      });
      const accessToken = generateAccessToken(user.id, user.email, user.name);
      return ResponseWrapper(res)
        .status(200)
        .body(accessToken)
        .message("Signup Successfull")
        .send();
    }
  };
  checkValidJWT = async (req: Request, res: Response) => {
    const decoded = jwt.verify(
      req.body.token,
      process.env.JWT_SECRET as string
    ) as UserType;
    const user = (await prisma.user.findUnique({
      where: {
        email: decoded.email as string,
      },
    })) as UserType;

    if (!user || decoded.id !== user.id) {
      throw new HttpError(401, "Unauthorized: Invalid Token");
    }

    ResponseWrapper(res).status(200).send();
  };
  getUserByToken = async (req: Request, res: Response) => {
    ResponseWrapper(res).status(200).body(req.user).send();
  };
  update = async (req: Request, res: Response) => {
    const { name, location, organization, description, image, skills } =
      req.body;
    console.log("hit", image);
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        name: name,
        location: location,
        image: image,
        skills: skills,
        organization: organization,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .body(updatedUser)
      .message("User Updated Successfully")
      .send();
  };
  resetPassword = async (req: Request, res: Response) => {
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      throw new HttpError(
        400,
        "New Password and connfirm password should match"
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("Password changed successfully")
      .send();
  };
  getUser = async (req: Request, res: Response) => {
    const { slug } = req.query;
    const data = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: slug as string,
                  mode: "insensitive",
                },
              },
              {
                organization: {
                  contains: slug as string,
                  mode: "insensitive",
                },
              },
              {
                skills: {
                  contains: slug as string,
                  mode: "insensitive",
                },
              },
              {
                location: {
                  contains: slug as string,
                  mode: "insensitive",
                },
              },
            ],
          },
          {
            id: {
              not: req?.user?.id as string,
            },
          },
        ],
      },
    });
    ResponseWrapper(res).status(200).body(data).send();
  };
  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    ResponseWrapper(res).status(200).body(user).send();
  };
  isPassowrdSet = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
    });
    ResponseWrapper(res).status(200).body(user?.isPasswordSet).send();
  };
  forgotPassord = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const hashedtoken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const expiryTime = new Date(Date.now() + 3 * 60 * 60 * 1000);
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          token: hashedtoken,
          tokenExpiry: expiryTime,
        },
      });
      await sendMail(email, token);
    }

    ResponseWrapper(res)
      .status(200)
      .message("Email sent to the mail id")
      .send();
  };
  validateToken = async (req: Request, res: Response) => {
    const { token } = req.query;
    const hashedToken = crypto
      .createHash("sha256")
      .update(token as BinaryLike)
      .digest("hex");
    const user = await prisma.user.findFirst({
      where: {
        token: hashedToken,
      },
    });
    if (!user) {
      throw new HttpError(404, "No Token found");
    }
    if (
      (user?.tokenExpiry || new Date(Date.now() - 1)) < new Date(Date.now())
    ) {
      throw new HttpError(400, "Token expired");
    }
    ResponseWrapper(res).status(200).send();
  };
  resetForgotPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const hashedToken = crypto
      .createHash("sha256")
      .update(token as BinaryLike)
      .digest("hex");
    const user = await prisma.user.findFirst({
      where: {
        token: hashedToken,
      },
    });
    if (!user) {
      throw new HttpError(404, "No Token found");
    }
    if (
      (user?.tokenExpiry || new Date(Date.now() - 1)) < new Date(Date.now())
    ) {
      throw new HttpError(400, "Token expired");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        token: null,
        tokenExpiry: null,
      },
    });
    ResponseWrapper(res)
      .status(200)
      .message("Password reset successfully")
      .send();
  };
}

export const UserControllers = new UserControllerClass();
