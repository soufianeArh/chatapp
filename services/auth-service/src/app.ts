import express, {type Application} from "express";
import cors from "cors";
import helmet from "helmet";
import { authGlobalRoutes } from "./routes";
import {createInternalAuthMiddleware} from "@chatapp/common";
import { env } from "./config/env";
import { ErrorHandler } from "./middlewares/error-handler";


export const createApp = () : Application=>{
       const app = express();
       app.use(helmet());
       app.use(cors({
            origin:"*",
            credentials:true
       }));
       app.use(express.json());
       app.use(express.urlencoded({extended: true}));
       app.use(createInternalAuthMiddleware(env.INTERNAL_API_TOKEN))

       authGlobalRoutes(app);

       app.use(ErrorHandler);
       app.use((_req, res,) => {
            res.status(404).send("Not Found");
          });
      return app
}