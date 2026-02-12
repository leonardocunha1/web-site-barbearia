/**
 * Schema para atualização de horário comercial
 */
export type UpdateBusinessHourBody = {
  /**
   * Dia da semana (0=domingo a 6=sábado)
   * @minimum 0
   * @maximum 6
   */
  dayOfWeek?: number;
  /**
   * Novo horário de abertura (opcional)
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  opensAt?: string;
  /**
   * Novo horário de fechamento (opcional)
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  closesAt?: string;
  /**
   * Novo início de pausa (opcional)
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  breakStart?: string | null;
  /**
   * Novo fim de pausa (opcional)
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  breakEnd?: string | null;
};
