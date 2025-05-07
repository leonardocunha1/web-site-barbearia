import { UserBonusRepository } from '@/repositories/user-bonus-repository';
import { BonusTransactionRepository } from '@/repositories/bonus-transaction-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { InvalidBonusAssignmentError } from '../errors/invalid-bonus-assignment-error';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BonusAlreadyAssignedError } from '../errors/bonus-already-assigned-error';
import {
  BONUS_EXPIRATION_MONTHS,
  LOYALTY_BOOKINGS_REQUIRED,
  LOYALTY_POINTS,
  POINTS_PER_10_REAIS,
} from '@/consts/const';

interface AssignBonusRequest {
  userId: string;
  bookingId?: string;
  type: 'BOOKING_POINTS' | 'LOYALTY';
  description?: string;
}

export class AssignBonusUseCase {
  constructor(
    private userBonusRepository: UserBonusRepository,
    private bonusTransactionRepository: BonusTransactionRepository,
    private usersRepository: UsersRepository,
    private bookingsRepository: BookingsRepository,
  ) {}

  async execute(request: AssignBonusRequest): Promise<void> {
    const { userId, bookingId, type, description } = request;

    // 1. Validação básica do usuário
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    let calculatedPoints = 0;

    // 2. Lógica para pontos por agendamento
    if (type === 'BOOKING_POINTS') {
      calculatedPoints = await this.handleBookingPoints(userId, bookingId!);
    }

    // 3. Lógica para pontos de fidelidade
    if (type === 'LOYALTY') {
      calculatedPoints = await this.handleLoyaltyPoints(userId);
    }

    // 4. Atualiza o saldo de pontos
    const expiresAt = this.calculateExactExpirationDate();

    await this.userBonusRepository.upsert({
      user: { connect: { id: userId } },
      type,
      points: calculatedPoints,
      expiresAt,
    });

    // 5. Registra a transação
    await this.bonusTransactionRepository.create({
      user: { connect: { id: userId } },
      booking: { connect: { id: bookingId } },

      type,
      points: calculatedPoints,
      description:
        description ||
        this.generateBonusDescription(type, calculatedPoints, bookingId),
    });
  }

  private async handleBookingPoints(
    userId: string,
    bookingId: string,
  ): Promise<number> {
    if (!bookingId) {
      throw new InvalidBonusAssignmentError(
        'bookingId é obrigatório para BOOKING_POINTS',
      );
    }

    const booking = await this.bookingsRepository.findById(bookingId);
    if (!booking) {
      throw new BookingNotFoundError();
    }

    if (booking.usuarioId !== userId) {
      throw new InvalidBonusAssignmentError(
        'Agendamento não pertence ao usuário',
      );
    }

    if (booking.status !== 'CONCLUIDO') {
      throw new InvalidBookingStatusError(booking.status, 'CONCLUIDO');
    }

    const existingTransaction =
      await this.bonusTransactionRepository.findByBookingId(bookingId);
    if (existingTransaction) {
      throw new BonusAlreadyAssignedError();
    }

    if (booking.valorFinal === null || booking.valorFinal === undefined) {
      throw new InvalidBonusAssignmentError(
        'Agendamento com valorFinal inválido para gerar pontos',
      );
    }

    const points = Math.floor((booking.valorFinal / 10) * POINTS_PER_10_REAIS);
    if (points <= 0) {
      throw new InvalidBonusAssignmentError(
        'Agendamento com valor insuficiente para gerar pontos',
      );
    }

    return points;
  }

  private async handleLoyaltyPoints(userId: string): Promise<number> {
    const totalCompletedBookings =
      await this.bookingsRepository.countByUserIdAndStatus(userId, 'CONCLUIDO');

    if (totalCompletedBookings < LOYALTY_BOOKINGS_REQUIRED) {
      throw new InvalidBonusAssignmentError(
        `Requisitos de fidelidade não atendidos (mínimo ${LOYALTY_BOOKINGS_REQUIRED} agendamentos concluídos)`,
      );
    }

    return (
      Math.floor(totalCompletedBookings / LOYALTY_BOOKINGS_REQUIRED) *
      LOYALTY_POINTS
    );
  }

  private generateBonusDescription(
    type: string,
    points: number,
    bookingId?: string,
  ): string {
    return type === 'BOOKING_POINTS'
      ? `Pontos por agendamento concluído (ID: ${bookingId})`
      : `Bônus de fidelidade: ${points} pontos`;
  }

  private calculateExactExpirationDate(): Date {
    const now = new Date();
    const expirationDate = new Date(now);

    // Adiciona exatamente 6 meses mantendo o mesmo dia do mês
    expirationDate.setFullYear(
      now.getFullYear(),
      now.getMonth() + BONUS_EXPIRATION_MONTHS,
      now.getDate(),
    );

    if (expirationDate.getDate() !== now.getDate()) {
      expirationDate.setDate(0); // Vai para o último dia do mês anterior
    }

    return expirationDate;
  }
}
