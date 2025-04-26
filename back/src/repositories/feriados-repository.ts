export interface FeriadosRepository {
  isProfessionalHoliday(
    professionalId: string,
    date: Date,
  ): Promise<{ motivo: string } | null>;
  addHoliday(professionalId: string, date: Date, motivo: string): Promise<void>;
  findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<{ id: string; motivo: string } | null>;
  findById(id: string): Promise<{
    id: string;
    profissionalId: string;
    data: Date;
    motivo: string;
  } | null>;
  delete(id: string): Promise<void>;
}
