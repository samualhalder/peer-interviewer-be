import express from "express";
import UserControllers from "../controllers/user.controllers";

const router = express.Router();

router
  .post("/signup", UserControllers.signUp)
  .post("/signin", UserControllers.signIn);

export default router;
