import { OrderStatus } from "../utils/enum.util";

export type GetOffersReqBody = {
  merchantIds?: string[];
  deliveryTime?: Date[];
  timeOperator?: "between" | "before" | "after" | "at";
};