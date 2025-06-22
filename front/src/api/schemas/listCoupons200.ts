import type { ListCoupons200CouponsItem } from "./listCoupons200CouponsItem";

export type ListCoupons200 = {
  coupons: ListCoupons200CouponsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
