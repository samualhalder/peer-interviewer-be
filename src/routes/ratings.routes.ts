import express from "express";
import Auth from "../middlewares/auth.middleware";
import { RatingController } from "../controllers/ratings.controllers";

const router = express.Router();

router
  .get("/list-given", Auth, RatingController.listGiven)
  .get("/list-recived", Auth, RatingController.listRecived)
  .get("/get-by-interview/:id", Auth, RatingController.getRatingByIntId)
  .get("/avg/:id", Auth, RatingController.avg) // interviewId(userId)
  .post("/give/:id", Auth, RatingController.give) // interviewId
  .put("/update/:id", Auth, RatingController.update) //interviewId
  .delete("/delete/:id", Auth, RatingController.delete); //ratingId

export default router;
