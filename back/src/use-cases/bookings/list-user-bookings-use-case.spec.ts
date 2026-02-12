import { describe, it, expect, beforeEach } from 'vitest';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import { InvalidPageRangeError } from '../errors/invalid-page-range-error';
import { UsuarioTentandoPegarInformacoesDeOutro } from '../errors/usuario-pegando-informacao-de-outro-usuario-error';
import { mockBooking } from '@/dtos/booking-dto';
import { ListBookingsUseCase } from './list-user-bookings-use-case';
import { createMockBookingsRepository } from '@/mock/mock-repositories';

describe('ListBookingsUseCase', () => {
  let useCase: ListBookingsUseCase;
  let mockBookingsRepository: ReturnType<typeof createMockBookingsRepository>;

  beforeEach(() => {
    mockBookingsRepository = createMockBookingsRepository();

    useCase = new ListBookingsUseCase(mockBookingsRepository);
  });

  it('deve retornar agendamentos com paginação', async () => {
    // Configurar mocks
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    // Executar
    const result = await useCase.execute({
      userId: 'user-123',
      page: 1,
      limit: 10,
    });

    // Verificar
    expect(result).toEqual({
      bookings: [mockBooking],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    expect(mockBookingsRepository.findManyByUserId).toHaveBeenCalledWith('user-123', {
      page: 1,
      limit: 10,
      sort: [{ field: 'startDateTime', order: 'asc' }],
      filters: {},
    });
  });

  it('deve aplicar filtros corretamente', async () => {
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    const result = await useCase.execute({
      userId: 'user-123',
      filters: {
        status: 'CONFIRMED',
        startDate,
        endDate,
      },
    });

    expect(result.bookings).toHaveLength(1);
    expect(mockBookingsRepository.findManyByUserId).toHaveBeenCalledWith('user-123', {
      page: 1,
      limit: 10,
      sort: [{ field: 'startDateTime', order: 'asc' }],
      filters: {
        status: 'CONFIRMED',
        startDate,
        endDate,
      },
    });
  });

  it('deve lançar erro quando página é maior que total de páginas', async () => {
    // Configurar para retornar 1 booking mas total de 10 registros
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(10);

    await expect(
      useCase.execute({
        userId: 'user-123',
        page: 2, // Inválido pois com limit=10 e total=10 só tem 1 página
        limit: 10,
      }),
    ).rejects.toThrow(InvalidPageRangeError);
  });

  it('deve lançar erro quando página é maior que total de registros', async () => {
    // Configurar para retornar 1 booking mas total de 10 registros
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(10);

    await expect(
      useCase.execute({
        userId: 'user-123',
        page: 2,
        limit: 10,
      }),
    ).rejects.toThrow(InvalidPageRangeError);
  });

  it('deve lançar erro quando não encontra agendamentos', async () => {
    // Configurar mocks para retornar array vazio e total zero
    mockBookingsRepository.findManyByUserId.mockResolvedValue([]);
    mockBookingsRepository.countByUserId.mockResolvedValue(0);

    await expect(
      useCase.execute({
        userId: 'user-123',
      }),
    ).rejects.toThrow(BookingNotFoundError);
  });

  it('deve lançar erro quando usuário tenta acessar agendamentos de outro', async () => {
    const wrongUserBooking = {
      ...mockBooking,
      userId: 'user-456', // ID diferente do solicitado
    };

    mockBookingsRepository.findManyByUserId.mockResolvedValue([wrongUserBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    await expect(
      useCase.execute({
        userId: 'user-123', // ID diferente do retornado
      }),
    ).rejects.toThrow(UsuarioTentandoPegarInformacoesDeOutro);
  });

  it('deve calcular corretamente o total de páginas', async () => {
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(25); // 25 registros no total

    const result = await useCase.execute({
      userId: 'user-123',
      limit: 10,
    });

    expect(result.totalPages).toBe(3); // 25/10 = 2.5 → arredonda para 3
  });

  it('deve usar valores padrão quando não fornecidos', async () => {
    mockBookingsRepository.findManyByUserId.mockResolvedValue([mockBooking]);
    mockBookingsRepository.countByUserId.mockResolvedValue(1);

    const result = await useCase.execute({
      userId: 'user-123',
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
