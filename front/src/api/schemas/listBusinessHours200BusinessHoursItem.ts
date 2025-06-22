/**
 * Schema completo de horário comercial
 */
export type ListBusinessHours200BusinessHoursItem = {
  /** ID do registro */
  id: string;
  /** Indica se o horário está ativo */
  ativo: boolean;
  /**
   * Dia da semana (0=domingo a 6=sábado)
   * @minimum 0
   * @maximum 6
   */
  diaSemana: number;
  /** Horário de abertura */
  abreAs: string;
  /** Horário de fechamento */
  fechaAs: string;
  /**
   * Início da pausa
   * @nullable
   */
  pausaInicio: string | null;
  /**
   * Fim da pausa
   * @nullable
   */
  pausaFim: string | null;
  /** ID do profissional associado */
  profissionalId: string;
};
