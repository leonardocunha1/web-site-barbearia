import { BookingsRepository } from '@/repositories/bookings-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ServiceProfessionalRepository } from '@/repositories/service-professional-repository';
import { UserBonusRepository } from '@/repositories/user-bonus-repository';
import { BonusRedemptionRepository } from '@/repositories/bonus-redemption-repository';
import { Booking } from '@prisma/client';
import { InvalidDateTimeError } from '@/use-cases/errors/invalid-date-time-error';
import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error';
import { ServiceProfessionalNotFoundError } from '@/use-cases/errors/service-professional-not-found-error';
import { InvalidDurationError } from '@/use-cases/errors/invalid-duration-error';
import { TimeSlotAlreadyBookedError } from '@/use-cases/errors/time-slot-already-booked-error';
import { InsufficientBonusPointsError } from '@/use-cases/errors/insufficient-bonus-points-error';
import { InvalidBonusRedemptionError } from '@/use-cases/errors/invalid-bonus-redemption-error';
import {
  MIN_BOOKING_VALUE_AFTER_DISCOUNT,
  MIN_POINTS_TO_REDEEM,
  VALUE_PER_POINT,
} from '@/consts/const';

export interface BookingRequest {
  userId: string;
  professionalId: string;
  services: Array<{ serviceId: string }>;
  startDateTime: Date;
  notes?: string;
  useBonusPoints?: boolean;
}

export class CreateBookingUseCase {
  constructor(
    private bookingsRepository: BookingsRepository,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private serviceProfessionalRepository: ServiceProfessionalRepository,
    private userBonusRepository: UserBonusRepository,
    private bonusRedemptionRepository: BonusRedemptionRepository,
  ) {}

