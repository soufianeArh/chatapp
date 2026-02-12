import {Router} from "express";
import {loginController, registerController, refreshTokenController, revokeRefreshTokenController} from "@/controllers/auth.controler";
import {ValidateRequest} from "@chatapp/common";
import { registerSchema, loginSchema, refreshTokenSchema, revokeSchema } from "./auth.schema";

export const authRouter: Router = Router();

authRouter.post("/register",ValidateRequest({body: registerSchema.shape.body}), registerController);
authRouter.post("/login", ValidateRequest({body: loginSchema.shape.body}), loginController);
authRouter.post("/refresh", ValidateRequest({body: refreshTokenSchema.shape.body}), refreshTokenController);
authRouter.post("/revoke", ValidateRequest({body: revokeSchema.shape.body}), revokeRefreshTokenController);


