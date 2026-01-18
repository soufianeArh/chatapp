//this fill will create tcp connection and return client 
//or throw error

import {Sequelize} from "sequelize";
//env is the parsed zod object!
import {env} from "@/config/env";
import {logger} from "@/utils/logger";

export const sequelize = new Sequelize(env.AUTH_db_URL, {
      dialect:"mysql",
      logging:
      env.NODE_ENV === "development"?(msg: unknown)=>{
            logger.debug({sequelize: msg})
      }: false,
      define:{
            underscored: true,
            freezeTableName: true
      }
});

export const connectToDatabase = async ()=>{
      await sequelize.authenticate()
      logger.info("Auth db connection success")
};

export const closeToDatabase = async ()=>{
      await sequelize.close()
      logger.info("Auth db connection closed")
}



