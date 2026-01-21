import {Model, DataTypes, type Optional} from "sequelize";
import { UserCredentials } from "./user-credentials.models";
import { sequelize } from "@/db/sequelize";

export interface RefreshTokenAttributes{
      id: string;
      userId: string;
      tokenId: string,
      expiresAt: Date;
      createdAt: Date;
      updatedAt: Date

};

export type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, "id" | "createdAt" | "updatedAt">
export class RefreshToken
        extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
        implements RefreshTokenAttributes {
            declare id: string;
            declare userId: string;
            declare tokenId: string;
            declare expiresAt: Date;
            declare createdAt: Date;
            declare updatedAt: Date
};
 RefreshToken.init({
      id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
      },
      userId:{
            type: DataTypes.STRING,
            allowNull: false
      },
      tokenId:{
            type: DataTypes.STRING,
            allowNull: false
            },
      expiresAt:{
            type: DataTypes.DATE,
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
      tableName:"refresh_token"
 });
 //decalre just some oncasscade metadata for this mode 
 //cant do this in pure sql
 UserCredentials.hasMany(RefreshToken, {
      foreignKey: "userId",
      as: "refreshTokens",
      onDelete: "CASCADE",
    });
//create the enventual foreign key
RefreshToken.belongsTo(UserCredentials, {
foreignKey: "userId",
as: "user",
});