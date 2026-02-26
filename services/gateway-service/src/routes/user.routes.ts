import {Router} from "express";
import { asyncHandler, ValidateRequest } from "@chatapp/common";
import { searchQueryParams, userIdParam, createUserBody } from "@/validation/user.schema";
import { getUserController, geAlltUserController, createUserController, searchQueryController } from "@/controller/user.controller";
import { requireAuth } from "@/middleware/require-auth";

export const userRouter : Router = Router();

userRouter.get("/search", requireAuth, ValidateRequest({query: searchQueryParams}), asyncHandler(searchQueryController));
userRouter.get("/:id", requireAuth, ValidateRequest({params: userIdParam }), asyncHandler(getUserController) );
userRouter.get("/", requireAuth, asyncHandler(geAlltUserController));
userRouter.post("/",ValidateRequest({body: createUserBody}), asyncHandler(createUserController));




