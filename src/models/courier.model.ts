import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  NonAttribute,
  Association,
  GeographyDataType,
} from "sequelize";
import { OrderSetting } from "../utils/enum.util";
import { Point } from "../utils/types.util";
import Settings from "./settings.model";
import Earning from "./earning.model";
var db = require("./db"),
  sequelize = db.sequelize;

// TODO: Add indices, primary keys, and default

class Courier extends Model<
  InferAttributes<Courier, { omit: "settings" | "earnings" }>,
  InferCreationAttributes<Courier, { omit: "settings" | "earnings" }>
> {
  declare id: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string | null;
  declare node_uri: CreationOptional<string>;
  declare isAvailable: CreationOptional<boolean>;
  declare orderSetting: OrderSetting | null;
  declare currentLocation:  Point | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getEarnings: HasManyGetAssociationsMixin<Earning>;
  declare addEarning: HasManyAddAssociationMixin<Earning, string>;
  declare addEarnings: HasManyAddAssociationsMixin<Earning, string>;
  declare setEarnings: HasManySetAssociationsMixin<Earning, string>;
  declare removeEarning: HasManyRemoveAssociationMixin<Earning, string>;
  declare removeEarnings: HasManyRemoveAssociationsMixin<Earning, string>;
  declare hasEarning: HasManyHasAssociationMixin<Earning, string>;
  declare hasEarnings: HasManyHasAssociationsMixin<Earning, string>;
  declare countEarnings: HasManyCountAssociationsMixin;
  declare createEarning: HasManyCreateAssociationMixin<Earning, "courierId">;

  declare getSettings: HasOneGetAssociationMixin<Settings>;
  declare setSettings: HasOneSetAssociationMixin<Settings, string>;
  declare createSettings: HasOneCreateAssociationMixin<Settings>;

  declare settings?: NonAttribute<Settings>;
  declare earnings?: NonAttribute<Earning[]>;

  declare static associations: {
    settings: Association<Courier, Settings>;
    earnings: Association<Courier, Earning>;
  };
}

Courier.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    node_uri: {
      type: DataTypes.STRING,
      defaultValue: process.env.APP_URI, // TODO: Set up this environment variable
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
    currentLocation: {
      type: DataTypes.GEOGRAPHY,
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
    tableName: "couriers",
    sequelize,
  }
);

export default Courier;
