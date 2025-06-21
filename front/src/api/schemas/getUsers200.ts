import type { GetUsers200UsersItem } from "./getUsers200UsersItem";

export type GetUsers200 = {
  users: GetUsers200UsersItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
