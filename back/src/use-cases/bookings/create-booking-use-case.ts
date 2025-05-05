import { BookingsRepository } from '@/repositories/bookings-repository';
import { UsersRepository } from '@/repositories/users-repository';

import { Booking } from '@prisma/client';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { ServiceProfessionalNotFoundError } from '../errors/service-professional-not-found-error';

export interface BookingRequest {
  userId: string;
  professionalId: string;
  services: Array<{ serviceId: string }>;
  startDateTime: Date;
  notes?: string;
}

export interface BookingResponse {
  booking: Booking;
}

export class CreateBookingUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private serviceProfessionalRepository: ServiceProfessionalRepository,
  ) {}

  async execute(request: BookingRequest): Promise<void> {
    // 1. Validação básica da data/hora
    const now = new Date();
    if (request.startDateTime < now) {
      throw new InvalidDateTimeError();
    }

    // 2. Verificar existência do usuário e profissional
    const [user, professional] = await Promise.all([
      this.usersRepository.findById(request.userId),
      this.professionalsRepository.findById(request.professionalId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (!professional) throw new ProfessionalNotFoundError();

    // 3. Validar serviços através do ServiceProfessional
    const serviceProfessionals = await Promise.all(
      request.services.map(async ({ serviceId }) => {
        const sp =
          await this.serviceProfessionalRepository.findByServiceAndProfessional(
            serviceId,
            request.professionalId,
          );

        if (!sp) {
          throw new ServiceProfessionalNotFoundError();
        }

        if (sp.duracao <= 0) {
          throw new InvalidDurationError();
        }

        return sp;
      }),
    );

    // 4. Calcular duração total
    const totalDuration = serviceProfessionals.reduce(
      (sum, sp) => sum + sp.duracao,
      0,
    );

    if (totalDuration <= 0) {
      throw new InvalidDurationError();
    }

    const endDateTime = new Date(
      request.startDateTime.getTime() + totalDuration * 60000,
    );

    // 5. Verificar conflitos de horário
    const conflictingBooking =
      await this.bookingsRepository.findOverlappingBooking(
        request.professionalId,
        request.startDateTime,
        endDateTime,
      );

    if (conflictingBooking) {
      throw new TimeSlotAlreadyBookedError();
    }

    // 6. Criar o agendamento
    await this.bookingsRepository.create({
      dataHoraInicio: request.startDateTime,
      dataHoraFim: endDateTime,
      observacoes: request.notes,
      user: { connect: { id: request.userId } },
      profissional: { connect: { id: request.professionalId } },
      status: 'PENDENTE',
      valorFinal: serviceProfessionals.reduce((sum, sp) => sum + sp.preco, 0),
      items: {
        create: serviceProfessionals.map((sp) => ({
          serviceProfessionalId: sp.id,
          preco: sp.preco,
          nome: sp.service.nome,
          duracao: sp.duracao,
        })),
      },
    });
  }
}
