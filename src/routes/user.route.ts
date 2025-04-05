import express from "express";
import { UserControllers } from "../controllers/user.controllers";

const router = express.Router();

router
  .post("/signup", UserControllers.signUp)
  .post("/signin", UserControllers.signIn)
  .post("/valid-jwt", UserControllers.checkValidJWT);

router.post("/oauth", UserControllers.OAuthFuntion);

export default router;
