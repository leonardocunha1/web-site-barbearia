export interface FeriadosRepository {
  isProfessionalHoliday(
    professionalId: string,
    date: Date,
  ): Promise<{ motivo: string } | null>;
}
