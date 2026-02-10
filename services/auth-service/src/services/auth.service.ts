import { RegisterInput, AuthResponse, createTokenInput, ResfreshTokenResponse, LoginInput, AuthToken } from "@/types/auth";
import { UserCredentials, RefreshToken } from "@/models"
import { Op } from "sequelize";
import { AuthUserRegisteredPayload, HttpError } from "@chatapp/common";
import { sequelize } from "@/db/sequelize";
import { passwordHash, verifyPassword } from "@/utils/token";
import crypto from "crypto";
import { signJWToken, signRefreshJWToken } from "@/utils/token";
import { userRegisteredPublish } from "@/messaging/event-publishing";
import { Where } from "sequelize/types/utils";

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
            const userData: AuthUserRegisteredPayload = {
                  id: user.id,
                  email: user.email,
                  displayName: user.displayName,
                  createdAt: user.createdAt.toISOString()
            }
            //publish the event
            userRegisteredPublish(userData);
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

export const login = async (input: LoginInput): Promise<AuthToken | undefined>=>{
      //compare if email exists
      //compare passord
      //return session/refresh/userData
      const userCredentials = await UserCredentials.findOne({
            where: { email: input.email }
          });
      if(!userCredentials){
            throw new HttpError(404,"Email not found");
            return;
      };
      const isPassword = verifyPassword(input.password, userCredentials.passwordHash, );
      if(!isPassword){
            throw new HttpError(401,"Password Incorrect");
            return;
      };
      //we didnt delete the old refresh token
     const refreshTokenRecord = await createRefreshToken({userId: userCredentials.id});
     //jwt
     const jwt_token = signJWToken({sub: userCredentials.id, email: userCredentials.email});
     const jwt_refresh_token = signRefreshJWToken({sub: userCredentials.id, tokenId: refreshTokenRecord.tokenId});

     return {
      accessToken:jwt_token,
      refreshToken: jwt_refresh_token,
     }

};

//new function refresh token: this function will be trigered in user authenticated via validator



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

