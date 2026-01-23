import {z} from "@chatapp/common"

export const registerSchema = {
      body:{
            email: z.string().email(),
            password: z.string().min(8),
            displayName: z.string().min(3).max(30),
      }
}