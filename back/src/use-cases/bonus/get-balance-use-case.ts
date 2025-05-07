import { UserBonusRepository } from '@/repositories/user-bonus-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { VALUE_PER_POINT } from '@/consts/const';

interface GetBalanceRequest {
  userId: string;
}

interface GetBalanceResponse {
  points: {
    bookingPoints: number;
    loyaltyPoints: number;
    totalPoints: number;
  };
  monetaryValue: {
    bookingValue: number;
    loyaltyValue: number;
    totalValue: number;
  };
  expiresAt?: Date; // Adicionado para mostrar quando os pontos expiram
}

export class GetBalanceUseCase {
  constructor(
    private userBonusRepository: UserBonusRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(request: GetBalanceRequest): Promise<GetBalanceResponse> {
    const { userId } = request;
    const now = new Date();

    // Verifica se o usuário existe
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    // Obtém os pontos válidos (não expirados)
    const { points: bookingPoints, expiresAt: bookingExpiresAt } =
      await this.userBonusRepository.getValidPointsWithExpiration(
        userId,
        'BOOKING_POINTS',
        now,
      );

    const { points: loyaltyPoints, expiresAt: loyaltyExpiresAt } =
      await this.userBonusRepository.getValidPointsWithExpiration(
        userId,
        'LOYALTY',
        now,
      );

    const totalPoints = bookingPoints + loyaltyPoints;

    // Calcula os valores em reais
    const bookingValue = this.calculateMonetaryValue(bookingPoints);
    const loyaltyValue = this.calculateMonetaryValue(loyaltyPoints);
    const totalValue = bookingValue + loyaltyValue;

    // Determina a próxima data de expiração (a mais recente)
    const nextExpiration = this.getNearestExpirationDate([
      bookingExpiresAt,
      loyaltyExpiresAt,
    ]);

    return {
      points: {
        bookingPoints,
        loyaltyPoints,
        totalPoints,
      },
      monetaryValue: {
        bookingValue,
        loyaltyValue,
        totalValue,
      },
      expiresAt: nextExpiration, // Mostra quando os próximos pontos irão expirar
    };
  }

  private calculateMonetaryValue(points: number): number {
    return points * VALUE_PER_POINT;
  }

  private getNearestExpirationDate(
    dates: (Date | null | undefined)[],
  ): Date | undefined {
    const validDates = dates.filter((d): d is Date => d instanceof Date);
    if (validDates.length === 0) return undefined;

    return new Date(Math.min(...validDates.map((date) => date.getTime())));
  }
}
