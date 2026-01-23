import express, {type Application} from "express";
import cors from "cors";
import helmet from "helmet";
import { authGlobalRoutes } from "./routes";


export const createApp = () : Application=>{
       const app = express();
       app.use(helmet());
       app.use(cors({
            origin:"*",
            credentials:true
       }));
       app.use(express.json());
       app.use(express.urlencoded({extended: true}));

       authGlobalRoutes(app);
       
       app.use((_req, res,) => {
            res.status(404).send("Not Found");
          });
      return app
}