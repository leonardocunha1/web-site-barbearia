import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingNotFoundError } from '../errors/booking-not-found-error';
import {
  BookingsRepository,
  BookingWithRelations,
} from '@/repositories/bookings-repository';
import { ListBookingsUseCase } from './list-user-bookings-use-case';
import { toBookingDTO } from '@/dtos/booking-dto';

const mockBookings: BookingWithRelations[] = [
  {
    id: 'booking-1',
    usuarioId: 'user-1',
    confirmedAt: new Date(),
    observacoes: 'Teste de observação',
    dataHoraInicio: new Date(),
    dataHoraFim: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'CONFIRMADO',
    valorFinal: 100,
    canceledAt: null,
    profissionalId: 'pro-1',
    items: [],
    profissional: {
      id: 'pro-1',
      userId: 'prof-user-1',
      ativo: true,
      createdAt: new Date(),
      avatarUrl: null,
      documento: null,
      especialidade: 'Cabelo',
      updatedAt: new Date(),
      bio: '',
      user: {
        id: 'prof-user-1',
        nome: 'Prof Nome',
        email: 'prof@email.com',
        senha: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
        emailVerified: true,
        role: 'PROFISSIONAL',
        telefone: '123456789',
      },
    },
    user: {
      id: 'user-1',
      nome: 'User Nome',
      email: 'leo.fran@hotmail.com',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: true,
      telefone: '123456789',
      role: 'CLIENTE',
      senha: 'hashed-password',
    },
  },
];

describe('ListBookingsUseCase', () => {
  let bookingsRepository: BookingsRepository;
  let useCase: ListBookingsUseCase;

  beforeEach(() => {
    bookingsRepository = {
      findManyByUserId: vi.fn().mockResolvedValue(mockBookings),
      countByUserId: vi.fn().mockResolvedValue(1),
      create: vi.fn(),
      findById: vi.fn(),
      findOverlappingBooking: vi.fn(),
      findManyByProfessionalId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      countActiveByServiceAndProfessional: vi.fn(),
      countByProfessionalAndDate: vi.fn(),
      getEarningsByProfessionalAndDate: vi.fn(),
      countByProfessionalAndStatus: vi.fn(),
      getMonthlyEarnings: vi.fn(),
      findNextAppointments: vi.fn(),
      findByProfessionalAndDate: vi.fn(),
    } as unknown as BookingsRepository;

    useCase = new ListBookingsUseCase(bookingsRepository);
  });

  it('deve listar bookings com paginação e ordenação', async () => {
    const response = await useCase.execute({ userId: 'user-1' });

    const passarBookingParaDTO = mockBookings.map(toBookingDTO);

    expect(response.bookings).toEqual(passarBookingParaDTO);
    expect(response.total).toBe(1);
    expect(response.page).toBe(1);
    expect(response.limit).toBe(10);
    expect(response.totalPages).toBe(1);

    expect(bookingsRepository.findManyByUserId).toHaveBeenCalledWith('user-1', {
      page: 1,
      limit: 10,
      sort: [{ field: 'dataHoraInicio', order: 'asc' }],
      filters: {},
    });
    expect(bookingsRepository.countByUserId).toHaveBeenCalledWith('user-1', {});
  });

  it('deve lançar erro se não houver bookings para o usuário', async () => {
    vi.spyOn(bookingsRepository, 'findManyByUserId').mockResolvedValueOnce([]);

    await expect(() => useCase.execute({ userId: 'user-1' })).rejects.toThrow(
      BookingNotFoundError,
    );
  });
});
