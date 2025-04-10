import express from "express";
import { UserControllers } from "../controllers/user.controllers";
import Auth from "../middlewares/auth.middleware";

const router = express.Router();

router
  .post("/signup", UserControllers.signUp)
  .post("/signin", UserControllers.signIn)
  .post("/valid-jwt", UserControllers.checkValidJWT)
  .get("/get-user-by-token", Auth, UserControllers.getUserByToken)
  .put("/update", Auth, UserControllers.update);

router.post("/oauth", UserControllers.OAuthFuntion);

export default router;
