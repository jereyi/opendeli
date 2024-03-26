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
} from "../utils/types.util";
import { Polygon } from "geojson";
var db = require("./db"),
  sequelize = db.sequelize;

class Setting extends Model<
  InferAttributes<Setting>,
  InferCreationAttributes<Setting>
> {
  declare id: CreationOptional<string>;
  declare CourierId: ForeignKey<string>;
  declare deliveryPolygon: Polygon | null;
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
      defaultValue: []
    },
    shiftAvailability: {
      type: DataTypes.JSON,
      defaultValue: {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      }
    },
    // Guard array against duplicates
    orderPreferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    foodPreferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    // Structure: daily or weekly (keys) => goal amount (values)
    earningGoals: {
      type: DataTypes.JSON,
    },
    deliverySpeed: {
      type: DataTypes.ENUM("regular", "rush"),
      defaultValue: "regular",
    },
    restaurantTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    cuisineTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    preferredRestaurantPartners: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    dietaryRestrictions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
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
