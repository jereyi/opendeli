import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ForeignKey,
} from "sequelize";
import Order from "./order.model";
import Location from "./location.model";
import { LocationType } from "../utils/enum.util";
var db = require("./db"),
  sequelize = db.sequelize;

class OrderLocation extends Model<
  InferAttributes<OrderLocation>,
  InferCreationAttributes<OrderLocation>
> {
  declare OrderId: ForeignKey<Order["id"]>;
  declare LocationId: ForeignKey<Location["id"]>;
  declare locationType: LocationType;
}

OrderLocation.init(
  {
    locationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "orderlocations",
    sequelize,
  }
);

export default OrderLocation;
