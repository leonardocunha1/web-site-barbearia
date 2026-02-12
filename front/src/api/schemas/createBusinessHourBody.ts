/**
 * Schema para criação de horário comercial
 */
export type CreateBusinessHourBody = {
  /**
   * Dia da semana (0=domingo a 6=sábado)
   * @minimum 0
   * @maximum 6
   */
  dayOfWeek: number;
  /**
   * Horário de abertura no formato HH:MM
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  opensAt: string;
  /**
   * Horário de fechamento no formato HH:MM (deve ser após a abertura)
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  closesAt: string;
  /**
   * Início da pausa (opcional) no formato HH:MM
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  breakStart?: string | null;
  /**
   * Fim da pausa (opcional) no formato HH:MM (deve ser após o início)
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  breakEnd?: string | null;
};
