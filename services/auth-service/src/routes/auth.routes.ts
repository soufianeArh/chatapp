import {Router} from "express";
import {loginController, registerController} from "@/controllers/auth.controler";
import {ValidateRequest} from "@chatapp/common";
import { registerSchema, loginSchema } from "./auth.schema";

export const authRouter: Router = Router();

authRouter.post("/register",ValidateRequest({body: registerSchema.shape.body}), registerController);
authRouter.post("/login", ValidateRequest({body: loginSchema.shape.body}), loginController)
