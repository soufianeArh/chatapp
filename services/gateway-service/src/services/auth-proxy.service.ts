import axios from "axios";
import { HttpError } from "@chatapp/common";
import {env} from "@/config/env";

const client = axios.create({
      baseURL: env.AUTH_SERVICE_URL,
      timeout: 5000
});
export const authHeader = {
      headers:{
            "X-Internal-Token": env.INTERNAL_API_TOKEN
      }
};

export interface AuthToken {
      accessToken: string,
      refreshToken: string
};

export interface UserData{
      id:string,
      email:string,
      displayName:string,
      createdAt:Date
};

export interface AuthResponse extends AuthToken{
      user: UserData
};

export interface RegisterPayload {
      email:string,
      password:string,
      displayName:string
};

export interface LoginPayload {
      email:string,
      password:string
}

export interface RefreshPayload {
      refreshToken:string
}

export interface revokePayload {
      userId: string
}
export const resolvedMessage = (status: number, data:unknown) =>{
      // i have data in gateway, what should i do with it
      //if message (return it) if status>500 error iNTERNALerr  //if no message no500 some error
      if(typeof data === "object" && data && 'message' in data){
            const message = (data as Record<string,unknown>).message
            if(typeof message === "string" && message.trim().length > 0){
                  return `${message} !!`;
            }
      }
      return status >= 500 ? "Internal error happened" : "Some Error Occured"
}

export const axiosErrorHandle = (err: unknown): never => {
      //check if not service uncaught error/ or client  axios error
      if (!axios.isAxiosError(err) || !err.response ){
            throw (new HttpError(500, 'Authentication server unavailable'));
      }
      const {status, data} = err.response as {status:number, data:unknown};
      throw (new HttpError(status, resolvedMessage(status ,data)))
};


export const authProxyService ={
      async register(payload:RegisterPayload) : Promise<AuthResponse>{

            try{
                  const response = await client.post<AuthResponse>("/auth/register",payload, authHeader)
                  return response.data;
            }catch(err){
                  return axiosErrorHandle(err)
            }
      },

      async loging(payload: LoginPayload) : Promise<AuthResponse>{
            try{
                  const response = await client.post<AuthResponse>("/auth/login", payload, authHeader);
                  return response.data
            }catch(err){
                  return axiosErrorHandle(err)
            }
      }
}
