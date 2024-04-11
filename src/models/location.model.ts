import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
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
import Comment from "./comment.model";
import OrderLocation from "./orderlocation.model";
import Order from "./order.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Location extends Model<
  InferAttributes<Location, { omit: "Comments" }>,
  InferCreationAttributes<Location, { omit: "Comments" }>
  > {
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

  declare Comments?: NonAttribute<Comment[]>;
  declare OrderLocation?: NonAttribute<OrderLocation>;

  declare static associations: {
    Comments: Association<Location, Comment>;
    Orders: Association<Location, Order>;
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
    tableName: "locations",
    sequelize,
  }
);

export default Location;
