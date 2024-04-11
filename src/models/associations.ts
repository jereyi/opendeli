import Courier from "./courier.model";
import Earning from "./earning.model";
import Merchant from "./merchant.model";
import Setting from "./setting.model";
import Location from "./location.model";
import Comment from "./comment.model";
import Order from "./order.model";
import OrderLocation from "./orderlocation.model";

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

Courier.hasMany(Order, { as: "AcceptedOrders" });
Order.belongsTo(Courier);

Courier.hasMany(Comment, {
  sourceKey: "id",
  foreignKey: "CourierId",
  onDelete: "CASCADE",
});
Comment.belongsTo(Courier);

Location.hasMany(Comment, {
  foreignKey: "commentableId",
  constraints: false,
});
Comment.belongsTo(Location, {
  foreignKey: "commentableId",
  constraints: false,
});

Merchant.hasMany(Comment, {
  foreignKey: "commentableId",
  constraints: false,
});
Comment.belongsTo(Merchant, {
  foreignKey: "commentableId",
  constraints: false,
});
Merchant.hasMany(Order);
Order.belongsTo(Merchant);

Order.belongsToMany(Location, { through: OrderLocation });
Location.belongsToMany(Order, { through: OrderLocation });
