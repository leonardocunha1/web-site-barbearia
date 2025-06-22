import type { ListCoupons200CouponsItemType } from "./listCoupons200CouponsItemType";
import type { ListCoupons200CouponsItemScope } from "./listCoupons200CouponsItemScope";
import type { ListCoupons200CouponsItemService } from "./listCoupons200CouponsItemService";
import type { ListCoupons200CouponsItemProfessional } from "./listCoupons200CouponsItemProfessional";
import type { ListCoupons200CouponsItemUser } from "./listCoupons200CouponsItemUser";

/**
 * Coupon
 */
export type ListCoupons200CouponsItem = {
  id: string;
  code: string;
  /** @nullable */
  description: string | null;
  type: ListCoupons200CouponsItemType;
  value: number;
  scope: ListCoupons200CouponsItemScope;
  /** @nullable */
  maxUses: number | null;
  uses: number;
  startDate: string;
  /** @nullable */
  endDate: string | null;
  /** @nullable */
  minBookingValue: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  /** @nullable */
  service?: ListCoupons200CouponsItemService;
  /** @nullable */
  professional?: ListCoupons200CouponsItemProfessional;
  /** @nullable */
  user?: ListCoupons200CouponsItemUser;
};
