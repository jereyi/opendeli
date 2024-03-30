import { Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, CreationOptional, DataTypes, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { OrderStatus } from "../utils/enum.util";
import { Point } from "geojson";
import { Item } from "../utils/types.util";
import Merchant from "./merchant.model";
import Courier from "./courier.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Order extends Model<
  InferAttributes<Order, { omit: "Merchant"}>,
  InferCreationAttributes<Order, { omit: "Merchant"}>
> {
  declare id: CreationOptional<string>;
  declare CourierId: ForeignKey<Courier["id"]> | null;
  declare customerName: string;
  declare status: OrderStatus;
  declare customerNotes: string[];
  declare courierNotes: string[];
  declare pickupCoords: Point;
  declare dropoffCoords: Point;
  declare items: Item[];
  declare undeliverableAction: string | null;
  declare undeliverableReason: string | null;
  declare imageType: string | null;
  declare imageName: string | null;
  // https://stackoverflow.com/questions/55498140/saving-buffer-on-postgres-bytea-with-typeorm-only-store-10-bytes
  declare imageData: ArrayBuffer | null;
  declare currencyCode: string;
  declare grossRevenue: number;
  declare fees: number;
  declare pay: number;
  declare tips: CreationOptional<number>;
  declare deliveryTime: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getMerchant: HasOneGetAssociationMixin<Merchant>;
  declare setMerchant: HasOneSetAssociationMixin<Merchant, string>;
  declare createMerchant: HasOneCreateAssociationMixin<Merchant>;

  declare Merchant?: NonAttribute<Merchant>;

  declare static associations: {
    Merchant: Association<Courier, Merchant>;
  };
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
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // Fees associated with the delivery of this order
    fees: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // Driver's compensation for this order (before tips)
    pay: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tips: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    deliveryTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    imageType: {
      type: DataTypes.STRING,
    },
    imageName: {
      type: DataTypes.STRING,
    },
    imageData: {
      type: DataTypes.BLOB("long"),
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
