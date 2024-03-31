import {
  Association,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  DataTypes,
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
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  CreationOptional,
} from "sequelize";
import Location from "./location.model";
import Comment from "./comment.model";
var db = require("./db"),
  sequelize = db.sequelize;

// TODO: Add indices, primary keys, and default
// TODO: Fix associaitions
class Merchant extends Model<
  InferAttributes<Merchant, { omit: "Comments" }>,
  InferCreationAttributes<Merchant, { omit: "Comments" }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare logo: string | null;
  declare phoneNumber: string | null;
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
  declare createComment: HasManyCreateAssociationMixin<
    Comment,
    "commentableId"
  >;

  // declare getLocations: BelongsToManyGetAssociationsMixin<Location>;
  // declare addLocation: BelongsToManyAddAssociationMixin<Location, string>;
  // declare addLocations: BelongsToManyAddAssociationsMixin<Location, string>;
  // declare setLocations: BelongsToManySetAssociationsMixin<Location, string>;
  // declare removeLocation: BelongsToManyRemoveAssociationMixin<Location, string>;
  // declare removeLocations: BelongsToManyRemoveAssociationsMixin<
  //   Location,
  //   string
  // >;
  // declare hasLocation: BelongsToManyHasAssociationMixin<Location, string>;
  // declare hasLocations: BelongsToManyHasAssociationsMixin<Location, string>;
  // declare countLocations: BelongsToManyCountAssociationsMixin;
  // declare createLocation: BelongsToManyCreateAssociationMixin<Location>;

  declare Comments?: NonAttribute<Comment[]>;
  // declare Locations?: NonAttribute<Location[]>;

  declare static associations: {
    Comments: Association<Location, Comment>;
    // Locations: Association<Location, Location>;
  };
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
