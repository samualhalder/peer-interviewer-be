import express from "express";
import { UserControllers } from "../controllers/user.controllers";
import Auth from "../middlewares/auth.middleware";

const router = express.Router();

router
  .post("/signup", UserControllers.signUp)
  .post("/signin", UserControllers.signIn)
  .post("/valid-jwt", UserControllers.checkValidJWT)
  .post("/forgot-password", UserControllers.forgotPassord)
  .post("/validate-token", UserControllers.validateToken)
  .post("/reset-forgot-password", UserControllers.resetForgotPassword)
  .get("/get-user-by-token", Auth, UserControllers.getUserByToken)
  .put("/update", Auth, UserControllers.update)
  .put("/reset-password", Auth, UserControllers.resetPassword)
  .get("/get-users", Auth, UserControllers.getUser)
  .get("/get-user/:id", UserControllers.getUserById)
  .get("/is-password-set", Auth, UserControllers.isPassowrdSet);

router.post("/oauth", UserControllers.OAuthFuntion);

export default router;
