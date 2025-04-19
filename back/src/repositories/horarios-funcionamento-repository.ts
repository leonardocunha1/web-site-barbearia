export interface HorariosFuncionamentoRepository {
  findByProfessionalAndDay(
    professionalId: string,
    dayOfWeek: number,
  ): Promise<{
    id: string;
    profissionalId: string;
    diaSemana: number;
    abreAs: string;
    fechaAs: string;
    pausaInicio: string | null;
    pausaFim: string | null;
    ativo: boolean;
  } | null>;
}
