import { type AsyncHandler } from "@chatapp/common";
import { userService } from "@/services/user.service";
import { type SearchQueryParams, type UserIdParam, type CreateUserBody } from "@/validation/user.schema";

export const getUser : AsyncHandler = async (req, res, next)=>{
      try{
            const {id} = req.params as UserIdParam;
            const user = await userService.getUserById(id);
            res.status(200).json({data: user})
      }catch(err){
            next(err)
      }
};

export const getAllUsers : AsyncHandler = async (req, res, next)=>{
      try{
            const users = await userService.getAllUsers()
            res.status(200).json({data:users})
      }catch(err){
            next(err)
      }
};

export const createUser : AsyncHandler = async (req, res, next) =>{
      try{
            const {email,displayName} = req.body as CreateUserBody
            const user = await userService.createUser({email,displayName});
            res.status(201).json({data:user})
      }
      catch(err){
            next(err)
      }
};

export const searchUsers : AsyncHandler = async (req, res, next)=>{
      try{
            const { query, limit, excludeIds } = req.query as SearchQueryParams;
            const lim = limit ?? 10
            const users = await userService.searchByQuery({query, limit:lim, excludeIds});
            console.log(users)
            res.status(200).json({data: users})

      }catch(err){
            next(err)
      }
}
