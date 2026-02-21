import { Router } from "express";
import { authRouter } from "@/routes/auth.routes";
import { userRouter } from "./user.routes";

export const globalRouter = (app: Router) : void=>{
      app.use("/auth", authRouter)
      app.use("/users", userRouter)
}