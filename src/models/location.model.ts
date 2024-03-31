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
import { StringColorFormat } from "@faker-js/faker";
var db = require("./db"),
  sequelize = db.sequelize;

// TODO: Verify on delete and on update
class Location extends Model<
  InferAttributes<Location, { omit: "Comments" }>,
  InferCreationAttributes<Location, { omit: "Comments" }>
  > {
  // Use some reverse geocoding api to standardize these fields
  declare id: CreationOptional<string>;
  declare addressLine1: string | null;
  declare addressLine2: string | null;
  declare city: string | null;
  declare state: string | null;
  declare street: string | null;
  declare houseNumber: string | null;
  declare longitude: number;
  declare latitude: number;
  declare postCode: string | null;
  declare stateCode: string | null;
  declare countryCode: string | null;
  declare formattedAddress: string | null;
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

  // declare getMerchants: BelongsToManyGetAssociationsMixin<Merchant>;
  // declare addMerchant: BelongsToManyAddAssociationMixin<Merchant, string>;
  // declare addMerchants: BelongsToManyAddAssociationsMixin<Merchant, string>;
  // declare setMerchants: BelongsToManySetAssociationsMixin<Merchant, string>;
  // declare removeMerchant: BelongsToManyRemoveAssociationMixin<Merchant, string>;
  // declare removeMerchants: BelongsToManyRemoveAssociationsMixin<
  //   Merchant,
  //   string
  // >;
  // declare hasMerchant: BelongsToManyHasAssociationMixin<Merchant, string>;
  // declare hasMerchants: BelongsToManyHasAssociationsMixin<Merchant, string>;
  // declare countMerchants: BelongsToManyCountAssociationsMixin;
  // declare createMerchant: BelongsToManyCreateAssociationMixin<Merchant>;

  declare Comments?: NonAttribute<Comment[]>;
  // declare Merchants?: NonAttribute<Merchant[]>;

  declare static associations: {
    Comments: Association<Location, Comment>;
    // Merchants: Association<Location, Merchant>;
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
    addressLine1: {
      type: DataTypes.STRING,
    },
    addressLine2: {
      type: DataTypes.STRING,
    },
    // City, Town, or Village
    city: {
      type: DataTypes.STRING,
    },
    // State, Province, or Prefecture
    state: {
      type: DataTypes.STRING,
    },
    street: {
      type: DataTypes.STRING,
    },
    postCode: {
      type: DataTypes.STRING,
    },
    // ISO Alpha-2 Contry Code (eg. United States of America -> US)
    countryCode: {
      type: DataTypes.STRING,
    },
    stateCode: {
      type: DataTypes.STRING,
    },
    houseNumber: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    formattedAddress: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Other model options go here
    tableName: "locations",
    sequelize,
  }
);

export default Location;
