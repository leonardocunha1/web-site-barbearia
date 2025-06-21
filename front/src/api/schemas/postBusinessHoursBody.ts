export type PostBusinessHoursBody = {
  professionalId: string;
  /**
   * @minimum 0
   * @maximum 6
   */
  diaSemana: number;
  /** @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$ */
  abreAs: string;
  /** @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$ */
  fechaAs: string;
  /**
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  pausaInicio?: string | null;
  /**
   * @nullable
   * @pattern ^([01]?[0-9]|2[0-3]):[0-5][0-9]$
   */
  pausaFim?: string | null;
};
