import { OrderPreferences } from "./enum.util";

export type ShiftAvailability = {
  sunday: Date[][];
  monday: Date[][];
  tuesday: Date[][];
  wednesday: Date[][];
  thursday: Date[][];
  friday: Date[][];
  saturday: Date[][];
};

export type EarningGoals = {
  daily: number;
  weekly: number;
};

export type PayRate = {
  hourlyRate: number;
  perDeliveryRate: number;
  distanceBasedRate: number; // Per mile
  surgePricingPreference: number;
  minimumEarningsGuarantee: number;
};

export type Item = {
  name: string;
  quantity?: number;
  size?: OrderPreferences;
  price: number;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  keepUpright?: boolean;
};

export type Photo = {
  data: Blob;
  name: string;
  type: string;
};