import { IBookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import { MAX_BOOKING_CANCEL_REASON_LENGTH } from '@/consts/const';
import {
  UpdateBookingStatusUseCaseRequest,
  UpdateBookingStatusUseCaseResponse,
} from './types';

export class UpdateBookingStatusUseCase {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute(
    request: UpdateBookingStatusUseCaseRequest,
  ): Promise<UpdateBookingStatusUseCaseResponse> {
    const { bookingId, status, reason, professionalId } = request;

    // Buscar o agendamento
    const booking = await this.bookingsRepository.findById(bookingId);
    if (!booking) {
      throw new BookingNotFoundError();
    }

    // Validações específicas para cada status
    if (status === 'CONFIRMED' && booking.status !== 'PENDING') {
      throw new InvalidBookingStatusError(booking.status, 'PENDING');
    }

    // Verificar se o profissional é o dono do agendamento
    if (booking.professionalId !== professionalId) {
      throw new BookingUpdateError(
        'Você não tem permissão para alterar este agendamento',
      );
    }

    if (status === 'CANCELED') {
      if (booking.status === 'CANCELED') {
        throw new BookingUpdateError('Agendamento já cancelado');
      }

      // Validar motivo para cancelamento (opcional)
      if (reason && reason.length > MAX_BOOKING_CANCEL_REASON_LENGTH) {
        throw new BookingUpdateError(
          `Motivo do cancelamento muito longo (max. ${MAX_BOOKING_CANCEL_REASON_LENGTH} caracteres)`,
        );
      }
    }
    // Preparar dados para atualização
    const updateData = {
      status,
      ...(status === 'CONFIRMED' && {
        confirmedAt: new Date(),
        notes: booking.notes, // Mantém as observações originais
      }),
      ...(status === 'CANCELED' && {
        canceledAt: new Date(),
        notes: reason
          ? `${booking.notes ? booking.notes + '\n' : ''}Motivo do cancelamento: ${reason}`
          : booking.notes,
      }),
    };

    // Atualizar o agendamento
    const updatedBooking = await this.bookingsRepository.update(
      bookingId,
      updateData,
    );

    if (!updatedBooking) {
      throw new BookingUpdateError('Erro ao atualizar o agendamento');
    }

    return {
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        startDateTime: updatedBooking.dateHoraInicio,
        endDateTime: updatedBooking.endDateTime,
        notes: updatedBooking.notes ?? undefined,
      },
    };
  }
}

