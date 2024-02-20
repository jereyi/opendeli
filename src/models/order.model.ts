import { DataTypes } from "sequelize";
import sequelize from "../configs/db.config";

const Order = sequelize.define(
  "Order",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    merchantInfo: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerNotes: {
      type: DataTypes.STRING,
    },
    courierNotes: {
      type: DataTypes.STRING,
    },
    // We are storing coordinates as JSON objects to allow for
    // both exact and obfuscated coordinates
    pickupCoords: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    dropoffCoords: {
      type: DataTypes.JSON,
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
    return: {
      type: DataTypes.JSON,
    },
    currency: {
      type: DataTypes.STRING,
    },
    totalCharge: {
      type: DataTypes.NUMBER,
    },
    fees: {
      type: DataTypes.NUMBER,
    },
    pay: {
      type: DataTypes.NUMBER,
    },
    tips: {
      type: DataTypes.NUMBER,
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
    // Other model options go here
  }
);

Order.belongsTo(sequelize.models.courier);

export default Order;
