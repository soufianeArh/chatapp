import { createApp } from "./app";
import { env } from "@/config/env";
import { createServer } from "http";
import { logger } from "./utils/logger";
import { connectToDatabase } from "./db/sequelize";
import { initModels } from "./db/models";

const main = async ()=>{
      try{
            //db connection + model
            await connectToDatabase();
            await initModels()
            //rabbit mq init publisher + listener
            //CREATE THE SERVER
            const app = createApp();
            const server = createServer(app);
            const port = env.USER_SERVICE_PORT;
            server.listen(port);
            logger.info({port}, "User service is running");

            //LISTEN ON SHUTDOWN EVETNS 
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
            logger.error({error}, "Failed to launch user service");
            process.exit(1)
      }
};
main()