import type { ListUsers200UsersItem } from "./listUsers200UsersItem";

export type ListUsers200 = {
  users: ListUsers200UsersItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
