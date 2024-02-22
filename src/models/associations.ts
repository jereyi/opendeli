import Courier from "./courier.model";
import Earning from "./earning.model";
import Merchant from "./merchant.model";
import Settings from "./settings.model";
import Location from "./location.model"
import Order from "./order.model";

Courier.hasMany(Earning, {
  onDelete: "CASCADE",
});
Earning.belongsTo(Courier);

Courier.hasOne(Settings, {
  onDelete: "CASCADE",
});
Settings.belongsTo(Courier);

Location.hasMany(Merchant);
Merchant.hasMany(Location);

Courier.hasMany(Order);
Order.belongsTo(Courier);

Order.hasOne(Merchant);
