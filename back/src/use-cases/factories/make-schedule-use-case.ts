import { PrismaBookingsRepository } from '@/repositories/prisma/prisma-bookings-repository';
import { PrismaProfessionalsRepository } from '@/repositories/prisma/prisma-professionals-repository';
import { GetProfessionalScheduleUseCase } from '../professional/get-schedule-use-case';
import { PrismaHorariosFuncionamentoRepository } from '@/repositories/prisma/prisma-horarios-funcionamento-repository';
import { PrismaFeriadosRepository } from '@/repositories/prisma/prisma-feriados-repository';

export function makeGetProfessionalScheduleUseCase() {
  const professionalsRepository = new PrismaProfessionalsRepository();
  const bookingsRepository = new PrismaBookingsRepository();
  const horariosFuncionamentoRepository =
    new PrismaHorariosFuncionamentoRepository();
  const feriadosRepository = new PrismaFeriadosRepository();

  return new GetProfessionalScheduleUseCase(
    professionalsRepository,
    bookingsRepository,
    horariosFuncionamentoRepository,
    feriadosRepository,
  );
}
