//UserCredentials.init(...) registers the model (table config + attributes) 
//inside the Sequelize client instance (sequelize), even if they live in different folders.
import {UserCredentials } from "@/models/user-credentials.models"
import { sequelize } from "@/db/sequelize";

export const initModels = async ()=>{
      await sequelize.sync()
};

export { UserCredentials };


