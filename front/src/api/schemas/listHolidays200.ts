import type { ListHolidays200HolidaysItem } from "./listHolidays200HolidaysItem";

/**
 * Lista de feriados com paginação.
 */
export type ListHolidays200 = {
  /** Lista de feriados */
  holidays: ListHolidays200HolidaysItem[];
  /**
   * Total de registros
   * @minimum 0
   */
  total: number;
  /**
   * Página atual
   * @minimum 0
   * @exclusiveMinimum
   */
  page: number;
  /**
   * Itens por página
   * @minimum 0
   * @maximum 100
   * @exclusiveMinimum
   */
  limit: number;
  /**
   * Total de páginas
   * @minimum 0
   */
  totalPages: number;
};
