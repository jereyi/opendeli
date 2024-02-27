import { VehicleType, OrderPreferences, FoodPreferences, DeliverySpeed, RestaurantTypes, CuisineTypes, DietaryRestrictions } from "../utils/enum.util";
import { ShiftAvailability, EarningGoals, PayRate } from "../utils/types.util";
import { Point, Polygon } from "geojson";

export type CouriersReqBody = {
    checkIsAvailable?: boolean;
    sortByDistance?: boolean;
    useDeliveryPolygon?: boolean;
    location?: Point;
}
export type ProfileReqBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};

export type SettingsReqBody = {
  deliveryPolygon?: Polygon;
  vehicleType?: VehicleType;
  preferredAreas?: string[];
  shiftAvailability?: ShiftAvailability;
  orderPreferences?: OrderPreferences[];
  foodPreferences?: FoodPreferences[];
  earningGoals?: EarningGoals;
  deliverySpeed?: DeliverySpeed;
  restaurantTypes?: RestaurantTypes[];
  cuisineType?: CuisineTypes[];
  preferredRestaurantPartners?: string[];
  dietaryRestrictions?: DietaryRestrictions[];
  payRate?: PayRate;
};
