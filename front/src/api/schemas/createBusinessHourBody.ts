/**
 * Schema para criação de horário comercial
 */
export type CreateBusinessHourBody = {
  /** ID do profissional no formato UUID */
  professionalId: string;
  /**
   * Dia da semana (0=domingo a 6=sábado)
   * @minimum 0
   * @maximum 6
   */
  diaSemana: number;
  /**
   * Horário de abertura no formato HH:MM
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  abreAs: string;
  /**
   * Horário de fechamento no formato HH:MM (deve ser após a abertura)
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  fechaAs: string;
  /**
   * Início da pausa (opcional) no formato HH:MM
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  pausaInicio?: string | null;
  /**
   * Fim da pausa (opcional) no formato HH:MM (deve ser após o início)
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  pausaFim?: string | null;
};
