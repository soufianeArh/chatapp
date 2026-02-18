import { AsyncHandler } from "@chatapp/common"
import { userIdParam, createUserBody, searchQueryParams,  } from "@/validation/user.schema";
import { userProxyService } from "@/services/users-proxy.service";
// export const registerController : AsyncHandler = async (req, res, next)=>{
//       try{
//             const payload = registerSchema.parse(req.body);
//             const response = await authProxyService.register(payload);
//             res.status(201).json(response)
//       }catch(err){
//             next(err)
//       }
// };

export const getUserController : AsyncHandler = async (req, res, next)=>{
      try{
            //in this controller - i dont user infer i parse again 
            const payload = userIdParam.parse(req.params);
            const response = await userProxyService.getUser(payload.id);
            res.status(200).json(response)
      }catch(err){
            next(err)
      }
};
export const geAlltUserController : AsyncHandler = async (req, res, next)=>{
      try{
            const response = await userProxyService.getAllUsers();
            res.status(200).json(response);
      }catch(err){
            next(err)
      }
};
export const createUserController : AsyncHandler = async (req, res, next)=>{
      try{
            const paylaod = createUserBody.parse(req.body);
            const response = await userProxyService.createUser(paylaod);
            res.status(201).json(response)
      }catch(err){
            next(err)
      }
};
export const searchQueryController : AsyncHandler = async (req, res, next)=>{
      try{
            const payload = searchQueryParams.parse(req.params);
            const response = await userProxyService.searchQuery(payload);
            res.sendStatus(200).json(response)
      }catch(err){
            next(err)
      }
}
