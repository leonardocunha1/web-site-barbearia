export type GetBusinessHoursProfessionalId200BusinessHoursItem = {
  id: string;
  ativo: boolean;
  /**
   * @minimum 0
   * @maximum 6
   */
  diaSemana: number;
  abreAs: string;
  fechaAs: string;
  /** @nullable */
  pausaInicio: string | null;
  /** @nullable */
  pausaFim: string | null;
  profissionalId: string;
};
