import type { ListCoupons200CouponsItemType } from "./listCoupons200CouponsItemType";
import type { ListCoupons200CouponsItemScope } from "./listCoupons200CouponsItemScope";
import type { ListCoupons200CouponsItemExpirationType } from "./listCoupons200CouponsItemExpirationType";
import type { ListCoupons200CouponsItemStartDate } from "./listCoupons200CouponsItemStartDate";
import type { ListCoupons200CouponsItemEndDate } from "./listCoupons200CouponsItemEndDate";
import type { ListCoupons200CouponsItemCreatedAt } from "./listCoupons200CouponsItemCreatedAt";
import type { ListCoupons200CouponsItemUpdatedAt } from "./listCoupons200CouponsItemUpdatedAt";
import type { ListCoupons200CouponsItemService } from "./listCoupons200CouponsItemService";
import type { ListCoupons200CouponsItemProfessional } from "./listCoupons200CouponsItemProfessional";
import type { ListCoupons200CouponsItemUser } from "./listCoupons200CouponsItemUser";

/**
 * Modelo completo de cupom
 */
export type ListCoupons200CouponsItem = {
  id: string;
  /** @minLength 3 */
  code: string;
  /** @nullable */
  description: string | null;
  type: ListCoupons200CouponsItemType;
  /** @minimum 0 */
  value: number;
  scope: ListCoupons200CouponsItemScope;
  expirationType: ListCoupons200CouponsItemExpirationType;
  /** @nullable */
  maxUses: number | null;
  /** @minimum 0 */
  uses: number;
  startDate: ListCoupons200CouponsItemStartDate;
  /** @nullable */
  endDate: ListCoupons200CouponsItemEndDate;
  /**
   * @minimum 0
   * @nullable
   */
  minBookingValue: number | null;
  active: boolean;
  createdAt: ListCoupons200CouponsItemCreatedAt;
  updatedAt: ListCoupons200CouponsItemUpdatedAt;
  /** @nullable */
  service?: ListCoupons200CouponsItemService;
  /** @nullable */
  professional?: ListCoupons200CouponsItemProfessional;
  /** @nullable */
  user?: ListCoupons200CouponsItemUser;
};
