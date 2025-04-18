import { BookingsRepository } from '@/repositories/bookings-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { ServicesRepository } from '@/repositories/services-repository';

import { Booking } from '@prisma/client';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';

export interface BookingRequest {
  userId: string;
  professionalId: string;
  serviceId: string;
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
    private servicesRepository: ServicesRepository,
  ) {}

  async execute(request: BookingRequest): Promise<BookingResponse> {
    // Validação de data/hora
    const now = new Date();
    if (request.startDateTime < now) {
      throw new InvalidDateTimeError();
    }

    // Verificações em paralelo
    const [user, professional, service] = await Promise.all([
      this.usersRepository.findById(request.userId),
      this.professionalsRepository.findById(request.professionalId),
      this.servicesRepository.findById(request.serviceId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (!professional) throw new ProfessionalNotFoundError();
    if (!service) throw new ServiceNotFoundError();

    // Validação de duração
    if (service.duracao <= 0) {
      throw new InvalidDurationError();
    }

    // Cálculo do horário final
    const endDateTime = new Date(
      request.startDateTime.getTime() + service.duracao * 60000,
    );

    // Verificação de conflito
    const conflictingBooking =
      await this.bookingsRepository.findOverlappingBooking(
        request.professionalId,
        request.startDateTime,
        endDateTime,
      );

    if (conflictingBooking) {
      throw new TimeSlotAlreadyBookedError();
    }

    // Criação do agendamento
    const booking = await this.bookingsRepository.create({
      dataHoraInicio: request.startDateTime,
      dataHoraFim: endDateTime,
      observacoes: request.notes,
      user: { connect: { id: request.userId } },
      profissional: { connect: { id: request.professionalId } },
      Service: { connect: { id: request.serviceId } },
      status: 'PENDENTE',
      items: {
        create: [
          {
            service: { connect: { id: request.serviceId } },
            preco: service.precoPadrao,
            duracao: service.duracao,
          },
        ],
      },
    });

    return { booking };
  }
}
