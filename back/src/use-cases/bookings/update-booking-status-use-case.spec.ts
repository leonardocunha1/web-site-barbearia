import { UpdateBookingStatusUseCase } from './update-booking-status-use-case';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import { Status } from '@prisma/client';
import { it, expect, vi, beforeEach, describe } from 'vitest';

const mockBooking = {
  id: 'booking-id',
  status: 'PENDENTE' as Status,
  dataHoraInicio: new Date('2025-01-01T10:00:00'),
  dataHoraFim: new Date('2025-01-01T11:00:00'),
  observacoes: 'Agendamento original',
  profissionalId: 'profissional-id',
};

const bookingsRepository = {
  findById: vi.fn(),
  update: vi.fn(),
};

let useCase: UpdateBookingStatusUseCase;

describe('UpdateBookingStatusUseCase', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useCase = new UpdateBookingStatusUseCase(bookingsRepository as any);
    vi.clearAllMocks();
  });

  it('deve confirmar um agendamento com status PENDENTE', async () => {
    bookingsRepository.findById.mockResolvedValueOnce(mockBooking);
    bookingsRepository.update.mockResolvedValueOnce({
      ...mockBooking,
      status: 'CONFIRMADO',
      confirmedAt: new Date(),
    });

    const response = await useCase.execute({
      bookingId: 'booking-id',
      status: 'CONFIRMADO',
      profissionalId: 'profissional-id',
    });

    expect(response.booking.status).toBe('CONFIRMADO');
    expect(bookingsRepository.update).toHaveBeenCalledWith(
      'booking-id',
      expect.objectContaining({
        status: 'CONFIRMADO',
        confirmedAt: expect.any(Date),
      }),
    );
  });

  it('deve lançar erro se tentar confirmar um agendamento que não está PENDENTE', async () => {
    bookingsRepository.findById.mockResolvedValueOnce({
      ...mockBooking,
      status: 'CANCELADO',
    });

    await expect(() =>
      useCase.execute({
        bookingId: 'booking-id',
        status: 'CONFIRMADO',
        profissionalId: 'profissional-id',
      }),
    ).rejects.toBeInstanceOf(InvalidBookingStatusError);
  });

  it('deve cancelar um agendamento com motivo e adicionar às observações', async () => {
    bookingsRepository.findById.mockResolvedValueOnce(mockBooking);
    bookingsRepository.update.mockResolvedValueOnce({
      ...mockBooking,
      status: 'CANCELADO',
      canceledAt: new Date(),
      observacoes:
        'Agendamento original\nMotivo do cancelamento: Cliente desistiu',
    });

    const response = await useCase.execute({
      bookingId: 'booking-id',
      status: 'CANCELADO',
      reason: 'Cliente desistiu',
      profissionalId: 'profissional-id',
    });

    expect(response.booking.status).toBe('CANCELADO');
    expect(response.booking.observacoes).toContain(
      'Motivo do cancelamento: Cliente desistiu',
    );
    expect(bookingsRepository.update).toHaveBeenCalledWith(
      'booking-id',
      expect.objectContaining({
        status: 'CANCELADO',
        canceledAt: expect.any(Date),
        observacoes: expect.stringContaining(
          'Motivo do cancelamento: Cliente desistiu',
        ),
      }),
    );
  });

  it('deve lançar erro se agendamento já estiver cancelado', async () => {
    bookingsRepository.findById.mockResolvedValueOnce({
      ...mockBooking,
      status: 'CANCELADO',
    });

    await expect(() =>
      useCase.execute({
        bookingId: 'booking-id',
        status: 'CANCELADO',
        profissionalId: 'profissional-id',
      }),
    ).rejects.toBeInstanceOf(BookingUpdateError);
  });

  it('deve lançar erro se motivo do cancelamento for muito longo', async () => {
    const longReason = 'x'.repeat(501);
    bookingsRepository.findById.mockResolvedValueOnce(mockBooking);

    await expect(() =>
      useCase.execute({
        bookingId: 'booking-id',
        status: 'CANCELADO',
        reason: longReason,
        profissionalId: 'profissional-id',
      }),
    ).rejects.toThrow('Motivo do cancelamento muito longo');
  });

  it('deve lançar BookingNotFoundError se agendamento não for encontrado', async () => {
    bookingsRepository.findById.mockResolvedValueOnce(null);

    await expect(() =>
      useCase.execute({
        bookingId: 'non-existent-id',
        status: 'CONFIRMADO',
        profissionalId: 'profissional-id',
      }),
    ).rejects.toBeInstanceOf(BookingNotFoundError);
  });

  it('deve lançar BookingUpdateError se falhar ao atualizar o agendamento', async () => {
    bookingsRepository.findById.mockResolvedValueOnce(mockBooking);
    bookingsRepository.update.mockResolvedValueOnce(null);

    await expect(() =>
      useCase.execute({
        bookingId: 'booking-id',
        status: 'CANCELADO',
        reason: 'Cliente desistiu',
        profissionalId: 'profissional-id',
      }),
    ).rejects.toBeInstanceOf(BookingUpdateError);
  });

  it('deve lançar erro se profissional não for o dono do agendamento', async () => {
    bookingsRepository.findById.mockResolvedValueOnce(mockBooking);

    await expect(() =>
      useCase.execute({
        bookingId: 'booking-id',
        status: 'CONFIRMADO',
        profissionalId: 'outro-profissional-id',
      }),
    ).rejects.toBeInstanceOf(BookingUpdateError);
  });
});
