import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateBookingStatusUseCase } from './update-booking-status-use-case';
import { IBookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import { Status } from '@prisma/client';
import { createMockBookingsRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockBookingsRepository = IBookingsRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('UpdateBookingStatusUseCase', () => {
  let useCase: UpdateBookingStatusUseCase;
  let mockBookingsRepository: MockBookingsRepository;

  beforeEach(() => {
    mockBookingsRepository = createMockBookingsRepository();

    useCase = new UpdateBookingStatusUseCase(mockBookingsRepository);
  });

  const mockBooking = {
    id: 'booking-123',
    professionalId: 'pro-123',
    status: 'PENDING' as Status,
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
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);
    mockBookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    });

    // Executar
    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: 'CONFIRMED',
      professionalId: 'pro-123',
    });

    // Verificar
    expect(result.booking.status).toBe('CONFIRMED');
    expect(mockBookingsRepository.update).toHaveBeenCalledWith('booking-123', {
      status: 'CONFIRMED',
      confirmedAt: expect.any(Date),
      notes: 'Observação original',
    });
  });

  it('deve cancelar um agendamento com motivo', async () => {
    // Configurar mocks
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);
    mockBookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: 'CANCELED',
      canceledAt: new Date(),
      notes: 'Observação original\nMotivo do cancelamento: Motivo teste',
    });

    // Executar
    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: 'CANCELED',
      reason: 'Motivo teste',
      professionalId: 'pro-123',
    });

    // Verificar
    expect(result.booking.status).toBe('CANCELED');
    expect(mockBookingsRepository.update).toHaveBeenCalledWith('booking-123', {
      status: 'CANCELED',
      canceledAt: expect.any(Date),
      notes: 'Observação original\nMotivo do cancelamento: Motivo teste',
    });
  });

  it('deve lançar erro quando agendamento não existe', async () => {
    mockBookingsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CONFIRMED',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingNotFoundError);
  });

  it('deve lançar erro quando profissional não é o dono', async () => {
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CONFIRMED',
        professionalId: 'pro-456', // ID diferente
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve lançar erro quando tenta confirmar agendamento não pendente', async () => {
    mockBookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: 'CONFIRMED',
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CONFIRMED',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(InvalidBookingStatusError);
  });

  it('deve lançar erro quando tenta cancelar agendamento já cancelado', async () => {
    mockBookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: 'CANCELED',
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CANCELED',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve lançar erro quando motivo do cancelamento é muito longo', async () => {
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CANCELED',
        reason: 'a'.repeat(501), // 501 caracteres
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve manter observações originais sem motivo de cancelamento', async () => {
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);
    mockBookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: 'CANCELED',
      canceledAt: new Date(),
    });

    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: 'CANCELED',
      professionalId: 'pro-123',
    });

    expect(result.booking.notes).toBe('Observação original');
  });
});
