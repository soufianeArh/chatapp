import { AuthUserRegisteredPayload, HttpError, UserCreatedPayload, UserCreatedEvent, USER_CREATED_ROUTING_KEY } from "@chatapp/common";
import {userRepository, UserRepository} from "@/repositories/user.repositories";
import { createUserInput, userData } from "@/types/user";
import { UniqueConstraintError } from "sequelize";
import { userCreatedPublish } from "@/messaging/event-publisher";
//next: to be called by controller and its thwon error are catched in controller


class UserService {
      constructor( private readonly repository : UserRepository){};

      async getUserById(id:string):Promise<userData | void>{
            const user = await this.repository.findById(id)
      if(!user){
            throw new HttpError(401, "User Not Found");
            return;
      }  
      return user;
      };

      async getAllUsers():Promise<userData[]|void>{
            const users = await this.repository.findAll();
            if(users.length===0){
                  throw new HttpError(401, "No users found")
            };
            return users;
      };

      async createUser (data: createUserInput){
            try{
                  const user = await this.repository.create(data);
                  //TODO: PUBLISH
                  const userCreatedPayload: UserCreatedPayload = {
                        id: user.id,
                        email: user.email,
                        displayName: user.displayName,
                        createdAt: user.createdAt.toISOString(),
                        updatedAt: user.updatedAt.toDateString()
                  };
                  void userCreatedPublish(userCreatedPayload)

                  return user;
            }catch(err){
                  if(err instanceof UniqueConstraintError){
                        throw new HttpError(409, "User already exists")
                  };
                  throw err;
            }
      };

      async searchByQuery (params: {
            query: string,
            limit?:number,
            excludeIds?: string[]
      }):Promise<userData[]>{
            //why this is not added in the zod schema
            const query = params.query.trim();
            if(query.length === 0){
                  return [];
            };
            const users = await this.repository.searchByQuery(params.query,
                  {
                        limit:params.limit,
                        excludeIds: params.excludeIds ?? []
                  }
            );

            return users
      }

      //role: its going to be in listener when receive authregisterEvent and thenupdate the db
      //params: takes paylaod of autheventregisterd
      //returns:
      //logic: calls the repositorye and upset.. no error catch
      //next: called in listener (auth consumer)
      async syncFromAuthUser(payload: AuthUserRegisteredPayload){
            const user = await this.repository.upsertUserFromAuthRegisterEvent(payload);
            //publish event ....
            const userCreatedPayload: UserCreatedPayload = {
                  id: user.id,
                  email: user.email,
                  displayName: user.displayName,
                  createdAt: user.createdAt.toISOString(),
                  updatedAt: user.updatedAt.toDateString()
            };
            void userCreatedPublish(userCreatedPayload)
            return user;
      }
};

export const userService = new UserService(userRepository)

