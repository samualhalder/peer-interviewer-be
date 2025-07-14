import { Request, Response } from "express"
import prisma from "../startups/prisma.startup"
import ResponseWrapper from "../helpers/response.helper"

class NotificationControllersClass{
    list=async(req:Request,res:Response)=>{
        const id=req.user?.id
        const results=await prisma.notifications.findMany({
            where:{
                userId:id
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        ResponseWrapper(res).status(200).body(results).send()
    }
    seen=async(req:Request,res:Response)=>{
        const id=req.params.id
        await prisma.notifications.update({
            where:{
                id:id
            },data:{
                seen:true
            }
        })
        ResponseWrapper(res).status(200).send()
    }
}
export const NotificationControllers= new NotificationControllersClass()
