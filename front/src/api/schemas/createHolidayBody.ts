/**
 * Schema para criação de feriados
 */
export type CreateHolidayBody = {
  /** Data do feriado no formato ISO 8601 com timezone */
  date: string;
  /**
   * Motivo do feriado (3-100 caracteres)
   * @minLength 3
   * @maxLength 100
   */
  reason: string;
};
