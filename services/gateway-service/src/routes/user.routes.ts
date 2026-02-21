import {Router} from "express";
import { asyncHandler, ValidateRequest } from "@chatapp/common";
import { searchQueryParams, userIdParam, createUserBody } from "@/validation/user.schema";
import { getUserController, geAlltUserController, createUserController, searchQueryController } from "@/controller/user.controller";

export const userRouter : Router = Router();

userRouter.get("/search",ValidateRequest({query: searchQueryParams}), asyncHandler(searchQueryController));
userRouter.get("/:id",ValidateRequest({params: userIdParam }), asyncHandler(getUserController) );
userRouter.get("/", asyncHandler(geAlltUserController));
userRouter.post("/",ValidateRequest({body: createUserBody}), asyncHandler(createUserController));




