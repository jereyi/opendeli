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
  deliveryPolygon: Polygon | null;
  vehicleType: VehicleType | null;
  preferredAreas: string[] | null;
  shiftAvailability: ShiftAvailability | null;
  orderPreferences: OrderPreferences[] | null;
  foodPreferences: FoodPreferences[] | null;
  earningGoals: EarningGoals | null;
  deliverySpeed: DeliverySpeed | null;
  restaurantTypes: RestaurantTypes[] | null;
  cuisineType: CuisineTypes[] | null;
  preferredRestaurantPartners: string[] | null;
  dietaryRestrictions: DietaryRestrictions[] | null;
  payRate: PayRate | null;
};
