import {Router} from "express";
import { asyncHandler, ValidateRequest } from "@chatapp/common";
import { registerSchema } from "@/validation/auth.schema";
import {registerController} from "@/controller/auth.controller"

export const authRouter : Router = Router();

authRouter.post("/register",ValidateRequest({body: registerSchema}), asyncHandler(registerController) )
