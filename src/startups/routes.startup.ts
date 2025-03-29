import express, { Application, Request, Response } from "express";
import UserRouter from "../routes/user.route";
export default (app: Application) => {
  app.use(express.json());
  app.use("/api/auth", UserRouter);

  app.use("*", (req: Request, res: Response) => {
    res
      .send({ error: true, message: "Route Not Fould", result: null })
      .status(404);
  });
};
