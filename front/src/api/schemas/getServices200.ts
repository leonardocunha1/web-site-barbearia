import type { GetServices200ServicesItem } from "./getServices200ServicesItem";
import type { GetServices200Pagination } from "./getServices200Pagination";

export type GetServices200 = {
  services: GetServices200ServicesItem[];
  pagination: GetServices200Pagination;
};
