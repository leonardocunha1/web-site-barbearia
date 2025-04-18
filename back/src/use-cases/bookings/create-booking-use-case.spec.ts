// src/use-cases/create-booking-use-case.spec.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { InMemoryServicesRepository } from '@/repositories/in-memory/in-memory-services-repository';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { ServiceNotFoundError } from '../errors/service-not-found-error';
import { InvalidDateTimeError } from '../errors/invalid-date-time-error';
import { InvalidDurationError } from '../errors/invalid-duration-error';
import { TimeSlotAlreadyBookedError } from '../errors/time-slot-already-booked-error';
import { CreateBookingUseCase } from './create-booking-use-case';

let bookingsRepository: InMemoryBookingsRepository;
let usersRepository: InMemoryUsersRepository;
let professionalsRepository: InMemoryProfessionalsRepository;
let servicesRepository: InMemoryServicesRepository;
let sut: CreateBookingUseCase;

// Helper para criar datas futuras
function getFutureDate(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

describe('Caso de Uso: Criar Agendamento', () => {
  beforeEach(() => {
    // Configura o tempo fixo para "now" ser 01/01/2023
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00'));

    bookingsRepository = new InMemoryBookingsRepository();
    usersRepository = new InMemoryUsersRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    servicesRepository = new InMemoryServicesRepository();
    sut = new CreateBookingUseCase(
      bookingsRepository,
      usersRepository,
      professionalsRepository,
      servicesRepository,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve ser possível criar um agendamento futuro', async () => {
    const user = await usersRepository.create({
      nome: 'João Silva',
      email: 'joao@example.com',
      senha: '123456',
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'professional-1' } },
      especialidade: 'Barbeiro',
      bio: null,
      avatarUrl: null,
      documento: null,
      registro: null,
      ativo: true,
      intervalosAgendamento: 30,
    });

    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 60,
    });

    const startDate = getFutureDate(1); // Amanhã

    const { booking } = await sut.execute({
      userId: user.id,
      professionalId: professional.id,
      serviceId: service.id,
      startDateTime: startDate,
    });

    expect(booking.id).toEqual(expect.any(String));
    expect(booking.status).toBe('PENDENTE');
  });

  it('não deve permitir agendamento com usuário inválido', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'professional-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
      intervalosAgendamento: 30,
      bio: null,
      avatarUrl: null,
      documento: null,
      registro: null,
    });

    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 60,
    });

    await expect(() =>
      sut.execute({
        userId: 'usuario-inexistente',
        professionalId: professional.id,
        serviceId: service.id,
        startDateTime: getFutureDate(1),
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('não deve permitir agendamento com profissional inválido', async () => {
    const user = await usersRepository.create({
      nome: 'Maria Souza',
      email: 'maria@example.com',
      senha: '123456',
    });

    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 60,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        professionalId: 'profissional-inexistente',
        serviceId: service.id,
        startDateTime: getFutureDate(1),
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('não deve permitir agendamento com serviço inválido', async () => {
    const user = await usersRepository.create({
      nome: 'Carlos Oliveira',
      email: 'carlos@example.com',
      senha: '123456',
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'professional-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
      intervalosAgendamento: 30,
      bio: null,
      avatarUrl: null,
      documento: null,
      registro: null,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        professionalId: professional.id,
        serviceId: 'servico-inexistente',
        startDateTime: getFutureDate(1),
      }),
    ).rejects.toBeInstanceOf(ServiceNotFoundError);
  });

  it('não deve permitir agendamento no passado', async () => {
    const user = await usersRepository.create({
      nome: 'Ana Santos',
      email: 'ana@example.com',
      senha: '123456',
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'professional-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
      intervalosAgendamento: 30,
      bio: null,
      avatarUrl: null,
      documento: null,
      registro: null,
    });

    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 60,
    });

    const pastDate = new Date('2022-12-31T10:00:00');

    await expect(() =>
      sut.execute({
        userId: user.id,
        professionalId: professional.id,
        serviceId: service.id,
        startDateTime: pastDate,
      }),
    ).rejects.toBeInstanceOf(InvalidDateTimeError);
  });

  it('não deve permitir agendamento com duração inválida', async () => {
    const user = await usersRepository.create({
      nome: 'Pedro Alves',
      email: 'pedro@example.com',
      senha: '123456',
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'professional-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
      intervalosAgendamento: 30,
      bio: null,
      avatarUrl: null,
      documento: null,
      registro: null,
    });

    const serviceInvalido = await servicesRepository.create({
      nome: 'Serviço Inválido',
      precoPadrao: 50,
      duracao: 0,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        professionalId: professional.id,
        serviceId: serviceInvalido.id,
        startDateTime: getFutureDate(1),
      }),
    ).rejects.toBeInstanceOf(InvalidDurationError);
  });

  it('não deve permitir agendamentos sobrepostos', async () => {
    const user = await usersRepository.create({
      nome: 'Fernanda Lima',
      email: 'fernanda@example.com',
      senha: '123456',
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'professional-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
      intervalosAgendamento: 30,
      bio: null,
      avatarUrl: null,
      documento: null,
      registro: null,
    });

    const service = await servicesRepository.create({
      nome: 'Corte de Cabelo',
      precoPadrao: 50,
      duracao: 60,
    });

    const startDate = getFutureDate(1);

    // Primeiro agendamento
    await sut.execute({
      userId: user.id,
      professionalId: professional.id,
      serviceId: service.id,
      startDateTime: startDate,
    });

    // Tentativa de agendamento conflitante (30 minutos depois)
    await expect(() =>
      sut.execute({
        userId: user.id,
        professionalId: professional.id,
        serviceId: service.id,
        startDateTime: new Date(startDate.getTime() + 30 * 60000),
      }),
    ).rejects.toBeInstanceOf(TimeSlotAlreadyBookedError);
  });

  it('deve calcular corretamente o horário final', async () => {
    const user = await usersRepository.create({
      nome: 'Ricardo Nunes',
      email: 'ricardo@example.com',
      senha: '123456',
    });

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'professional-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
      intervalosAgendamento: 30,
      bio: null,
      avatarUrl: null,
      documento: null,
      registro: null,
    });

    const service = await servicesRepository.create({
      nome: 'Corte e Barba',
      precoPadrao: 80,
      duracao: 90,
    });

    const startDate = getFutureDate(1);
    const { booking } = await sut.execute({
      userId: user.id,
      professionalId: professional.id,
      serviceId: service.id,
      startDateTime: startDate,
    });

    const expectedEndDate = new Date(startDate.getTime() + 90 * 60000);
    expect(booking.dataHoraFim).toEqual(expectedEndDate);
  });
});
