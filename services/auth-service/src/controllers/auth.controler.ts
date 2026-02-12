import type { RequestHandler } from "express";
import { asyncHandler, HttpError} from "@chatapp/common"
import { LoginInput, RegisterInput } from "@/types/auth";
import { register, login, refreshToken, revokeRefreshToken } from "@/services/auth.service";

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

export const refreshTokenController: RequestHandler = asyncHandler(async (req,res)=>{
      const payload = req.body as {refreshToken:string};
      const refreshTokenData = await refreshToken(payload.refreshToken);
      res.status(200).json(refreshTokenData)

});

export const revokeRefreshTokenController : RequestHandler = asyncHandler(async (req,res)=>{
      const paylaod = req.body as {userId?: string}
      if(!paylaod.userId){
            throw new HttpError(400, "UserId is required")
      }
      await revokeRefreshToken(paylaod.userId);
      res.status(204).send()
})

