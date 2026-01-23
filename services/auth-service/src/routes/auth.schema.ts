import { RefreshToken } from "@/models";
import {z} from "@chatapp/common"

export const registerSchema = z.object({
      body:z.object({
            email: z.email(),
            password: z.string().min(8),
            displayName: z.string().min(3).max(30),
      })
});

export const loginSchema = {
      body:{
            email: z.email(),
            password: z.string().min(8)

      }
};

export const refreshTokenSchema = {
      body:{
            refreshToken: z.string()
      }
};

export const revokeSchema = {
      body:{
            userId: z.uuid()
      }
}

