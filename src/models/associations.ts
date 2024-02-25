import Courier from "./courier.model";
import Earning from "./earning.model";
import Merchant from "./merchant.model";
import Setting from "./setting.model";
import Location from "./location.model";
import Order from "./order.model";

Courier.hasMany(Earning, {
  sourceKey: "id",
  foreignKey: "courierId",
  onDelete: "CASCADE",
});

Setting.belongsTo(Courier, { targetKey: "id" });
Courier.hasOne(Setting, {
  sourceKey: "id",
  onDelete: "CASCADE",
});

Location.hasMany(Merchant);
Merchant.hasMany(Location);

Courier.hasMany(Order);
Order.belongsTo(Courier);

Order.hasOne(Merchant);
