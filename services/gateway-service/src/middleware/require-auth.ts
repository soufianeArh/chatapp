import { HttpError } from "@chatapp/common";
import type { RequestHandler, } from "express";
import jwt from 'jsonwebtoken';
import { env } from "@/config/env";

interface AccessTokenClaims{
      sub:string,
      email:string
};
interface authenticateUser {
      id:string,
      email:string
}

const parseAuthorization = (value: string | undefined) : string=>{
      if(!value){
            throw new HttpError(401, "User not authorized -value-");
      };
      const [scheme, accessToken] =  value!.split(" ");
      if(scheme.toLocaleLowerCase() !== "bearer" || !accessToken){
            throw new HttpError(401, "User not authorized -split-" );
      };
      return accessToken
};

const toUser = (user: AccessTokenClaims): authenticateUser=>{
      if(!user.sub){
            throw new HttpError(401, "User Not authorised - no id found")
      }
      return {
            id:user.sub,
            email: user.email
      }
}
export const requireAuth : RequestHandler = async (req,res, next)=>{
      //COOKIE/header COMES WITH: ACCESS TOKEN
      //DESIGN THE ACCESS JWT .. (IF VALID .. REQ.USER=SUB) (INVALID .. SEND RESPONSE Unauthrozied.. go to login/refresh???)
      //REQUIREAUTH ANLY DEALS WITH ACCESS JWT
      try{
            const token = parseAuthorization(req.headers.authorization);
            const claims = jwt.verify(token, env.JWT_SECRET) as AccessTokenClaims;
            req.user = toUser(claims)
            next()
      }catch(error){
            if(error instanceof HttpError){
                  next(error)
                  return;
            }
            next(new HttpError(401, "User not authorized - verify"))
      }
};
