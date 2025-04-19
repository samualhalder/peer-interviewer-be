import express from "express";
import Auth from "../middlewares/auth.middleware";
import { FollowerControllers } from "../controllers/follower.controllers";
const router = express.Router();

router.post("/follow", Auth, FollowerControllers.follow);

export default router;
