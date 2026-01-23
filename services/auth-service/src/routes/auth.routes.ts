import {Router} from "express";
import {registerController} from "@/controllers/auth.controler";
import {ValidateRequest} from "@chatapp/common";
import { registerSchema } from "./auth.schema";

export const authRouter: Router = Router();

authRouter.post("/register",ValidateRequest({body: registerSchema.shape.body}), registerController )
