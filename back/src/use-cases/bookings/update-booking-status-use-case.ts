import { IBookingsRepository } from '@/repositories/bookings-repository';
import { IUserBonusRepository } from '@/repositories/user-bonus-repository';
import { IBonusTransactionRepository } from '@/repositories/bonus-transaction-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import {
  MAX_BOOKING_CANCEL_REASON_LENGTH,
  BONUS_EXPIRATION_MONTHS,
  LOYALTY_BOOKINGS_REQUIRED,
  LOYALTY_POINTS,
  POINTS_PER_10_REAIS,
} from '@/consts/const';
import { UpdateBookingStatusUseCaseRequest, UpdateBookingStatusUseCaseResponse } from './types';

export class UpdateBookingStatusUseCase {
  constructor(
    private bookingsRepository: IBookingsRepository,
    private userBonusRepository: IUserBonusRepository,
    private bonusTransactionRepository: IBonusTransactionRepository,
  ) {}

  async execute(
    request: UpdateBookingStatusUseCaseRequest,
  ): Promise<UpdateBookingStatusUseCaseResponse> {
    const { bookingId, status, reason, professionalId } = request;

    // Buscar o agendamento
    const booking = await this.bookingsRepository.findById(bookingId);
    if (!booking) {
      throw new BookingNotFoundError();
    }

    // Verificar se o profissional é o dono do agendamento
    if (booking.professionalId !== professionalId) {
      throw new BookingUpdateError('Você não tem permissão para alterar este agendamento');
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

    if (status === 'COMPLETED') {
      const now = new Date();
      if (booking.endDateTime > now) {
        throw new BookingUpdateError(
          'Não é possível concluir um agendamento antes do horário terminar',
        );
      }
    }

    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELED'],
      CONFIRMED: ['COMPLETED', 'CANCELED'],
      CANCELED: [],
      COMPLETED: [],
    };

    const allowedNextStatuses = allowedTransitions[booking.status] ?? [];

    if (!allowedNextStatuses.includes(status)) {
      throw new InvalidBookingStatusError(
        booking.status,
        allowedNextStatuses.length > 0 ? allowedNextStatuses.join(' ou ') : 'nenhum',
      );
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
    const updatedBooking = await this.bookingsRepository.update(bookingId, updateData);

    if (!updatedBooking) {
      throw new BookingUpdateError('Erro ao atualizar o agendamento');
    }

    // Se o agendamento foi concluído, atribuir pontos de bônus
    if (status === 'COMPLETED') {
      await this.assignBonusPointsOnCompletion(booking.userId, bookingId);
    }

    return {
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        startDateTime: updatedBooking.startDateTime,
        endDateTime: updatedBooking.endDateTime,
        notes: updatedBooking.notes ?? undefined,
      },
    };
  }

  private async assignBonusPointsOnCompletion(userId: string, bookingId: string): Promise<void> {
    try {
      // Verificar se já foi atribuído bônus para este agendamento
      const existingTransaction = await this.bonusTransactionRepository.findByBookingId(bookingId);
      if (existingTransaction) {
        // Bônus já foi atribuído, não fazer nada
        return;
      }

      // Buscar o agendamento completo
      const booking = await this.bookingsRepository.findById(bookingId);
      if (!booking) return;

      // Atribuir pontos por agendamento (BOOKING_POINTS)
      const bookingPoints = Math.floor((booking.totalAmount / 10) * POINTS_PER_10_REAIS);
      if (bookingPoints > 0) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + BONUS_EXPIRATION_MONTHS);

        await this.userBonusRepository.upsert({
          userId,
          type: 'BOOKING_POINTS',
          points: bookingPoints,
          expiresAt,
        });

        await this.bonusTransactionRepository.create({
          user: { connect: { id: userId } },
          booking: { connect: { id: bookingId } },
          type: 'BOOKING_POINTS',
          points: bookingPoints,
          description: `Pontos por agendamento concluído (ID: ${bookingId})`,
        });
      }

      // Verificar e atribuir pontos de fidelidade (LOYALTY)
      const totalCompletedBookings = await this.bookingsRepository.countByUserIdAndStatus(
        userId,
        'COMPLETED',
      );

      if (totalCompletedBookings >= LOYALTY_BOOKINGS_REQUIRED) {
        const loyaltyPoints =
          Math.floor(totalCompletedBookings / LOYALTY_BOOKINGS_REQUIRED) * LOYALTY_POINTS;

        // Verificar quantos pontos de fidelidade já existem
        const userBonus = await this.userBonusRepository.findByUserIdAndType(userId, 'LOYALTY');
        const currentLoyaltyPoints = userBonus?.points ?? 0;
        const newLoyaltyPoints =
          Math.floor(totalCompletedBookings / LOYALTY_BOOKINGS_REQUIRED) * LOYALTY_POINTS;

        if (newLoyaltyPoints > currentLoyaltyPoints) {
          const pointsToAdd = newLoyaltyPoints - currentLoyaltyPoints;
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + BONUS_EXPIRATION_MONTHS);

          await this.userBonusRepository.upsert({
            userId,
            type: 'LOYALTY',
            points: newLoyaltyPoints,
            expiresAt,
          });

          await this.bonusTransactionRepository.create({
            user: { connect: { id: userId } },
            type: 'LOYALTY',
            points: pointsToAdd,
            description: `Bônus de fidelidade: ${pointsToAdd} pontos`,
          });
        }
      }
    } catch (error) {
      // Log do erro mas não falha o agendamento
      console.error('Erro ao atribuir pontos de bônus:', error);
    }
  }
}
