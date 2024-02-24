import Courier from "./courier.model";
import Earning from "./earning.model";
import Merchant from "./merchant.model";
import Settings from "./settings.model";
import Location from "./location.model"
import Order from "./order.model";

Courier.hasMany(Earning, {
  sourceKey: "id",
  foreignKey: "courierId",
  as: "earnings",
  onDelete: "CASCADE",
});

Settings.belongsTo(Courier, { targetKey: "id" });
Courier.hasOne(Settings, {
  sourceKey: "id",
  onDelete: "CASCADE",
});


Location.hasMany(Merchant);
Merchant.hasMany(Location);

Courier.hasMany(Order);
Order.belongsTo(Courier);

Order.hasOne(Merchant);
