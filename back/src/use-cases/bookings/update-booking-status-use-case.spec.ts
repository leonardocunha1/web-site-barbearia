import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateBookingStatusUseCase } from './update-booking-status-use-case';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import { Status } from '@prisma/client';
import {
  createMockBookingsRepository,
  createMockUserBonusRepository,
  createMockBonusTransactionRepository,
} from '@/mock/mock-repositories';
import { mockBooking as mockBookingDTO } from '@/dtos/booking-dto';
import { MAX_BOOKING_CANCEL_REASON_LENGTH } from '@/consts/const';

const createMockRepos = () => ({
  bookingsRepository: createMockBookingsRepository(),
  userBonusRepository: createMockUserBonusRepository(),
  bonusTransactionRepository: createMockBonusTransactionRepository(),
});

describe('UpdateBookingStatusUseCase', () => {
  let useCase: UpdateBookingStatusUseCase;
  let mockRepos: ReturnType<typeof createMockRepos>;

  beforeEach(() => {
    mockRepos = createMockRepos();

    useCase = new UpdateBookingStatusUseCase(
      mockRepos.bookingsRepository,
      mockRepos.userBonusRepository,
      mockRepos.bonusTransactionRepository,
    );
  });

  const mockBooking = {
    ...mockBookingDTO,
    id: 'booking-123',
    userId: 'user-123',
    professionalId: 'pro-123',
    status: Status.PENDING,
    startDateTime: new Date('2023-01-01T10:00:00'),
    endDateTime: new Date('2023-01-01T11:00:00'),
    notes: 'Observação original',
    user: {
      id: 'user-123',
      name: 'John Doe',
    },
    professional: {
      id: 'pro-123',
      user: {
        id: 'pro-user-123',
        name: 'Professional User',
      },
    },
    items: [
      {
        id: 'item-123',
        serviceProfessional: {
          id: 'sp-123',
          service: {
            id: 'service-123',
            name: 'Service Name',
          },
        },
        price: 100,
        duration: 60,
      },
    ],
  };

  it('deve confirmar um agendamento pendente', async () => {
    // Configurar mocks
    mockRepos.bookingsRepository.findById.mockResolvedValue(mockBooking);
    mockRepos.bookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: Status.CONFIRMED,
      confirmedAt: new Date(),
    });

    // Executar
    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: Status.CONFIRMED,
      professionalId: 'pro-123',
    });

    // Verificar
    expect(result.booking.status).toBe(Status.CONFIRMED);
    expect(mockRepos.bookingsRepository.update).toHaveBeenCalledWith('booking-123', {
      status: Status.CONFIRMED,
      confirmedAt: expect.any(Date),
      notes: 'Observação original',
    });
  });

  it('deve cancelar um agendamento com motivo', async () => {
    // Configurar mocks
    mockRepos.bookingsRepository.findById.mockResolvedValue(mockBooking);
    mockRepos.bookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: Status.CANCELED,
      canceledAt: new Date(),
      notes: 'Observação original\nMotivo do cancelamento: Motivo teste',
    });

    // Executar
    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: Status.CANCELED,
      reason: 'Motivo teste',
      professionalId: 'pro-123',
    });

    // Verificar
    expect(result.booking.status).toBe(Status.CANCELED);
    expect(mockRepos.bookingsRepository.update).toHaveBeenCalledWith('booking-123', {
      status: Status.CANCELED,
      canceledAt: expect.any(Date),
      notes: 'Observação original\nMotivo do cancelamento: Motivo teste',
    });
  });

  it('deve concluir um agendamento confirmado', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: Status.CONFIRMED,
    });
    mockRepos.bookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: Status.COMPLETED,
    });

    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: Status.COMPLETED,
      professionalId: 'pro-123',
    });

    expect(result.booking.status).toBe(Status.COMPLETED);
    expect(mockRepos.bookingsRepository.update).toHaveBeenCalledWith('booking-123', {
      status: Status.COMPLETED,
    });
  });

  it('deve impedir conclusao de agendamento futuro', async () => {
    const futureEnd = new Date(Date.now() + 60 * 60 * 1000);
    mockRepos.bookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: Status.CONFIRMED,
      endDateTime: futureEnd,
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.COMPLETED,
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve lançar erro quando agendamento não existe', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.CONFIRMED,
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingNotFoundError);
  });

  it('deve lançar erro quando profissional não é o dono', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue(mockBooking);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.CONFIRMED,
        professionalId: 'pro-456', // ID diferente
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve lançar erro quando tenta confirmar agendamento não pendente', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: Status.CONFIRMED,
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.CONFIRMED,
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(InvalidBookingStatusError);
  });

  it('deve lançar erro quando tenta concluir agendamento pendente', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: Status.PENDING,
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.COMPLETED,
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(InvalidBookingStatusError);
  });

  it('deve lançar erro quando tenta cancelar agendamento concluído', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: Status.COMPLETED,
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.CANCELED,
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(InvalidBookingStatusError);
  });

  it('deve lançar erro quando tenta cancelar agendamento já cancelado', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: Status.CANCELED,
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.CANCELED,
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve lançar erro quando motivo do cancelamento é muito longo', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue(mockBooking);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: Status.CANCELED,
        reason: 'a'.repeat(MAX_BOOKING_CANCEL_REASON_LENGTH + 1),
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve manter observações originais sem motivo de cancelamento', async () => {
    mockRepos.bookingsRepository.findById.mockResolvedValue(mockBooking);
    mockRepos.bookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: Status.CANCELED,
      canceledAt: new Date(),
    });

    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: Status.CANCELED,
      professionalId: 'pro-123',
    });

    expect(result.booking.notes).toBe('Observação original');
  });
});
