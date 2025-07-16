import express from "express";
import Auth from "../middlewares/auth.middleware";
import { RatingController } from "../controllers/ratings.controllers";

const router=express.Router()

router
.get('/list/:id',Auth,RatingController.list)
.get('/avg/:id',Auth,RatingController.avg)
.post('/add',Auth,RatingController.give)
.put('/update/:id',Auth,RatingController.update)
.delete('/delete/:id',Auth,RatingController.delete)

export default router
