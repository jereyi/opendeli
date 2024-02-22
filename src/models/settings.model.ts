import { DataTypes, GeographyDataType, Model } from "sequelize";
import sequelize from "../configs/db.config";
import { VehicleType, OrderPreferences, FoodPreferences, DeliverySpeed, RestaurantTypes, CuisineTypes, DietaryRestrictions } from "../utils/enum.util";
import { ShiftAvailability, EarningGoals, PayRate } from "../utils/types.util";

class Settings extends Model {
  declare id: number;
  declare deliveryPolygon: GeographyDataType | null;
  declare vehicleType: VehicleType | null;
  declare preferredAreas: string[] | null;
  declare shiftAvailability: ShiftAvailability | null;
  declare orderPreferences: OrderPreferences | null;
  declare foodPreferences: FoodPreferences | null;
  declare earningGoals: EarningGoals | null;
  declare deliverySpeed: DeliverySpeed | null;
  declare restaurantTypes: RestaurantTypes | null;
  declare cuisineType: CuisineTypes | null;
  declare preferredRestaurantPartners: string[] | null;
  declare dietaryRestrictions: DietaryRestrictions | null;
  declare payRate: PayRate | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Settings.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    // Documentation on usage: https://sequelize.org/api/v6/class/src/data-types.js~geometry
    // TODO: Add PostGis extension: https://postgis.net/documentation/getting_started/
    deliveryPolygon: {
      type: DataTypes.GEOGRAPHY,
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
      type: DataTypes.ARRAY(
        DataTypes.ENUM("small_orders", "medium_orders", "large_orders")
      ),
    },
    foodPreferences: {
      type: DataTypes.ARRAY(DataTypes.ENUM("hot", "cold", "fragile")),
    },
    // Structure: daily or weekly (keys) => goal amount (values)
    earningsGoals: {
      type: DataTypes.JSON,
    },
    deliverySpeed: {
      type: DataTypes.ENUM("regular", "rush"),
    },
    restaurantTypes: {
      type: DataTypes.ARRAY(
        DataTypes.ENUM(
          "local",
          "chain",
          "black_owned",
          "women_owned",
          "franchise",
          "upscale",
          "fast_casual",
          "food_trucks",
          "vegan_vegetarian"
        )
      ),
    },
    cuisineTypes: {
      type: DataTypes.ARRAY(
        DataTypes.ENUM(
          "american",
          "italian",
          "mexican",
          "chinese",
          "japanese",
          "indian",
          "mediterranean",
          "thai",
          "french",
          "korean",
          "vietnamese",
          "middle_eastern",
          "african",
          "caribbean"
        )
      ),
    },
    preferredRestaurantPartners: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    dietaryRestrictions: {
      type: DataTypes.ARRAY(
        DataTypes.ENUM(
          "vegan",
          "vegetarian",
          "halal",
          "kosher",
          "organic",
          "alcohol_free"
        )
      ),
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
    tableName: 'settings',
    sequelize
  }
);

export default Settings;
