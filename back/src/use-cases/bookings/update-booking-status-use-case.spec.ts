import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateBookingStatusUseCase } from './update-booking-status-use-case';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import { Status } from '@prisma/client';
import { createMockBookingsRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockBookingsRepository = BookingsRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('UpdateBookingStatusUseCase', () => {
  let useCase: UpdateBookingStatusUseCase;
  let mockBookingsRepository: MockBookingsRepository;

  beforeEach(() => {
    mockBookingsRepository = createMockBookingsRepository();

    useCase = new UpdateBookingStatusUseCase(
      mockBookingsRepository
    );
  });

  const mockBooking = {
    id: 'booking-123',
    profissionalId: 'pro-123',
    status: 'PENDENTE' as Status,
    dataHoraInicio: new Date('2023-01-01T10:00:00'),
    dataHoraFim: new Date('2023-01-01T11:00:00'),
    observacoes: 'Observação original',
    user: {
      id: 'user-123',
      nome: 'John Doe',
    },
    profissional: {
      id: 'pro-123',
      user: {
        id: 'pro-user-123',
        nome: 'Professional User',
      },
    },
    items: [
      {
        id: 'item-123',
        serviceProfessional: {
          id: 'sp-123',
          service: {
            id: 'service-123',
            nome: 'Service Name',
          },
        },
        preco: 100,
        duracao: 60,
      },
    ],
  };

  it('deve confirmar um agendamento pendente', async () => {
    // Configurar mocks
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);
    mockBookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: 'CONFIRMADO',
      confirmedAt: new Date(),
    });

    // Executar
    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: 'CONFIRMADO',
      profissionalId: 'pro-123',
    });

    // Verificar
    expect(result.booking.status).toBe('CONFIRMADO');
    expect(mockBookingsRepository.update).toHaveBeenCalledWith('booking-123', {
      status: 'CONFIRMADO',
      confirmedAt: expect.any(Date),
      observacoes: 'Observação original',
    });
  });

  it('deve cancelar um agendamento com motivo', async () => {
    // Configurar mocks
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);
    mockBookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: 'CANCELADO',
      canceledAt: new Date(),
      observacoes: 'Observação original\nMotivo do cancelamento: Motivo teste',
    });

    // Executar
    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: 'CANCELADO',
      reason: 'Motivo teste',
      profissionalId: 'pro-123',
    });

    // Verificar
    expect(result.booking.status).toBe('CANCELADO');
    expect(mockBookingsRepository.update).toHaveBeenCalledWith('booking-123', {
      status: 'CANCELADO',
      canceledAt: expect.any(Date),
      observacoes: 'Observação original\nMotivo do cancelamento: Motivo teste',
    });
  });

  it('deve lançar erro quando agendamento não existe', async () => {
    mockBookingsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CONFIRMADO',
        profissionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingNotFoundError);
  });

  it('deve lançar erro quando profissional não é o dono', async () => {
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CONFIRMADO',
        profissionalId: 'pro-456', // ID diferente
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve lançar erro quando tenta confirmar agendamento não pendente', async () => {
    mockBookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: 'CONFIRMADO',
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CONFIRMADO',
        profissionalId: 'pro-123',
      }),
    ).rejects.toThrow(InvalidBookingStatusError);
  });

  it('deve lançar erro quando tenta cancelar agendamento já cancelado', async () => {
    mockBookingsRepository.findById.mockResolvedValue({
      ...mockBooking,
      status: 'CANCELADO',
    });

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CANCELADO',
        profissionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve lançar erro quando motivo do cancelamento é muito longo', async () => {
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);

    await expect(
      useCase.execute({
        bookingId: 'booking-123',
        status: 'CANCELADO',
        reason: 'a'.repeat(501), // 501 caracteres
        profissionalId: 'pro-123',
      }),
    ).rejects.toThrow(BookingUpdateError);
  });

  it('deve manter observações originais sem motivo de cancelamento', async () => {
    mockBookingsRepository.findById.mockResolvedValue(mockBooking);
    mockBookingsRepository.update.mockResolvedValue({
      ...mockBooking,
      status: 'CANCELADO',
      canceledAt: new Date(),
    });

    const result = await useCase.execute({
      bookingId: 'booking-123',
      status: 'CANCELADO',
      profissionalId: 'pro-123',
    });

    expect(result.booking.observacoes).toBe('Observação original');
  });
});
