import { type RequestHandler } from "express";
import { HttpError } from "../errors/http-errors";

export interface internalAuthOptions {
      headerName? : string,
      exemptPaths? : string[]
}

const DEFAULT_HEADER_NAME = 'X-Internal-Token';

export const createInternalAuthMiddleware  = (
      expectedToekn: string,
      options: internalAuthOptions = {}
)
: RequestHandler=>{
      const headerName = options.headerName?.toLocaleLowerCase() ?? DEFAULT_HEADER_NAME;
      const exemptPaths = new Set(options?.exemptPaths ?? [])
      return (req, _res, next)=>{
            if(exemptPaths.has(req.path)){
                  next();
                  return;
            };
            const provided = req.headers[headerName];
            const token = Array.isArray(provided)? provided[0] : provided;

            if(typeof token !== "string" || token !== expectedToekn){
                  next(new HttpError(401, 'Unauthorized'));
                  return;
            };
            next();
      }
}