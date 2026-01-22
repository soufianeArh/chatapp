import { RegisterInput, AuthResponse, createTokenInput, ResfreshTokenResponse } from "@/types/auth";
import { UserCredentials, RefreshToken } from "@/models"
import { Op } from "sequelize";
import { HttpError } from "@chatapp/common";
import { sequelize } from "@/db/sequelize";
import { passwordHash } from "@/utils/token";
import crypto from "crypto";
import { signJWToken, signRefreshJWToken } from "@/utils/token";

const REFRESH_TOKEN_TTL_DAYS=30;


export const register = async (input:RegisterInput): Promise<AuthResponse>=>{
      //we need to validate the request first before this route 
      //check if email exists
      
      const existing = await UserCredentials.findOne({
            where:{email:{[Op.eq]: input.email}}
      });
      if(existing){
            throw new HttpError(409, "Email already exists ")
      };
      const transaction = await sequelize.transaction()
      try{
            const passwordHashing = await passwordHash(input.password);
            const user = await UserCredentials.create({
                  email: input.email,
                  displayName: input.displayName,
                  passwordHash: passwordHashing
            },{
                  transaction
            });
            const refreshToken = await createRefreshToken({userId: user.id, transaction: transaction});
            await transaction.commit();
            //create the tokes 
            const jwt_token = signJWToken({sub: user.id, email:user.email});
            const jwt_refresh_token = signRefreshJWToken({sub: user.id, tokenId: refreshToken.tokenId});
            const userData = {
                  id: user.id,
                  email: user.email,
                  displayName: user.displayName,
                  createdAt: user.createdAt.toISOString()
            }
            return {
                  accessToken: jwt_token,
                  refreshToken: jwt_refresh_token,
                  user:userData
            }
      }
      catch(err){
            await transaction.rollback()
            throw err;
      }
};

export const createRefreshToken = async (input: createTokenInput) : Promise<ResfreshTokenResponse>=>{
       //to create a token i need to be part of a transaction 
      //create the refresh token record: refreshTken model with (userId-tokenId-expiuresAt)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS); //30d

      const tokenId = crypto.randomUUID();

      const createTokenRecord = await RefreshToken.create({
            userId: input.userId,
            tokenId,
            expiresAt

      }, {
            transaction: input.transaction
      })
      return createTokenRecord;
};

