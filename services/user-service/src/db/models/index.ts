import { UserModel } from "./user.model"
import { sequelize } from "../sequelize"

export const initModels = async ()=>{
      await sequelize.sync();
}
export { UserModel };