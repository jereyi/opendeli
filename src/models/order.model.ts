import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { OrderStatus } from "../utils/enum.util";
import { Point } from "geojson";
import { Item } from "../utils/types.util";
import Merchant from "./merchant.model";
import Courier from "./courier.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<string>;
  declare CourierId: ForeignKey<Courier["id"]> | null;
  declare MerchantId: ForeignKey<Merchant["id"]> | null;
  declare customerName: string;
  declare status: OrderStatus;
  declare customerNotes: string[];
  declare courierNotes: string[];;
  declare pickupCoords: Point;
  declare dropoffCoords: Point;
  declare items: Item[];
  declare undeliverableAction: string | null;
  declare undeliverableReason: string | null;
  declare currencyCode: string;
  declare grossRevenue: number;
  declare fees: number;
  declare pay: number;
  declare tips: CreationOptional<number>;
  declare deliveryTime: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Order.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "created",
        "dispatched",
        "picked_up",
        "dropped_off",
        "canceled"
      ),
      allowNull: false,
      defaultValue: "created",
    },
    customerNotes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false,
    },
    courierNotes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false,
    },
    // TODO: Handle obfuscated coord
    pickupCoords: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
    },
    dropoffCoords: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
    },
    items: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
      allowNull: false,
    },
    undeliverableAction: {
      type: DataTypes.STRING,
    },
    undeliverableReason: {
      type: DataTypes.STRING,
    },
    // ISO 4217 Currency Code (e.g. U.S. Dollar -> USD)
    currencyCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Total amount earned for this order (pay + fees)
    grossRevenue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Fees associated with the delivery of this order
    fees: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Driver's compensation for this order (before tips)
    pay: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tips: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    deliveryTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: "orders",
    sequelize,
  }
);

export default Order;
