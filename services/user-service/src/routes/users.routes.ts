import { getAllUsers, createUser, getUser, searchUsers } from "@/controllers/user.controller";
import { createUserBody, searchQueryParams, userIdParam } from "@/validation/user.schema";
import { asyncHandler, ValidateRequest } from "@chatapp/common";
import { Router } from "express";

export const userRoutes: Router = Router();

userRoutes.get("/", asyncHandler(getAllUsers));
userRoutes.post("/", ValidateRequest({body: createUserBody}), asyncHandler(createUser));
userRoutes.get("/:id",ValidateRequest({params: userIdParam}), asyncHandler(getUser));
userRoutes.get("/search", ValidateRequest({query: searchQueryParams}), asyncHandler(getUser))