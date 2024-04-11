import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { DeliveryType, LocationType, OrderStatus, PickupType } from "../utils/enum.util";
import { Point } from "geojson";
import { Item } from "../utils/types.util";
import Merchant from "./merchant.model";
import Courier from "./courier.model";
import Location from "./location.model";
import OrderLocation from "./orderlocation.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Order extends Model<
  InferAttributes<Order, { omit: "Locations" }>,
  InferCreationAttributes<Order, { omit: "Locations" }>
> {
  declare id: CreationOptional<string>;
  declare CourierId: ForeignKey<Courier["id"]> | null;
  declare MerchantId: ForeignKey<Merchant["id"]> | null;
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
  // USEFUL INFO: https://stackoverflow.com/questions/55498140/saving-buffer-on-postgres-bytea-with-typeorm-only-store-10-bytes
  declare imageData: Blob | null;
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

  declare getMerchant: BelongsToGetAssociationMixin<Merchant>;
  declare setMerchant: BelongsToSetAssociationMixin<Merchant, string>;
  declare createMerchant: BelongsToCreateAssociationMixin<Merchant>;

  declare getLocations: BelongsToManyGetAssociationsMixin<Location>;
  declare addLocation: BelongsToManyAddAssociationMixin<Location, string>;
  declare addLocations: BelongsToManyAddAssociationsMixin<Location, string>;
  declare setLocations: BelongsToManySetAssociationsMixin<Location, string>;
  declare removeLocation: BelongsToManyRemoveAssociationMixin<Location, string>;
  declare removeLocations: BelongsToManyRemoveAssociationsMixin<Location, string>;
  declare hasLocation: BelongsToManyHasAssociationMixin<Location, string>;
  declare hasLocations: BelongsToManyHasAssociationsMixin<Location, string>;
  declare countLocations: BelongsToManyCountAssociationsMixin;
  declare createLocation: BelongsToManyCreateAssociationMixin<Location>;

  // NOTE: Must include locations when calling and locations must be defined
  getPickupLocation() {
    return this.Locations?.filter(location => location.OrderLocation?.locationType == LocationType.pickup).at(0);
  }
  getDropoffLocation() {
    return this.Locations?.filter(
      (location) => location.OrderLocation?.locationType == LocationType.dropoff
    ).at(0);
  }
  getReturnLocation() {
    return this.Locations?.filter(
      (location) => location.OrderLocation?.locationType == LocationType.return
    ).at(0);
  }

  declare Locations?: NonAttribute<Location[]>;
  declare OrderLocation?: NonAttribute<OrderLocation>;

  declare static associations: {
    Locations: Association<Courier, Location>;
  };
}

Order.init(
  {
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
      allowNull: false,
      defaultValue: [],
    },
    pickupTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
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
