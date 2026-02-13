/**
 * Schema completo de horário comercial
 */
export type ListBusinessHours200BusinessHoursItem = {
  /** ID do registro */
  id: string;
  /** Indica se o horário está ativo */
  active: boolean;
  /**
   * Dia da semana (0=domingo a 6=sábado)
   * @minimum 0
   * @maximum 6
   */
  dayOfWeek: number;
  /** Horário de abertura */
  opensAt: string;
  /** Horário de fechamento */
  closesAt: string;
  /**
   * Início da pausa
   * @nullable
   */
  breakStart: string | null;
  /**
   * Fim da pausa
   * @nullable
   */
  breakEnd: string | null;
  /** ID do profissional associado */
  professionalId: string;
};
