import { HttpError } from "@chatapp/common";
import type { ErrorRequestHandler} from "express";

export const ErrorHandler: ErrorRequestHandler = (err, req, res, next,)=>{
      const statusCode = err?.statusCode ? err.statusCode :  500;
      const message = statusCode === 500 ? "Internal Error" : (err?.message ?? "unknown message")
      const payload = err?.details ? {
            message, details:err.details
      }:{message}
      res.status(statusCode).json(payload);
      void next()
}