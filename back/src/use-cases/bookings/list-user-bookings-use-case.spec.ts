import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { ListBookingsUseCase } from './list-user-bookings-use-case';

let bookingsRepository: InMemoryBookingsRepository;
let sut: ListBookingsUseCase;

// Dados base para reserva
const baseBookingData = {
  dataHoraInicio: new Date(),
  dataHoraFim: new Date(),
  user: { connect: { id: 'user-1' } },
  profissional: { connect: { id: 'professional-1' } },
};

describe('Caso de Uso: Listar Reservas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00'));

    bookingsRepository = new InMemoryBookingsRepository();
    sut = new ListBookingsUseCase(bookingsRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar reservas paginadas com sucesso', async () => {
    await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });
    await bookingsRepository.create({
      ...baseBookingData,
      status: 'CONCLUIDO',
    });

    const { bookings, total, totalPages, page, limit } = await sut.execute({
      userId: 'user-1',
      page: 1,
      limit: 10,
    });

    expect(bookings).toHaveLength(2);
    expect(total).toBe(2);
    expect(totalPages).toBe(1);
    expect(page).toBe(1);
    expect(limit).toBe(10);
  });

  it('deve lançar um erro quando não houver reservas para o usuário', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-2',
      }),
    ).rejects.toBeInstanceOf(BookingNotFoundError);
  });

  it('deve calcular corretamente o total de páginas', async () => {
    await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });
    await bookingsRepository.create({
      ...baseBookingData,
      status: 'CONCLUIDO',
    });

    const { totalPages } = await sut.execute({
      userId: 'user-1',
      page: 1,
      limit: 1,
    });

    expect(totalPages).toBe(2); // Com 2 reservas e limit=1, devem ser 2 páginas
  });

  it('deve retornar a página correta de resultados', async () => {
    await bookingsRepository.create({
      ...baseBookingData,
      status: 'PENDENTE',
    });
    await bookingsRepository.create({
      ...baseBookingData,
      status: 'CONCLUIDO',
    });

    const { bookings, page } = await sut.execute({
      userId: 'user-1',
      page: 2,
      limit: 1,
    });

    expect(bookings).toHaveLength(1);
    expect(page).toBe(2);
  });

  it('deve lançar um erro se o usuário tentar acessar reservas de um ID inexistente', async () => {
    await expect(() =>
      sut.execute({
        userId: 'id-inexistente',
        page: 1,
        limit: 10,
      }),
    ).rejects.toBeInstanceOf(BookingNotFoundError);
  });
});
