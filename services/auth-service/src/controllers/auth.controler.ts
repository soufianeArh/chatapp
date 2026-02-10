import type { RequestHandler } from "express";
import { asyncHandler} from "@chatapp/common"
import { LoginInput, RegisterInput } from "@/types/auth";
import { register, login } from "@/services/auth.service";

export const registerController: RequestHandler = asyncHandler(async (req, res) =>{
      const payload = req.body as RegisterInput;
      const registerData = await register(payload);
      res.status(201).json({registerInfo: registerData})
});

export const loginController: RequestHandler = asyncHandler(async (req, res)=>{
      const payload = req.body as LoginInput;
      const loginData = await login(payload);
      res.status(200).json({loginInfo: loginData})
});