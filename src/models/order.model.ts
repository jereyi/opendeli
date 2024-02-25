import { DataTypes, Model } from "sequelize";
import { OrderStatus } from "../utils/enum.util";
import { Point } from "geojson";
import { Item } from "../utils/types.util";
var db = require("./db"),
  sequelize = db.sequelize;

// TODO: Fix associaitions
class Order extends Model {
  declare id: string;
  declare customerName: string;
  declare status: OrderStatus;
  declare customerNotes: string;
  declare courierNotes: string;
  declare pickupCoords: Point;
  declare dropOffCoords: Point;
  declare items: Item[];
  declare undeliverableAction: string;
  declare undeliverableReason: string;
  declare currencyCode: string;
  declare grossRevenue: number;
  declare fees: number;
  declare pay: number;
  declare deliveryTime: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
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
    },
    customerNotes: {
      type: DataTypes.STRING,
    },
    courierNotes: {
      type: DataTypes.STRING,
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
    },
    // Total amount earned for this order (pay + fees)
    grossRevenue: {
      type: DataTypes.INTEGER,
    },
    // Fees associated with the delivery of this order
    fees: {
      type: DataTypes.INTEGER,
    },
    // Driver's compensation for this order (before tips)
    pay: {
      type: DataTypes.INTEGER,
    },
    tips: {
      type: DataTypes.INTEGER,
    },
    deliveryTime: {
      type: DataTypes.DATE,
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
