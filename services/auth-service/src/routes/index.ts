import {authRouter} from "@/routes/auth.routes";
import {Router} from "express";
import type { Request, Response } from "express";

export const authGlobalRoutes= (app: Router) =>{
      app.get("/health", (req:Request, res: Response)=>{
            res.status(200).json({success:"true", message:"Successfully wortrking api auth"})
      })
      app.use("/auth", authRouter)
}