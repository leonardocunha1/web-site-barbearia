import { Prisma } from '@prisma/client';

export type BusinessHours = {
  id: string;
  profissionalId: string;
  diaSemana: number;
  abreAs: string;
  fechaAs: string;
  pausaInicio: string | null;
  pausaFim: string | null;
  ativo: boolean;
};

export interface HorariosFuncionamentoRepository {
  findById(id: string): Promise<BusinessHours | null>;
  delete(id: string): Promise<void>;
  findByProfessionalAndDay(
    professionalId: string,
    dayOfWeek: number,
  ): Promise<BusinessHours | null>;
  create(data: Prisma.HorarioFuncionamentoCreateInput): Promise<BusinessHours>;
  update(
    id: string,
    data: Prisma.HorarioFuncionamentoUpdateInput,
  ): Promise<BusinessHours>;
  listByProfessional(professionalId: string): Promise<BusinessHours[]>;
}
