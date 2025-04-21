import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidBookingStatusError } from '../errors/invalid-booking-status-error';
import { BookingUpdateError } from '../errors/booking-update-error';
import { UpdateBookingStatusUseCase } from './update-booking-status-use-case';
import { addDays } from 'date-fns';

let bookingsRepository: InMemoryBookingsRepository;
let sut: UpdateBookingStatusUseCase;

// Utils
function getFutureDate(daysFromNow: number): Date {
  return addDays(new Date(), daysFromNow);
}

const baseBookingData = {
  dataHoraInicio: getFutureDate(1),
  dataHoraFim: getFutureDate(1),
  user: { connect: { id: 'user-1' } },
  profissional: { connect: { id: 'professional-1' } },
};

describe('Caso de Uso: Atualizar Status do Agendamento', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00'));

    bookingsRepository = new InMemoryBookingsRepository();
    sut = new UpdateBookingStatusUseCase(bookingsRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve confirmar um agendamento pendente', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });

    const { booking: updated } = await sut.execute({
      bookingId: booking.id,
      status: 'CONFIRMADO',
    });

    expect(updated.status).toBe('CONFIRMADO');
    expect(updated.id).toBe(booking.id);
  });

  it('deve cancelar um agendamento pendente com motivo', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });

    const { booking: updated } = await sut.execute({
      bookingId: booking.id,
      status: 'CANCELADO',
      reason: 'Cliente solicitou cancelamento',
    });

    expect(updated.status).toBe('CANCELADO');
    expect(updated.observacoes).toContain('Motivo do cancelamento');
  });

  it('não deve confirmar um agendamento já confirmado', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'CONFIRMADO',
    });

    console.log('booking.status:', booking.status);

    await expect(
      sut.execute({
        bookingId: booking.id,
        status: 'CONFIRMADO',
      }),
    ).rejects.toBeInstanceOf(InvalidBookingStatusError);
  });

  it('não deve confirmar um agendamento cancelado', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'CANCELADO',
    });

    await expect(
      sut.execute({
        bookingId: booking.id,
        status: 'CONFIRMADO',
      }),
    ).rejects.toBeInstanceOf(InvalidBookingStatusError);
  });

  it('não deve atualizar status de um agendamento inexistente', async () => {
    await expect(() =>
      sut.execute({
        bookingId: 'id-inexistente',
        status: 'CONFIRMADO',
      }),
    ).rejects.toBeInstanceOf(BookingNotFoundError);
  });

  it('não deve aceitar motivo de cancelamento com mais de 500 caracteres', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });

    const longReason = 'a'.repeat(501);

    await expect(() =>
      sut.execute({
        bookingId: booking.id,
        status: 'CANCELADO',
        reason: longReason,
      }),
    ).rejects.toBeInstanceOf(BookingUpdateError);
  });

  it('deve manter as observações originais ao confirmar', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
      observacoes: 'Precisa de tesoura especial',
    });

    const { booking: updated } = await sut.execute({
      bookingId: booking.id,
      status: 'CONFIRMADO',
    });

    expect(updated.observacoes).toBe('Precisa de tesoura especial');
  });

  it('deve adicionar o motivo do cancelamento às observações existentes', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
      observacoes: 'Cliente alérgico a fragrâncias',
    });

    const reason = 'Cliente viajará';

    const { booking: updated } = await sut.execute({
      bookingId: booking.id,
      status: 'CANCELADO',
      reason,
    });

    expect(updated.observacoes).toContain('Cliente alérgico');
    expect(updated.observacoes).toContain(reason);
    expect(updated.observacoes).toContain('Motivo do cancelamento');
  });

  it('deve definir `confirmedAt` ao confirmar', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });

    await sut.execute({
      bookingId: booking.id,
      status: 'CONFIRMADO',
    });

    const updated = await bookingsRepository.findById(booking.id);
    expect(updated?.confirmedAt).toBeInstanceOf(Date);
  });

  it('deve definir `canceledAt` ao cancelar', async () => {
    const booking = await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });

    await sut.execute({
      bookingId: booking.id,
      status: 'CANCELADO',
    });

    const updated = await bookingsRepository.findById(booking.id);
    expect(updated?.canceledAt).toBeInstanceOf(Date);
  });
});
