import { authProxyService, type RegisterPayload } from "@/services/auth-proxy.service";
import { registerSchema } from "@/validation/auth.schema";
import { type AsyncHandler } from "@chatapp/common";


//its unecessary to validate twice
//the controller shall use the trusted data
//i dont have types thats why i did this: not acceptable
// i need types in the common
export const registerController : AsyncHandler = async (req, res, next)=>{
      try{
            const payload = registerSchema.parse(req.body);
            const response = await authProxyService.register(payload);
            res.status(201).json(response)
      }catch(err){
            next(err)
      }
};

export const loginController : AsyncHandler = async (req, res, next)=>{
      try{
            const payload = req.body;
            const response = await authProxyService.loging(payload);//this will type verify
            res.status(200).json(response)

      }catch(err){
            next(err)
      }
}
