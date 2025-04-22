import express from "express";
import Auth from "../middlewares/auth.middleware";
import { FollowerControllers } from "../controllers/follower.controllers";
const router = express.Router();

router
  .post("/follow", Auth, FollowerControllers.follow)
  .post("/unfollow", Auth, FollowerControllers.unFollow)
  .get("/isfollowing/:id", Auth, FollowerControllers.isFollowed);

export default router;
