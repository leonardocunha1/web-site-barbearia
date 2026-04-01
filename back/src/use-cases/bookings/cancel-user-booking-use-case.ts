import { Status } from '@prisma/client';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { MAX_BOOKING_CANCEL_REASON_LENGTH, MIN_BOOKING_CANCEL_HOURS } from '@/consts/const';

interface CancelUserBookingRequest {
  bookingId: string;
  userId: string;
  reason?: string;
}

export class CancelUserBookingUseCase {
  constructor(private bookingsRepository: IBookingsRepository) {}

  async execute({ bookingId, userId, reason }: CancelUserBookingRequest): Promise<void> {
    const booking = await this.bookingsRepository.findById(bookingId);

    if (!booking) {
      throw new BookingNotFoundError();
    }

    if (booking.userId !== userId) {
      throw new UsuarioTentandoPegarInformacoesDeOutro();
    }

    if (booking.status === Status.CANCELED) {
      throw new BookingUpdateError('Agendamento ja cancelado');
    }

    if (booking.status !== Status.PENDING) {
      throw new InvalidBookingStatusError(booking.status, Status.PENDING);
    }

    if (reason && reason.length > MAX_BOOKING_CANCEL_REASON_LENGTH) {
      throw new BookingUpdateError(
        `Motivo do cancelamento muito longo (max. ${MAX_BOOKING_CANCEL_REASON_LENGTH} caracteres)`,
      );
    }

    const now = new Date();
    const minCancelDate = new Date(now.getTime() + MIN_BOOKING_CANCEL_HOURS * 60 * 60 * 1000);

    if (booking.startDateTime <= minCancelDate) {
      throw new BookingUpdateError(
        `Cancelamento permitido apenas com no minimo ${MIN_BOOKING_CANCEL_HOURS} horas de antecedencia`,
      );
    }

    await this.bookingsRepository.update(bookingId, {
      status: Status.CANCELED,
      canceledAt: now,
      notes: reason
        ? `${booking.notes ? booking.notes + '\n' : ''}Motivo do cancelamento: ${reason}`
        : booking.notes,
    });
  }
}
