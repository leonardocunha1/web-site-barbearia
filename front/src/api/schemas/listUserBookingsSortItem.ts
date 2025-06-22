import type { ListUserBookingsSortItemField } from "./listUserBookingsSortItemField";
import type { ListUserBookingsSortItemOrder } from "./listUserBookingsSortItemOrder";

/**
 * SortSchema
 */
export type ListUserBookingsSortItem = {
  /** SortField */
  field: ListUserBookingsSortItemField;
  /** SortOrder */
  order: ListUserBookingsSortItemOrder;
};
