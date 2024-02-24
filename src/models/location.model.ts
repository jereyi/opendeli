import { DataTypes, Model } from "sequelize";
var db = require("./db"),
  sequelize = db.sequelize;

  // TODO: Fix associaitions
class Location extends Model {
  declare id: string;
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
      defaultValue: DataTypes.UUIDV4,
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
