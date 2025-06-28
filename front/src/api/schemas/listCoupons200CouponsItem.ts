import type { ListCoupons200CouponsItemType } from "./listCoupons200CouponsItemType";
import type { ListCoupons200CouponsItemScope } from "./listCoupons200CouponsItemScope";
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
  /** @nullable */
  maxUses: number | null;
  /** @minimum 0 */
  uses: number;
  startDate: string;
  /** @nullable */
  endDate: string | null;
  /**
   * @minimum 0
   * @nullable
   */
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
