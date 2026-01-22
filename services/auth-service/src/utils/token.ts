import jwt, {type Secret, type SignOptions} from "jsonwebtoken";
import bcrypt from "bcrypt";
import {env} from "@/config/env"

const JWT_SECRET_TOKEN: Secret = env.JWT_SECRET
const JWT_REFRESH_SECRET_TOKEN : Secret = env.JWT_REFRESH_SECRET;
const ACCESS_SIGNOPTIONS : SignOptions = {expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']};
const REFRESH_SIGNOPTIONS : SignOptions = {expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']};


export const passwordHash = async (password: string): Promise<string>=>{
      const saltRounds = 12;
      return bcrypt.hash(password, saltRounds);
};

export const  verifyPassword = async (password: string, hash: string): Promise<Boolean>=>{
      return bcrypt.compare(password,hash)
};

interface signJWTokenPaylod {
      sub: string;
      email: string
};

interface signRefreshJWTokenPaylod{
      sub: string;
      tokenId: string;
}

export const signJWToken = (payload: signJWTokenPaylod) : string => {
      return jwt.sign(payload, JWT_SECRET_TOKEN, ACCESS_SIGNOPTIONS)
};

export const signRefreshJWToken = (payload: signRefreshJWTokenPaylod)=>{
      return jwt.sign(payload, JWT_REFRESH_SECRET_TOKEN, REFRESH_SIGNOPTIONS )
};

export const verifyRefreshToken = (token: string ): signRefreshJWTokenPaylod=> {
      return jwt.verify(token, JWT_REFRESH_SECRET_TOKEN) as signRefreshJWTokenPaylod
}