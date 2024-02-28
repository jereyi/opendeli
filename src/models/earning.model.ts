import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasOneCreateAssociationMixin,
  NonAttribute,
  Association,
  ForeignKey,
} from "sequelize";
import Courier from "./courier.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Earning extends Model<
  InferAttributes<Earning>,
  InferCreationAttributes<Earning>
> {
  declare id: CreationOptional<string>;
  declare CourierId: ForeignKey<Courier["id"]>;
  declare total: number;
  declare pending: number;
  declare received: number;
  declare payoutMethod: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getCourier: HasOneGetAssociationMixin<Courier>;
  declare setCourier: HasOneSetAssociationMixin<Courier, string>;
  declare createCourier: HasOneCreateAssociationMixin<Courier>;
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
