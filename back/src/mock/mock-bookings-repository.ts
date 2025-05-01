import { vi } from 'vitest';
import {
  Booking,
  BookingItem,
  Professional,
  Status,
  User,
} from '@prisma/client';
import { createMockProfessionalsRepository } from './mock-professionals-repository';

type BookingWithRelations = Booking & {
  items: BookingItem[];
  profissional: Professional & {
    user: User;
  };
};

export const createMockBookingsRepository = () => {
  const createMockBookingItem = (
    overrides?: Partial<BookingItem>,
  ): BookingItem => ({
    id: 'item-1',
    bookingId: 'booking-1',
    serviceId: 'service-1',
    preco: 50,
    duracao: 60,
    ...overrides,
  });

  const createMockBooking = (overrides?: Partial<Booking>): Booking => ({
    id: 'booking-1',
    usuarioId: 'user-1',
    dataHoraInicio: new Date('2023-06-15T10:00:00'),
    dataHoraFim: new Date('2023-06-15T11:00:00'),
    status: 'CONFIRMADO' as Status,
    valorFinal: 50,
    observacoes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    canceledAt: null,
    confirmedAt: null,
    profissionalId: 'prof-1',
    ...overrides,
  });

  const { createMockProfessionalWithRelations } =
    createMockProfessionalsRepository();
  const profissional = createMockProfessionalWithRelations();

  const createMockBookingWithRelations = (
    overrides?: Partial<BookingWithRelations>,
  ): BookingWithRelations => ({
    ...createMockBooking(),
    items: [createMockBookingItem()],
    profissional,
    ...overrides,
  });

  const mockRepository = {
    create: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn().mockResolvedValue(createMockBookingWithRelations()),
    findOverlappingBooking: vi.fn().mockResolvedValue(null),
    findManyByProfessionalId: vi
      .fn()
      .mockResolvedValue([createMockBookingWithRelations()]),
    findManyByUserId: vi
      .fn()
      .mockResolvedValue([createMockBookingWithRelations()]),
    update: vi.fn().mockResolvedValue(createMockBookingWithRelations()),
    delete: vi.fn().mockResolvedValue(undefined),
    countActiveByServiceAndProfessional: vi.fn().mockResolvedValue(0),
    countByUserId: vi.fn().mockResolvedValue(1),
    countByProfessionalAndDate: vi.fn().mockResolvedValue(1),
    getEarningsByProfessionalAndDate: vi.fn().mockResolvedValue(100),
    countByProfessionalAndStatus: vi.fn().mockResolvedValue(1),
    getMonthlyEarnings: vi.fn().mockResolvedValue(1000),
    findNextAppointments: vi.fn().mockResolvedValue([
      {
        id: 'booking-1',
        dataHoraInicio: new Date('2023-06-15T10:00:00'),
        status: 'CONFIRMADO' as Status,
        user: { nome: 'John Doe' },
        items: [{ service: { nome: 'Corte de Cabelo' } }],
      },
    ]),
    findByProfessionalAndDate: vi.fn().mockResolvedValue([
      {
        id: 'booking-1',
        dataHoraInicio: new Date('2023-06-15T10:00:00'),
        dataHoraFim: new Date('2023-06-15T11:00:00'),
        status: 'CONFIRMADO',
        user: { nome: 'John Doe' },
        items: [{ service: { nome: 'Corte de Cabelo' } }],
      },
    ]),
  };

  return {
    mockRepository,
    createMockBookingItem,
    createMockBooking,
    createMockBookingWithRelations,
  };
};
