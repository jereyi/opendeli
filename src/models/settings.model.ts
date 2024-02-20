import { DataTypes } from "sequelize";
import sequelize from "../configs/db.config";

const Settings = sequelize.define(
  "Settings",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
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
    // days of the week (keys) => an array of time ranges (values)
    shiftAvailability: {
      type: DataTypes.JSON,
    },
    // Guard array against duplicates
    orderPreferences: {
      type: DataTypes.ARRAY(
        DataTypes.ENUM("small_orders", "medium_orders", "large_orders")
      ),
    },
    foodPreference: {
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
    specificFoodTypePreferences: {
      type: DataTypes.ARRAY(
        DataTypes.ENUM("vegan", "vegetarian", "halal", "kosher", "organic", "no_alcohol")
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
  }
);

Settings.belongsTo(sequelize.models.courier);

export default Settings;
