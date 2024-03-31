import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { DeliveryType, OrderStatus, PickupType } from "../utils/enum.util";
import { Point } from "geojson";
import { Item } from "../utils/types.util";
import Merchant from "./merchant.model";
import Courier from "./courier.model";
import Location from "./location.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Order extends Model<
  InferAttributes<Order, { omit: "Merchant" }>,
  InferCreationAttributes<Order, { omit: "Merchant" }>
> {
  declare id: CreationOptional<string>;
  declare CourierId: ForeignKey<Courier["id"]> | null;
  declare customerName: string;
  declare customerPhoneNumber: string | null;
  declare status: OrderStatus;
  declare customerNotes: string[];
  declare courierNotes: string[];
  declare items: Item[];
  declare undeliverableAction: string | null;
  declare undeliverableReason: string | null;
  declare imageType: string | null;
  declare imageName: string | null;
  // https://stackoverflow.com/questions/55498140/saving-buffer-on-postgres-bytea-with-typeorm-only-store-10-bytes
  declare imageData: ArrayBuffer | null;
  declare currencyCode: string;
  declare totalCharge: number;
  declare fees: number;
  declare pay: number;
  declare tips: CreationOptional<number>;
  declare totalCompensation: number;
  declare deliveryTime: CreationOptional<Date>;
  declare deliveryTypes: DeliveryType[] | null;
  declare pickupTypes: PickupType[] | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getMerchant: HasOneGetAssociationMixin<Merchant>;
  declare setMerchant: HasOneSetAssociationMixin<Merchant, string>;
  declare createMerchant: HasOneCreateAssociationMixin<Merchant>;

  // [Pickup, Dropoff, Return]
  declare getLocations: HasManyGetAssociationsMixin<Location>;
  declare addLocation: HasManyAddAssociationMixin<Location, string>;
  declare addLocations: HasManyAddAssociationsMixin<Location, string>;
  declare setLocations: HasManySetAssociationsMixin<Location, string>;
  declare removeLocation: HasManyRemoveAssociationMixin<Location, string>;
  declare removeLocations: HasManyRemoveAssociationsMixin<Location, string>;
  declare hasLocation: HasManyHasAssociationMixin<Location, string>;
  declare hasLocations: HasManyHasAssociationsMixin<Location, string>;
  declare countLocations: HasManyCountAssociationsMixin;
  declare createLocation: HasManyCreateAssociationMixin<Location>;

  // NOTE: Must include locations when calling and locations must be defined
  getPickupLocation() {
    return this.Locations?.at(0)
  }
  getDropoffLocation() {
    return this.Locations?.at(1);
  }
  getReturnLocation() {
    return this.Locations?.at(2);
  }

  declare Merchant?: NonAttribute<Merchant>;
  declare Locations?: NonAttribute<Location[]>;

  declare static associations: {
    Merchant: Association<Courier, Merchant>;
    Locations: Association<Courier, Location>;
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
    customerPhoneNumber: {
      type: DataTypes.STRING,
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
    totalCharge: {
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
    totalCompensation: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveryTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deliveryTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    pickupTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
