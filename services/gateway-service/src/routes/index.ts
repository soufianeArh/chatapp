import {Router} from "express";
import {authRouter} from "@/routes/auth.routes";

export const authGlobalRouter = (app:Router) : void=>{
      app.use("/auth", authRouter )
}