import type { ListServices200ServicesItem } from "./listServices200ServicesItem";
import type { ListServices200Pagination } from "./listServices200Pagination";

export type ListServices200 = {
  services: ListServices200ServicesItem[];
  pagination: ListServices200Pagination;
};
