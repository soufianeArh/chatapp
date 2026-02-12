import {Router} from "express";
import { asyncHandler, ValidateRequest } from "@chatapp/common";
import { registerSchema, loginSchema, refreshTokenSchema, revokeSchema } from "@/validation/auth.schema";
import {registerController, loginController, refreshTokenController, revokeTokenController} from "@/controller/auth.controller"

export const authRouter : Router = Router();

authRouter.post("/register",ValidateRequest({body: registerSchema}), asyncHandler(registerController) );
authRouter.post("/login",ValidateRequest({body: loginSchema}), asyncHandler(loginController));
authRouter.post("/refresh",ValidateRequest({body: refreshTokenSchema}), asyncHandler(refreshTokenController));
authRouter.post("/revoke",ValidateRequest({body: revokeSchema}), asyncHandler(revokeTokenController));




