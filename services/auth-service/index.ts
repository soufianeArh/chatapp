import { createApp } from "./app";
import { createServer } from "http";
import { env } from "./src/config/env"
import { logger } from "./src/utils/logger";

const main = async ()=>{
      try{
            const app = createApp();
            const server = createServer(app);
            const port = env.AUTH_SERVICE_PORT;
            server.listen(port);
            logger.info({port}, "Auth service is running")

      }catch(error){
            logger.error({error}, "Failed to launch auth service");
            process.exit(1)
      }
};
main()