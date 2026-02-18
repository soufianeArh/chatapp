import { AuthUserRegisteredPayload, HttpError } from "@chatapp/common";
import {userRepository, UserRepository} from "@/repositories/user.repositories";
import { createUserInput, userData } from "@/types/user";
import { UniqueConstraintError } from "sequelize";
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
      }){
            const users = await this.repository.searchByQuery(params.query,
                  {
                        limit:params.limit,
                        excludeIds: params.excludeIds
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
            const user = this.repository.upsertUserFromAuthRegisterEvent(payload);
            //publish event ....
            return user;
      }
};

export const userService = new UserService(userRepository)

