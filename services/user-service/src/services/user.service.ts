import { AuthUserRegisteredPayload, HttpError } from "@chatapp/common";
import {userRepository, UserRepository} from "@/repositories/user.repositories";
import { userData } from "@/types/user";
//next: to be called by controller and its thwon error are catched in controller 

export const findOne = async (id:string): Promise<userData | void>=>{
      const user = await userRepository.findById(id)
      if(!user){
            throw new HttpError(401, "User Not Found");
            return;
      }
      return user;
};


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

