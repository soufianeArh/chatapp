import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../sequelize";

export interface UserAttributes{
      id: string;
      email: string;
      displayName: string;
      createdAt: Date;
      updatedAt: Date;
}
export type UserCreationAttributes = Optional<UserAttributes, "id" | "createdAt" | "updatedAt">;

export class UserModel 
  extends Model<UserAttributes, UserCreationAttributes>
 implements UserAttributes{
      declare  id: string;
      declare email: string;
      declare displayName: string;
      declare createdAt: Date;
      declare updatedAt: Date;
 };

 UserModel.init({
      id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
      },
      email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                  isEmail: true
            }
      },
      displayName:{
            type: DataTypes.STRING,
            allowNull: false
      },
      createdAt:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
      },
      updatedAt:{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
      }
},{
      sequelize,
      tableName:"user"
})