import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import Location from "./location.model";
import Merchant from "./merchant.model";
import Courier from "./courier.model";
var db = require("./db"),
  sequelize = db.sequelize;

class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
  declare id: CreationOptional<string>;
  declare text: string | null;
  declare likes: CreationOptional<number>;
  declare likers: CreationOptional<string[]>;
  declare CourierId: ForeignKey<Courier["id"]>;
  declare commentableId:
    | ForeignKey<Merchant["id"]>
    | ForeignKey<Location["id"]>;
  declare commentableType: "merchant" | "location";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getMerchant: BelongsToGetAssociationMixin<Merchant>;
  declare setMerchant: BelongsToSetAssociationMixin<Merchant, string>;
  declare createMerchant: BelongsToCreateAssociationMixin<Merchant>;

  declare getLocation: BelongsToGetAssociationMixin<Location>;
  declare setLocation: BelongsToSetAssociationMixin<Location, string>;
  declare createLocation: BelongsToCreateAssociationMixin<Location>;

  getCommentable(options: any) {
    if (!this.commentableType) return Promise.resolve(null);
    const mixinMethodName =
      this.commentableType == "location" ? "getLocation" : "getMerchant";
    return this[mixinMethodName](options);
  }

  declare commentable?: NonAttribute<Location|Merchant>;
}

Comment.init(
  {
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
    likers: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: []
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
    commentableId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    commentableType: {
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
