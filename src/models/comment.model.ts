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
  declare ParentCommentId: ForeignKey<Comment["id"]> | null;
  declare CommentableId:
    | ForeignKey<Merchant["id"]>
    | ForeignKey<Location["id"]>;
  declare CommentableType: "merchant" | "location";
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
  declare createReply: HasManyCreateAssociationMixin<Comment, "ParentCommentId">;

  declare getMerchant: BelongsToGetAssociationMixin<Merchant>;
  declare setMerchant: BelongsToSetAssociationMixin<Merchant, string>;
  declare createMerchant: BelongsToCreateAssociationMixin<Merchant>;

  declare getLocation: BelongsToGetAssociationMixin<Location>;
  declare setLocation: BelongsToSetAssociationMixin<Location, string>;
  declare createLocation: BelongsToCreateAssociationMixin<Location>;

  getCommentable(options: any) {
    if (!this.CommentableType) return Promise.resolve(null);
    const mixinMethodName =
      this.CommentableType == "location" ? "getLocation" : "getMerchant";
    return this[mixinMethodName](options);
  }

  setCommentable(options: any) {
    if (!this.CommentableType) return Promise.resolve(null);
    const mixinMethodName =
      this.CommentableType == "location" ? "setLocation" : "setMerchant";
    return this[mixinMethodName](options);
  }

  createCommentable(options: any) {
    if (!this.CommentableType) return Promise.resolve(null);
    const mixinMethodName =
      this.CommentableType == "location" ? "createLocation" : "createMerchant";
    return this[mixinMethodName](options);
  }

  declare getParentComment: BelongsToGetAssociationMixin<Comment>;
  declare setParentComment: BelongsToSetAssociationMixin<Comment, string>;
  declare createParentComment: BelongsToCreateAssociationMixin<Comment>;

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
    CommentableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CommentableType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    sequelize,
  }
);

Comment.addHook("afterFind", (findResult) => {
  if (findResult) {
    let result;
    if (!Array.isArray(findResult)) result = [findResult];
    else {
      result = findResult
    }
    for (const instance of result) {
      if (instance.commentableType === "location" && instance.Location !== undefined) {
        instance.commentable = instance.Location;
      } else if (
        instance.commentableType === "merchant" &&
        instance.Merchant !== undefined
      ) {
        instance.commentable = instance.Merchant;
      }
    }
  }
});

export default Comment;
