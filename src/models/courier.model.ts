import { DataTypes } from "sequelize";
import sequelize from "../configs/db.config";

// QQQ: Does not seem necessary for each courier to store a reference
// to the node since it will always be the same. 
// QQQ: Fulfilment modes essential for the MVP because we are only supporting delivery.
const Courier = sequelize.define(
  "Courier",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cellPhoneNumber: {
      type: DataTypes.STRING,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    orderSetting: {
      type: DataTypes.ENUM("auto_accept", "auto_reject", "manual"),
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

Courier.hasMany(sequelize.models.earning, {
  onDelete: "CASCADE"
})

Courier.hasOne(sequelize.models.settings, {
  onDelete: "CASCADE"
})

export default Courier;
