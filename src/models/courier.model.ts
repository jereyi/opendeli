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
} from "sequelize";
import { OrderSetting } from "../utils/enum.util";
import { Point } from "geojson";
import Setting from "./setting.model";
import Earning from "./earning.model";
import Order from "./order.model";
var db = require("./db"),
  sequelize = db.sequelize;

// TODO: Add indices, primary keys, and default

class Courier extends Model<
  InferAttributes<Courier, { omit: "Setting" | "Earnings" }>,
  InferCreationAttributes<Courier, { omit: "Setting" | "Earnings" }>
> {
  declare id: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string | null;
  // declare imageType: string | null;
  // declare imageName: string | null;
  // // https://stackoverflow.com/questions/55498140/saving-buffer-on-postgres-bytea-with-typeorm-only-store-10-bytes
  // declare imageData: ArrayBuffer | null;
  declare node_uri: CreationOptional<string>;
  declare isAvailable: CreationOptional<boolean>;
  declare orderSetting: OrderSetting | null;
  declare currentLocation: Point | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare rejectedOffers: CreationOptional<string[]>;

  declare getEarnings: HasManyGetAssociationsMixin<Earning>;
  declare addEarning: HasManyAddAssociationMixin<Earning, string>;
  declare addEarnings: HasManyAddAssociationsMixin<Earning, string>;
  declare setEarnings: HasManySetAssociationsMixin<Earning, string>;
  declare removeEarning: HasManyRemoveAssociationMixin<Earning, string>;
  declare removeEarnings: HasManyRemoveAssociationsMixin<Earning, string>;
  declare hasEarning: HasManyHasAssociationMixin<Earning, string>;
  declare hasEarnings: HasManyHasAssociationsMixin<Earning, string>;
  declare countEarnings: HasManyCountAssociationsMixin;
  declare createEarning: HasManyCreateAssociationMixin<Earning, "CourierId">;

  declare getAcceptedOrders: HasManyGetAssociationsMixin<Order>;
  declare addAcceptedOrder: HasManyAddAssociationMixin<Order, string>;
  declare addAcceptedOrders: HasManyAddAssociationsMixin<Order, string>;
  declare setAcceptedOrders: HasManySetAssociationsMixin<Order, string>;
  declare removeAcceptedOrder: HasManyRemoveAssociationMixin<Order, string>;
  declare removeAcceptedOrders: HasManyRemoveAssociationsMixin<Order, string>;
  declare hasAcceptedOrder: HasManyHasAssociationMixin<Order, string>;
  declare hasAcceptedOrders: HasManyHasAssociationsMixin<Order, string>;
  declare countAcceptedOrders: HasManyCountAssociationsMixin;
  declare createAcceptedOrder: HasManyCreateAssociationMixin<
    Order,
    "CourierId"
  >;

  declare getSetting: HasOneGetAssociationMixin<Setting>;
  declare setSetting: HasOneSetAssociationMixin<Setting, string>;
  declare createSetting: HasOneCreateAssociationMixin<Setting>;

  declare Setting?: NonAttribute<Setting>;
  declare Earnings?: NonAttribute<Earning[]>;
  declare AcceptedOrders?: NonAttribute<Order[]>;

  declare static associations: {
    Setting: Association<Courier, Setting>;
    Earnings: Association<Courier, Earning>;
    AcceptedOrders: Association<Courier, Order>;
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
    // imageType: {
    //   type: DataTypes.STRING,
    // },
    // imageName: {
    //   type: DataTypes.STRING,
    // },
    // imageData: {
    //   type: DataTypes.BLOB('long'),
    // },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    orderSetting: {
      type: DataTypes.ENUM("auto_accept", "auto_reject", "manual"),
    },
    currentLocation: {
      type: DataTypes.GEOMETRY,
    },
    rejectedOffers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false,
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
