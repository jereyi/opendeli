import { DataTypes, Model } from "sequelize";
import sequelize from "../configs/db.config";
import Settings from "./settings.model";
import Earning from "./earning.model";
import { OrderSetting } from "../utils/enum.util";

// TODO: Add indices, primary keys, and default

class Courier extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string | null;
  declare isAvailable: boolean | null;
  declare orderSetting: OrderSetting | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Courier.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    node_uri: {
      type: DataTypes.STRING,
      defaultValue: process.env.APP_URI // TODO: Set up this environment variable
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    orderSetting: {
      type: DataTypes.ENUM("auto_accept", "auto_reject", "manual"),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: 'couriers',
    sequelize
  }
);

export default Courier;