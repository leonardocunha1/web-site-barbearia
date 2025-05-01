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
    private servicesRepository: ServicesRepository,
  ) {}

  async execute(request: BookingRequest): Promise<void> {
    const now = new Date();
    if (request.startDateTime < now) {
      throw new InvalidDateTimeError();
    }

    const [user, professional] = await Promise.all([
      this.usersRepository.findById(request.userId),
      this.professionalsRepository.findById(request.professionalId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (!professional) throw new ProfessionalNotFoundError();

    // Buscar todos os serviços
    const services = await Promise.all(
      request.services.map(async ({ serviceId }) => {
        const service = await this.servicesRepository.findById(serviceId);
        if (!service) throw new ServiceNotFoundError();
        if (service.duracao <= 0) throw new InvalidDurationError();
        return service;
      }),
    );

    // Somar as durações dos serviços
    const totalDuration = services.reduce(
      (sum, service) => sum + service.duracao,
      0,
    );
    const endDateTime = new Date(
      request.startDateTime.getTime() + totalDuration * 60000,
    );

    // Verificar conflito de horário
    const conflictingBooking =
      await this.bookingsRepository.findOverlappingBooking(
        request.professionalId,
        request.startDateTime,
        endDateTime,
      );
    if (conflictingBooking) {
      throw new TimeSlotAlreadyBookedError();
    }

    // Criar o agendamento com múltiplos serviços
    await this.bookingsRepository.create({
      dataHoraInicio: request.startDateTime,
      dataHoraFim: endDateTime,
      observacoes: request.notes,
      user: { connect: { id: request.userId } },
      profissional: { connect: { id: request.professionalId } },
      status: 'PENDENTE',
      items: {
        create: services.map((service) => ({
          service: { connect: { id: service.id } },
          preco: service.precoPadrao,
          duracao: service.duracao,
        })),
      },
    });
  }
}
