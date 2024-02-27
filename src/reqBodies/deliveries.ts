import { OrderStatus } from "../utils/enum.util";

export type GetDeliveriesReqBody = {
    merchantIds?: string[];
    courierIds?: string[];
    statuses?: OrderStatus[];
    deliveryTime?: Date[];
    timeOperator?: "between" | "before" | "after" | "at";
}

export type CourierNotesReqBody = {
    courierNotes?: string[];
    shouldAppend?: boolean;
}

export type IssueReqBody = {
    undeliverableAction?: string;
    undeliverableReason?: string;
}