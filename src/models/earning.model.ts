import { DataTypes, Model } from "sequelize";
var db = require("./db"),
  sequelize = db.sequelize;


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
      defaultValue: DataTypes.UUIDV4,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pending: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    received: {
      type: DataTypes.INTEGER,
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
