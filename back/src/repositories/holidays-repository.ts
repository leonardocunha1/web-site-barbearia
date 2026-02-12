export interface IHolidaysRepository {
  isProfessionalHoliday(
    professionalId: string,
    date: Date,
  ): Promise<{ reason: string } | null>;

  addHoliday(professionalId: string, date: Date, reason: string): Promise<void>;

  findByProfessionalAndDate(
    professionalId: string,
    date: Date,
  ): Promise<{ id: string; reason: string } | null>;

  findById(id: string): Promise<{
    id: string;
    professionalId: string; date: Date; reason: string;
  } | null>;

  delete(id: string): Promise<void>;

  findManyByProfessionalId(
    professionalId: string,
    pagination: { page: number; limit: number },
  ): Promise<
    {
      id: string;
      professionalId: string; date: Date; reason: string;
    }[]
  >;

  countByProfessionalId(professionalId: string): Promise<number>;
}


