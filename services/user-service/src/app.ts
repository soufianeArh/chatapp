import express, { Application, } from "express";
import helmet from "helmet";
import cors from "cors";
import { createInternalAuthMiddleware } from "@chatapp/common";
import { env } from "./config/env";
import { ErrorHandler } from "./middlewares/error-handler";
import { registerRoutes } from "./routes";


export const createApp = ():Application =>{
      
      const app = express();
      app.use(helmet());
      app.use(cors({
            origin:"*",
            credentials:true
       }));
       app.use(express.json());
       app.use(express.urlencoded({extended: true}));
       app.use(createInternalAuthMiddleware(env.INTERNAL_API_TOKEN, {
            exemptPaths:['/users/health']
       }));
       //routes
       registerRoutes(app)
       //handler
       //fail
       app.use(ErrorHandler);
       app.use((_req, res,) => {
            res.status(404).json("Request Not Found User-srv");
          });
      return app;
}

