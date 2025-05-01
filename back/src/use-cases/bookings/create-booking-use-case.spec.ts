/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateBookingUseCase } from './create-booking-use-case';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';

describe('CreateBookingUseCase', () => {
  const bookingsRepository = {
    findOverlappingBooking: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(undefined),
  };
  const usersRepository = {
    findById: vi.fn(),
  };

  const professionalsRepository = {
    findById: vi.fn(),
  };

  const servicesRepository = {
    findById: vi.fn(),
  };

  let sut: CreateBookingUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    sut = new CreateBookingUseCase(
      bookingsRepository as any,
      usersRepository as any,
      professionalsRepository as any,
      servicesRepository as any,
    );
  });

  it('deve criar um agendamento válido', async () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora depois

    usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    professionalsRepository.findById.mockResolvedValue({ id: 'pro-1' });

    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      duracao: 30,
      precoPadrao: 100,
    });

    bookingsRepository.findOverlappingBooking.mockResolvedValue(null);

    await sut.execute({
      userId: 'user-1',
      professionalId: 'pro-1',
      services: [{ serviceId: 'service-1' }],
      startDateTime: futureDate,
      notes: 'teste',
    });

    expect(bookingsRepository.create).toHaveBeenCalled();
    const createData = bookingsRepository.create.mock.calls[0][0];
    expect(createData.dataHoraInicio).toEqual(futureDate);
    expect(createData.items.create).toHaveLength(1);
    expect(createData.status).toBe('PENDENTE');
  });

  it('deve lançar erro se data for no passado', async () => {
    const pastDate = new Date(Date.now() - 60 * 1000);

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'service-1' }],
        startDateTime: pastDate,
      }),
    ).rejects.toBeInstanceOf(InvalidDateTimeError);
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    usersRepository.findById.mockResolvedValue(null);
    professionalsRepository.findById.mockResolvedValue({ id: 'pro-1' });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'service-1' }],
        startDateTime: new Date(Date.now() + 1000 * 60),
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('deve lançar erro se profissional não for encontrado', async () => {
    usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'service-1' }],
        startDateTime: new Date(Date.now() + 1000 * 60),
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('deve lançar erro se serviço não for encontrado', async () => {
    usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    professionalsRepository.findById.mockResolvedValue({ id: 'pro-1' });

    servicesRepository.findById.mockResolvedValue(null);

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'service-1' }],
        startDateTime: new Date(Date.now() + 1000 * 60),
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });

  it('deve lançar erro se a duração do serviço for inválida', async () => {
    usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    professionalsRepository.findById.mockResolvedValue({ id: 'pro-1' });

    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      duracao: 0,
      precoPadrao: 100,
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'service-1' }],
        startDateTime: new Date(Date.now() + 1000 * 60),
      }),
    ).rejects.toBeInstanceOf(InvalidDurationError);
  });

  it('deve lançar erro se houver conflito de horário', async () => {
    usersRepository.findById.mockResolvedValue({ id: 'user-1' });
    professionalsRepository.findById.mockResolvedValue({ id: 'pro-1' });

    servicesRepository.findById.mockResolvedValue({
      id: 'service-1',
      duracao: 30,
      precoPadrao: 100,
    });

    bookingsRepository.findOverlappingBooking.mockResolvedValue({
      id: 'conflict-booking',
    });

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        professionalId: 'pro-1',
        services: [{ serviceId: 'service-1' }],
        startDateTime: new Date(Date.now() + 1000 * 60),
      }),
    ).rejects.toBeInstanceOf(TimeSlotAlreadyBookedError);
  });
});
