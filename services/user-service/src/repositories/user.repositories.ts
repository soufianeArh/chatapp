import {Op, type WhereOptions } from "sequelize";
//user DATE ????????????????????????????????????????
import { createUserInput, userData } from "@/types/user";
//for messaging: STRING
import type { AuthUserRegisteredPayload } from '@chatapp/common';
import { UserModel } from '@/db/models';


const toDomainUser = (model: UserModel): userData => ({
      id: model.id,
      email: model.email,
      displayName: model.displayName,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });

export class UserRepository {

  async findById(id:string): Promise<userData | null>{
    const user = await UserModel.findByPk(id); //UserModel | null
    return user ? toDomainUser(user) : null
  };

  async findAll():Promise<userData[]>{
    const users = await UserModel.findAll({
      order: ["displayName",'ASC']
    }); //[] | [UserModel, ...]
    return  users.map(user=>toDomainUser(user)); //could pass empty
  }

  async upsertUserFromAuthRegisterEvent
  (payload: AuthUserRegisteredPayload):Promise<userData>{
    const [user] = await UserModel.upsert({
      id: payload.id,
      email: payload.email,
      displayName: payload.displayName,
      createdAt: new Date(payload.createdAt),
      updatedAt: new Date(payload.createdAt)
    },   { returning: true },); // user (no null)
    return toDomainUser(user)

  }
};

export const userRepository = new UserRepository()