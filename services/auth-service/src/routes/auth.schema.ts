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
      body:z.object({
            email: z.email(),
            password: z.string().min(8)

      })
};

export const refreshTokenSchema = {
      body:z.object({
            refreshToken: z.string()
      })
};

export const revokeSchema = {
      body:z.object({
            userId: z.uuid()
      })
}

