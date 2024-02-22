import { DataTypes, Model } from "sequelize";
import sequelize from "../configs/db.config";

class Location extends Model {
  declare id: number;
  declare address: string;
  declare city: string;
  declare state: string;
  declare postalCode: string;
  declare countryCode: string;
  declare comments: string[];
  declare createdAt: Date;
  declare updatedAt: Date;
}
Location.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // City, Town, or Villange
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // State, Province, or Prefecture
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    // ISO Alpha-2 Contry Code (eg. United States of America -> US)
    countryCode: {
      type: DataTypes.STRING,
    },
    comments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    tableName: "locations",
    sequelize,
  }
);

export default Location;
