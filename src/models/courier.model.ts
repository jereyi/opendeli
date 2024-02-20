import { DataTypes } from "sequelize";
import sequelize from "../configs/db.config";

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
    phoneNumber: {
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
