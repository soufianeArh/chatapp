//what i validate ? the body ? 
import { int, z } from "zod";
import { HttpError } from "../errors/http-errors";
import type { Request, Response, NextFunction } from "express";
import { ZodError, ZodType, ZodObject, ZodRawShape, } from "zod";

type schema = ZodObject<ZodRawShape> | ZodType;
type PramsRecord = Record<string, string>
type QueryRecord = Record<string, unknown>

export interface RequestVAlidationSchema {
      body?: schema,
      query?: schema,
      params?: schema

};

const formattedError = (error: ZodError) => {
      return error.issues.map((issue) => ({
            path: issue.path.join("*"),
            message: issue.message
      }))
}

export const ValidateRequest = (schemas: RequestVAlidationSchema) => {
      return (req: Request, res: Response, next: NextFunction) => {
            try {
                  if (schemas.body) {
                        const parsedBody = schemas.body.parse(req.body) as unknown;
                        req.body = parsedBody;
                  };
                  if (schemas.params) {
                        const parsedParams = schemas.params.parse(req.params) as PramsRecord;
                        req.params = parsedParams
                  };
                  if (schemas.query) {
                        const parsedQuery = schemas.query.parse(req.query) as QueryRecord;
                        req.query = parsedQuery as Request['query']
                  };
                  next();
            } catch (error) {
                  if (error instanceof ZodError) {
                        next(new HttpError(422, "Invalid request", {issues: formattedError(error)}))
                  }else{
                        next(new HttpError(500, "Internal Error", ))
                  }
            }

      }
}