  async execute(request: BookingRequest): Promise<Booking> {
    // 1. Validação básica da data/hora
    const now = new Date();
    if (request.startDateTime < now) {
      throw new InvalidDateTimeError();
    }

    // 2. Verifica existência do usuário e profissional
    const [user, professional] = await Promise.all([
      this.usersRepository.findById(request.userId),
      this.professionalsRepository.findById(request.professionalId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (!professional) throw new ProfessionalNotFoundError();

    // 3. Valida serviços e calcula duração total
    const serviceProfessionals = await Promise.all(
      request.services.map(async ({ serviceId }) => {
        const sp =
          await this.serviceProfessionalRepository.findByServiceAndProfessional(
            serviceId,
            request.professionalId,
          );

        if (!sp) throw new ServiceProfessionalNotFoundError();
        if (sp.duracao <= 0) throw new InvalidDurationError();

        return sp;
      }),
    );

    const totalDuration = serviceProfessionals.reduce(
      (sum, sp) => sum + sp.duracao,
      0,
    );
    if (totalDuration <= 0) throw new InvalidDurationError();

    // 4. Verifica conflitos de agendamento
    const endDateTime = new Date(
      request.startDateTime.getTime() + totalDuration * 60000,
    );

    const conflictingBooking =
      await this.bookingsRepository.findOverlappingBooking(
        request.professionalId,
        request.startDateTime,
        endDateTime,
      );
    if (conflictingBooking) throw new TimeSlotAlreadyBookedError();

    // 5. Calcula valor total
    const valorTotal = serviceProfessionals.reduce(
      (sum, sp) => sum + sp.preco,
      0,
    );

    // 6. Lógica de aplicação de bônus (CORRIGIDA)
    let valorFinal = valorTotal;
    let pontosUsados = 0;
    let descontoAplicadoReal = 0;

    if (request.useBonusPoints) {
      if (valorTotal <= 0) {
        throw new InvalidBonusRedemptionError(); // Não se pode aplicar bônus em serviço gratuito
      }

      const { points: availablePoints } =
        await this.userBonusRepository.getValidPointsWithExpiration(
          request.userId,
          'BOOKING_POINTS', // Considerar se este é o tipo de bônus correto para resgate
          new Date(),
        );

      if (availablePoints < MIN_POINTS_TO_REDEEM) {
        throw new InsufficientBonusPointsError();
      }

      // Calcula o desconto máximo que pode ser dado, respeitando o valor mínimo do agendamento
      const maxPossibleDiscountValue =
        valorTotal - MIN_BOOKING_VALUE_AFTER_DISCOUNT;

      // Calcula quantos pontos seriam necessários para cobrir esse desconto máximo.
      // Usamos Math.ceil porque se, por exemplo, 199.98 pontos forem necessários,
      // o usuário deve gastar 200 pontos inteiros.
      const pointsNeededForMaxDiscount = Math.ceil(
        maxPossibleDiscountValue / VALUE_PER_POINT,
      );

      // Calcula o valor de desconto que os pontos disponíveis podem oferecer
      const discountValueFromAvailablePoints =
        availablePoints * VALUE_PER_POINT;

      // O desconto real a ser aplicado é o menor entre:
      // 1. O desconto que os pontos disponíveis podem dar (discountValueFromAvailablePoints)
      // 2. O desconto máximo possível para atingir o valor mínimo do agendamento (maxPossibleDiscountValue)
      descontoAplicadoReal = Math.min(
        discountValueFromAvailablePoints,
        maxPossibleDiscountValue,
      );

      // Ajusta os pontos a serem efetivamente consumidos
      if (
        availablePoints >= pointsNeededForMaxDiscount &&
        maxPossibleDiscountValue > 0
      ) {
        // Se o usuário tem pontos suficientes para o desconto máximo (que leva ao valor mínimo do booking)
        // e há de fato um desconto a ser aplicado.
        pontosUsados = pointsNeededForMaxDiscount;
      } else {
        // Caso contrário, usa os pontos disponíveis (ou o equivalente ao desconto que eles podem dar)
        // Isso cobre o caso onde os pontos disponíveis são menores que os necessários para o desconto máximo,
        // ou o caso onde o desconto máximo é zero ou negativo (embora `valorTotal <= 0` já trate parte disso).
        pontosUsados = Math.floor(descontoAplicadoReal / VALUE_PER_POINT);
        // Se após o Math.min, o descontoAplicadoReal for menor que o valor dos availablePoints,
        // recalculamos os pontos usados para refletir o descontoAplicadoReal.
        // Ex: availablePoints = 300 (R$150), maxPossibleDiscountValue = R$50.
        // descontoAplicadoReal = R$50. pontosUsados = Math.floor(50 / 0.5) = 100.
      }

      // Garante que não usamos mais pontos do que o disponível.
      // Esta linha é uma segurança adicional, a lógica anterior deve tender a respeitar availablePoints.
      pontosUsados = Math.min(pontosUsados, availablePoints);

      // Recalcula o desconto aplicado com base nos pontos que serão efetivamente usados, para garantir consistência.
      descontoAplicadoReal = pontosUsados * VALUE_PER_POINT;
      // Limita novamente pelo desconto máximo possível, caso o arredondamento de pontos tenha alterado o valor.
      descontoAplicadoReal = Math.min(
        descontoAplicadoReal,
        maxPossibleDiscountValue,
      );

      // Ajusta o valor final do agendamento
      valorFinal = valorTotal - descontoAplicadoReal;
      // Garante que o valor final não seja menor que o mínimo permitido.
      valorFinal = Math.max(valorFinal, MIN_BOOKING_VALUE_AFTER_DISCOUNT);
      // Se valorTotal já for igual ou menor que MIN_BOOKING_VALUE_AFTER_DISCOUNT, e useBonusPoints=true,
      // o descontoAplicadoReal será 0, pontosUsados 0, valorFinal = valorTotal.
      // A exceção InvalidBonusRedemptionError no início trata valorTotal <= 0.
      // Se valorTotal > 0 mas valorTotal <= MIN_BOOKING_VALUE_AFTER_DISCOUNT, maxPossibleDiscountValue <=0.
      // Nesse caso, descontoAplicadoReal será 0, pontosUsados 0.

      // Consome pontos se efetivamente utilizados
      if (pontosUsados > 0) {
        await this.userBonusRepository.consumePoints(
          request.userId,
          pontosUsados,
        );
      }
    }

    // 7. Cria o agendamento
    const booking = await this.bookingsRepository.create({
      dataHoraInicio: request.startDateTime,
      dataHoraFim: endDateTime,
      observacoes: request.notes,
      user: { connect: { id: request.userId } },
      profissional: { connect: { id: request.professionalId } },
      status: 'PENDENTE',
      valorFinal: parseFloat(valorFinal.toFixed(2)),
      pontosUtilizados: pontosUsados,
      items: {
        create: serviceProfessionals.map((sp) => ({
          serviceProfessionalId: sp.id,
          preco: sp.preco,
          nome: sp.service.nome,
          duracao: sp.duracao,
          serviceId: sp.service.id,
        })),
      },
    });

    // 8. Registra o resgate de bônus (se aplicável)
    if (pontosUsados > 0 && descontoAplicadoReal > 0) {
      await this.bonusRedemptionRepository.create({
        user: { connect: { id: request.userId } },
        booking: { connect: { id: booking.id } },
        pointsUsed: pontosUsados,
        discount: parseFloat(descontoAplicadoReal.toFixed(2)),
      });
    }

    return booking;
  }
}
