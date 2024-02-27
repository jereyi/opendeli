import Courier from "./courier.model";
import Earning from "./earning.model";
import Merchant from "./merchant.model";
import Setting from "./setting.model";
import Location from "./location.model";
import Comment from "./comment.model";
import Order from "./order.model";
import { DataTypes } from "sequelize";
var db = require("./db"),
  sequelize = db.sequelize;

Courier.hasMany(Earning, {
  sourceKey: "id",
  foreignKey: "CourierId",
  onDelete: "CASCADE",
});
Earning.belongsTo(Courier);

Courier.hasOne(Setting, {
  sourceKey: "id",
  onDelete: "CASCADE",
});
Setting.belongsTo(Courier, { targetKey: "id" });

Courier.hasMany(Order);
Order.belongsTo(Courier);

const LocationMerchant = sequelize.define("locationmerchants", {
  LocationId: {
    type: DataTypes.UUID,
    references: {
      model: Location,
      key: "id",
    },
  },
  MerchantId: {
    type: DataTypes.UUID,
    references: {
      model: Merchant,
      key: "id",
    },
  },
});
Location.belongsToMany(Merchant, {through: LocationMerchant});
Merchant.belongsToMany(Location, { through: LocationMerchant });

Location.hasMany(Comment);
Comment.belongsTo(Location);

Merchant.hasMany(Order);
Order.belongsTo(Merchant);

Merchant.hasMany(Comment);
Comment.belongsTo(Merchant);

Comment.hasMany(Comment, {
  sourceKey: "id",
  foreignKey: "CommentId",
  as: "Replys",
  onDelete: "CASCADE",
});
Comment.belongsTo(Comment);

