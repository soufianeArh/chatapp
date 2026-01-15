import { HttpError } from "@chatapp/common";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const ErrorHandler:ErrorRequestHandler =
 (err: unknown, req: Request, res: Response, _next: NextFunction)=>{
      
      const error = err instanceof HttpError ? err: undefined
      const statusCode = error?.statusCode ?? 500
      const message = error?.message ?? "Internal Error"
      const payload = error?.details ? {message, details: error.details } : {message};

      res.status(statusCode).json(payload);
 }