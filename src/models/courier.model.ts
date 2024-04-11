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
import { OrderSetting, UserStatus } from "../utils/enum.util";
import { Point } from "geojson";
import Setting from "./setting.model";
import Earning from "./earning.model";
import Order from "./order.model";
import Comment from "./comment.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Courier extends Model<
  InferAttributes<
    Courier,
    { omit: "Setting" | "Earnings" | "Comments" | "AcceptedOrders" }
  >,
  InferCreationAttributes<
    Courier,
    { omit: "Setting" | "Earnings" | "Comments" | "AcceptedOrders" }
  >
> {
  declare id: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phoneNumber: string | null;
  declare node_uri: CreationOptional<string>;
  declare status: CreationOptional<UserStatus>;
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

  declare getComments: HasManyGetAssociationsMixin<Comment>;
  declare addComment: HasManyAddAssociationMixin<Comment, string>;
  declare addComments: HasManyAddAssociationsMixin<Comment, string>;
  declare setComments: HasManySetAssociationsMixin<Comment, string>;
  declare removeComment: HasManyRemoveAssociationMixin<Comment, string>;
  declare removeComments: HasManyRemoveAssociationsMixin<Comment, string>;
  declare hasComment: HasManyHasAssociationMixin<Comment, string>;
  declare hasComments: HasManyHasAssociationsMixin<Comment, string>;
  declare countComments: HasManyCountAssociationsMixin;
  declare createComment: HasManyCreateAssociationMixin<Comment, "CourierId">;

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
  declare Comments?: NonAttribute<Comment[]>;
  declare AcceptedOrders?: NonAttribute<Order[]>;

  declare static associations: {
    Setting: Association<Courier, Setting>;
    Earnings: Association<Courier, Earning>;
    Comments: Association<Courier, Comment>;
    AcceptedOrders: Association<Courier, Order>;
  };
}

Courier.init(
  {
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
    status: {
      type: DataTypes.ENUM('online', 'offline', 'last_call'),
      defaultValue: 'offline',
      allowNull: false,
    },
    orderSetting: {
      type: DataTypes.ENUM("auto_accept", "auto_reject", "manual"),
      defaultValue: "manual",
      allowNull: false
    },
    currentLocation: {
      type: DataTypes.GEOMETRY,
    },
    rejectedOffers: {
      type: DataTypes.ARRAY(DataTypes.UUID),
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
