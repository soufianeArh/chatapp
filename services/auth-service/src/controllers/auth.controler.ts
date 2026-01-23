import type {  Response, Request, NextFunction, RequestHandler } from "express";
import {type AsyncHandler, asyncHandler} from "@chatapp/common"
import { RegisterInput } from "@/types/auth";
import { register } from "@/services/auth.service";

export const registerController: RequestHandler = asyncHandler(async (req, res) =>{
      const payload = req.body as RegisterInput;
      const registerData = await register(payload);
      res.status(201).json({registerInfo: registerData})
})