import { User } from "./user.model"
import { sequelize } from "../sequelize"

export const initModels = async ()=>{
      await sequelize.sync();
}
export { User };