import { VehicleType, OrderPreferences, FoodPreferences, DeliverySpeed, RestaurantTypes, CuisineTypes, DietaryRestrictions, UserStatus, OrderSetting } from "../utils/enum.util";
import { ShiftAvailability, EarningGoals, PayRate } from "../utils/types.util";
import { Point, Polygon } from "geojson";

export type GetCouriersReqBody = {
    checkIsAvailable?: boolean;
    sortByDistance?: boolean;
    useDeliveryPolygon?: boolean;
    location?: Point;
}
export type UpdateCourierReqBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  status?: UserStatus;
  orderSetting?: OrderSetting;
  currentLocation?: Point;
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
  cuisineTypes?: CuisineTypes[];
  preferredRestaurantPartners?: string[];
  dietaryRestrictions?: DietaryRestrictions[];
  payRate?: PayRate;
};
