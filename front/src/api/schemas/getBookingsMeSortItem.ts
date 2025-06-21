import type { GetBookingsMeSortItemField } from "./getBookingsMeSortItemField";
import type { GetBookingsMeSortItemOrder } from "./getBookingsMeSortItemOrder";

export type GetBookingsMeSortItem = {
  field: GetBookingsMeSortItemField;
  order: GetBookingsMeSortItemOrder;
};
