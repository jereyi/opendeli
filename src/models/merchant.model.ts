import { DataTypes, Model } from "sequelize";
var db = require("./db"),
  sequelize = db.sequelize;

// TODO: Add indices, primary keys, and default
  // TODO: Fix associaitions
class Merchant extends Model {
  declare id: string;
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
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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
