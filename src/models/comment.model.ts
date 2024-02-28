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
  NonAttribute,
  Association,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import Location from "./location.model";
import Merchant from "./merchant.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Comment extends Model<
  InferAttributes<Comment, { omit: "Replys" }>,
  InferCreationAttributes<Comment, { omit: "Replys" }>
> {
  declare id: CreationOptional<string>;
  declare text: string | null;
  declare likes: CreationOptional<number>;
  // Parent comment id
  declare CommentId: ForeignKey<Comment["id"]> | null;
  declare MerchantId: ForeignKey<Merchant["id"]> | null;
  declare LocationId: ForeignKey<Location["id"]> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getReplys: HasManyGetAssociationsMixin<Comment>;
  declare addReply: HasManyAddAssociationMixin<Comment, string>;
  declare addReplys: HasManyAddAssociationsMixin<Comment, string>;
  declare setReplys: HasManySetAssociationsMixin<Comment, string>;
  declare removeReply: HasManyRemoveAssociationMixin<Comment, string>;
  declare removeReplys: HasManyRemoveAssociationsMixin<Comment, string>;
  declare hasReply: HasManyHasAssociationMixin<Comment, string>;
  declare hasReplys: HasManyHasAssociationsMixin<Comment, string>;
  declare countReplys: HasManyCountAssociationsMixin;
  declare createReply: HasManyCreateAssociationMixin<Comment, "CommentId">;

  declare getMerchant: BelongsToGetAssociationMixin<Merchant>;
  declare setMerchant: BelongsToSetAssociationMixin<Merchant, string>;
  declare createMerchant: BelongsToCreateAssociationMixin<Merchant>;

  declare getLocation: BelongsToGetAssociationMixin<Location>;
  declare setLocation: BelongsToSetAssociationMixin<Location, string>;
  declare createLocation: BelongsToCreateAssociationMixin<Location>;

  declare getComment: BelongsToGetAssociationMixin<Comment>;
  declare setComment: BelongsToSetAssociationMixin<Comment, string>;
  declare createComment: BelongsToCreateAssociationMixin<Comment>;

  declare Replys?: NonAttribute<Comment[]>;

  declare static associations: {
    Replys: Association<Comment, Comment>;
  };
}

Comment.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.STRING,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: "comments",
    sequelize,
  }
);

export default Comment;
