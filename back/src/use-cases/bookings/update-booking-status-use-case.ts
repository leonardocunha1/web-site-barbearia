import { BookingsRepository } from '@/repositories/bookings-repository';
import { Status } from '@prisma/client';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';

interface UpdateBookingStatusUseCaseRequest {
  bookingId: string;
  status: Status;
  reason?: string;
  profissionalId: string;
}

interface UpdateBookingStatusUseCaseResponse {
  booking: {
    id: string;
    status: Status;
    dataHoraInicio: Date;
    dataHoraFim: Date;
    observacoes?: string;
  };
}

export class UpdateBookingStatusUseCase {
  constructor(private bookingsRepository: BookingsRepository) {}

  async execute(
    request: UpdateBookingStatusUseCaseRequest,
  ): Promise<UpdateBookingStatusUseCaseResponse> {
    const { bookingId, status, reason, profissionalId } = request;

    // Buscar o agendamento
    const booking = await this.bookingsRepository.findById(bookingId);
    if (!booking) {
      throw new BookingNotFoundError();
    }

    // Validações específicas para cada status
    if (status === 'CONFIRMADO' && booking.status !== 'PENDENTE') {
      throw new InvalidBookingStatusError(booking.status, 'PENDENTE');
    }

    // Verificar se o profissional é o dono do agendamento
    if (booking.profissionalId !== profissionalId) {
      throw new BookingUpdateError(
        'Você não tem permissão para alterar este agendamento',
      );
    }

    if (status === 'CANCELADO') {
      if (booking.status === 'CANCELADO') {
        throw new BookingUpdateError('Agendamento já cancelado');
      }

      // Validar motivo para cancelamento (opcional)
      if (reason && reason.length > 500) {
        throw new BookingUpdateError(
          'Motivo do cancelamento muito longo (máx. 500 caracteres)',
        );
      }
    }
    // Preparar dados para atualização
    const updateData = {
      status,
      ...(status === 'CONFIRMADO' && {
        confirmedAt: new Date(),
        observacoes: booking.observacoes, // Mantém as observações originais
      }),
      ...(status === 'CANCELADO' && {
        canceledAt: new Date(),
        observacoes: reason
          ? `${booking.observacoes ? booking.observacoes + '\n' : ''}Motivo do cancelamento: ${reason}`
          : booking.observacoes,
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
        dataHoraInicio: updatedBooking.dataHoraInicio,
        dataHoraFim: updatedBooking.dataHoraFim,
        observacoes: updatedBooking.observacoes ?? undefined,
      },
    };
  }
}
