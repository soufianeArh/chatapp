import axios from "axios";
import { env } from "@/config/env";
import { HttpError } from "@chatapp/common";

const client = axios.create({
      baseURL: env.USER_SERVICE_URL,
      timeout: 5000
});

export const authHeader = {
      headers:{
            "X-Internal-Token": env.INTERNAL_API_TOKEN
      }
};

interface UserData{
      id:string,
      email:string,
      displayName:string,
      createdAt: string,
      updatedAt: string
};
interface UserResponse{
      data: UserData
};
interface UserListResponse{
      data: UserData[]
}

interface CreateUserInput {
      email: string,
      displayName: string
};

interface searchQuery {
      query: string;
      limit: number;
      excludeIds: string[];
}

// id: model.id,
// email: model.email,
// displayName: model.displayName,
// createdAt: model.createdAt,
// updatedAt: model.updatedAt,
// });


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
      // console.log(err)
      if (!axios.isAxiosError(err) || !err.response ){
            throw (new HttpError(500, 'User server unavailable'));
      }
      const {status, data} = err.response as {status:number, data:unknown};
      throw (new HttpError(status, resolvedMessage(status ,data)))
};

export const userProxyService = {
      //get user by id
      async getUser (id:string): Promise<UserResponse | void> {
            try{
                  const response = await client.get<UserResponse>(`/users/${id}`, authHeader);
                  return response.data
            }catch(err){
                  axiosErrorHandle(err)
            }
      },
      //get all user
      async getAllUsers (): Promise<UserListResponse | void>{
            try{
                  const response = await client.get<UserListResponse>('/users', authHeader);
                  return response.data
            }catch(err){
                  axiosErrorHandle(err)
            }
      },
      //create user : email/displayname
      async createUser (payload: CreateUserInput): Promise<UserResponse | void>{
            try{
                  const response = await client.post<UserResponse>("/users", payload, authHeader);
                  return response.data;
            }catch(err){
                  axiosErrorHandle(err)
            }
      },
      //searchquery
      async searchQuery (payload:searchQuery ){
            const {query, limit, excludeIds} = payload;
            try{
                  const response = await client.get<UserListResponse>(
                        '/users/search',
                        {
                              params:{
                                    query,
                                    limit,
                                    excludeIds
                              },
                              ...authHeader
                        }
                         );
                  return response.data;
            }catch(err){
                  axiosErrorHandle(err)
            }
      }
}