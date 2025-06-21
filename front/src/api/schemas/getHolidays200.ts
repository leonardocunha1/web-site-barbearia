import type { GetHolidays200HolidaysItem } from "./getHolidays200HolidaysItem";

/**
 * Lista de feriados com paginação.
 */
export type GetHolidays200 = {
  holidays: GetHolidays200HolidaysItem[];
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  total: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  page: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  limit: number;
  /**
   * @minimum 0
   * @exclusiveMinimum
   */
  totalPages: number;
};
