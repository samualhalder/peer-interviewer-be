import express from "express";
import Auth from "../middlewares/auth.middleware";
import { NotificationControllers } from "../controllers/notification.controllers";

const router=express.Router()

router
.get('/list',Auth,NotificationControllers.list)
.get('/unseens',Auth,NotificationControllers.unseenNotifications)
.put('/seen/:id',Auth,NotificationControllers.seen)

export default router
