import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import {
  VehicleType,
  OrderPreferences,
  FoodPreferences,
  DeliverySpeed,
  RestaurantTypes,
  CuisineTypes,
  DietaryRestrictions,
} from "../utils/enum.util";
import {
  ShiftAvailability,
  EarningGoals,
  PayRate,
  Point,
} from "../utils/types.util";
var db = require("./db"),
  sequelize = db.sequelize;

class Setting extends Model<
  InferAttributes<Setting>,
  InferCreationAttributes<Setting>
> {
  declare id: CreationOptional<string>;
  declare courierId: ForeignKey<string>;
  declare deliveryPolygon: Point[] | null;
  declare vehicleType: VehicleType | null;
  declare preferredAreas: string[] | null;
  declare shiftAvailability: ShiftAvailability | null;
  declare orderPreferences: OrderPreferences[] | null;
  declare foodPreferences: FoodPreferences[] | null;
  declare earningGoals: EarningGoals | null;
  declare deliverySpeed: DeliverySpeed | null;
  declare restaurantTypes: RestaurantTypes[] | null;
  declare cuisineTypes: CuisineTypes[] | null;
  declare preferredRestaurantPartners: string[] | null;
  declare dietaryRestrictions: DietaryRestrictions[] | null;
  declare payRate: PayRate | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Setting.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    // Documentation on usage: https://sequelize.org/api/v6/class/src/data-types.js~geometry
    // TODO: Add PostGis extension: https://postgis.net/documentation/getting_started/
    deliveryPolygon: {
      type: DataTypes.GEOMETRY,
    },
    vehicleType: {
      type: DataTypes.ENUM(
        "bicycle",
        "motorcycle",
        "car",
        "scooter",
        "on_foot"
      ),
    },
    preferredAreas: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    shiftAvailability: {
      type: DataTypes.JSON,
    },
    // Guard array against duplicates
    orderPreferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    foodPreferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    // Structure: daily or weekly (keys) => goal amount (values)
    earningGoals: {
      type: DataTypes.JSON,
    },
    deliverySpeed: {
      type: DataTypes.ENUM("regular", "rush"),
    },
    restaurantTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    cuisineTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    preferredRestaurantPartners: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    dietaryRestrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    // hourly_date, per_delivery_rate, distance_based_rate,
    // surge_pricing_preference, or minimum_earnings_guarantee (keys)
    // => amount (value)
    payRate: {
      type: DataTypes.JSON,
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
    tableName: "setting",
    sequelize,
  }
);

export default Setting;
