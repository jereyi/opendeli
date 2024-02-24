import { VehicleType, OrderPreferences, FoodPreferences, DeliverySpeed, RestaurantTypes, CuisineTypes, DietaryRestrictions } from "../utils/enum.util";
import { Point, ShiftAvailability, EarningGoals, PayRate } from "../utils/types.util";

export type CouriersReqBody = {
    isAvailable?: boolean;
    shiftAt?: Date;
    location?: Point;
}
export type ProfileReqBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};

export type SettingsReqBody = {
  deliveryPolygon: Point[];
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
  createdAt: Date;
  updatedAt: Date;
};
