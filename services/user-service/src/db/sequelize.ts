import {Sequelize} from "sequelize";
import {env} from "@/config/env";
import { logger } from "@/utils/logger";

//create the client
export const sequelize = new Sequelize(env.USER_DB_URL, {
      dialect:"postgres",
      logging:
      env.NODE_ENV === "development"?(msg: unknown)=>{
            logger.debug({sequelize: msg})
      }: false,
      define:{
            underscored: true,
            freezeTableName: true
      }
});

//fucntion to connect
export const connectToDatabase = async ():Promise<void>=>{
      await sequelize.authenticate();
      logger.info("User db connection success")
}
//close database 
export const closeDatabase = async ():Promise<void> =>{
      await sequelize.close()
      logger.info("User db connection closed")
}
