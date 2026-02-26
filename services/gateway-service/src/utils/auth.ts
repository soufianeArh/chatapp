import type { Request } from "express"
import { AuthenticatedUser, HttpError } from "@chatapp/common"
export const checkAuthenticatedUser = (req:Request) :AuthenticatedUser=> {
      if(!req.user){
            throw new HttpError(401, "User not authorized - controller")
      }
      return req.user
}