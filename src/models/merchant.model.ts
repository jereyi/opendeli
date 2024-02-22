import { DataTypes, Model } from "sequelize";
import sequelize from "../configs/db.config";

// TODO: Add indices, primary keys, and default
class Merchant extends Model {
  declare id: number;
  declare name: string;
  declare logo: string;
  declare phoneNumber: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Merchant.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
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
    tableName: "merchants",
    sequelize,
  }
);

export default Merchant;
