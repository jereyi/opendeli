import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  NonAttribute,
  Association,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
} from "sequelize";
import Merchant from "./merchant.model";
import Comment from "./comment.model";
var db = require("./db"),
  sequelize = db.sequelize;

// TODO: Verify on delete and on update
class Location extends Model<
  InferAttributes<Location, { omit: "Comments" | "Merchants" }>,
  InferCreationAttributes<Location, { omit: "Comments" | "Merchants" }>
> {
  declare id: CreationOptional<string>;
  declare address: string;
  declare city: string;
  declare state: string | null;
  declare postalCode: string | null;
  declare countryCode: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getComments: HasManyGetAssociationsMixin<Comment>;
  declare addComment: HasManyAddAssociationMixin<Comment, string>;
  declare addComments: HasManyAddAssociationsMixin<Comment, string>;
  declare setComments: HasManySetAssociationsMixin<Comment, string>;
  declare removeComment: HasManyRemoveAssociationMixin<Comment, string>;
  declare removeComments: HasManyRemoveAssociationsMixin<Comment, string>;
  declare hasComment: HasManyHasAssociationMixin<Comment, string>;
  declare hasComments: HasManyHasAssociationsMixin<Comment, string>;
  declare countComments: HasManyCountAssociationsMixin;
  declare createComment: HasManyCreateAssociationMixin<Comment, "CommentableId">;

  declare getMerchants: BelongsToManyGetAssociationsMixin<Merchant>;
  declare addMerchant: BelongsToManyAddAssociationMixin<Merchant, string>;
  declare addMerchants: BelongsToManyAddAssociationsMixin<Merchant, string>;
  declare setMerchants: BelongsToManySetAssociationsMixin<Merchant, string>;
  declare removeMerchant: BelongsToManyRemoveAssociationMixin<Merchant, string>;
  declare removeMerchants: BelongsToManyRemoveAssociationsMixin<Merchant, string>;
  declare hasMerchant: BelongsToManyHasAssociationMixin<Merchant, string>;
  declare hasMerchants: BelongsToManyHasAssociationsMixin<Merchant, string>;
  declare countMerchants: BelongsToManyCountAssociationsMixin;
  declare createMerchant: BelongsToManyCreateAssociationMixin<Merchant>;

  declare Comments?: NonAttribute<Comment[]>;
  declare Merchants?: NonAttribute<Merchant[]>;

  declare static associations: {
    Comments: Association<Location, Comment>;
    Merchants: Association<Location, Merchant>;
  };
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
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    // ISO Alpha-2 Contry Code (eg. United States of America -> US)
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
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
