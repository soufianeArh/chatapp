import { createApp } from "./app";
import { createServer } from "http";
import { env } from "./config/env"
import { logger } from "./utils/logger";

const main = async ()=>{
      try{
            const app = createApp();
            const server = createServer(app);
            const port = env.AUTH_SERVICE_PORT;
            server.listen(port);
            logger.info({port}, "Auth service is running");

            function shutdown(){
                  Promise.all([])
                  .then(() => {
                        logger.info("Shutting down log info");
                      })
                  .catch((error:unknown)=>{
                        logger.error({error}, "Error during shutdown tasks")
                  })
                  .finally(()=>{
                        server.close(()=>process.exit(0))
                  })
            }

            process.on("SIGINT", shutdown);
            process.on("SIGTERM", shutdown)

      }catch(error){
            logger.error({error}, "Failed to launch auth service");
            process.exit(1)
      }
};
void main()