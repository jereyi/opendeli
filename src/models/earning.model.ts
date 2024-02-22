import { DataTypes, Model } from "sequelize";
import sequelize from "../configs/db.config";

class Earning extends Model {
  declare id: number;
  declare total: number;
  declare pending: number;
  declare received: number;
  declare payoutMethod: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Earning.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
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
    tableName: "earnings",
    sequelize,
  }
);

export default Earning;
