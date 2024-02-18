import { DataTypes } from "sequelize";
import sequelize from "../configs/db.config";

const Earning = sequelize.define(
  "Earning",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    pending: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    received: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    payoutMethod: {
      type: DataTypes.STRING,
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

Earning.belongsTo(sequelize.models.courier);

export default Earning;
