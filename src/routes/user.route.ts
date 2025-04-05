import express from "express";
import UserControllers from "../controllers/user.controllers";
import Auth from "../middlewares/auth.middleware";
import userControllers from "../controllers/user.controllers";

const router = express.Router();

router
  .post("/signup", UserControllers.signUp)
  .post("/signin", UserControllers.signIn)
  .post("/valid-jwt", userControllers.checkValidJWT);

export default router;
