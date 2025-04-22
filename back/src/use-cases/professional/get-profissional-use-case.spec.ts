import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { InMemoryBookingsRepository } from '@/repositories/in-memory/in-memory-bookings-repository';
import { GetProfessionalDashboardUseCase } from './get-profissional-use-case';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';

let professionalsRepository: InMemoryProfessionalsRepository;
let bookingsRepository: InMemoryBookingsRepository;
let sut: GetProfessionalDashboardUseCase;

vi.mock('@/repositories/bookings-repository');
vi.mock('@/repositories/professionals-repository');

describe('Caso de Uso: Obter Dashboard do Profissional', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-06-15T12:00:00')); // Uma quinta-feira

    professionalsRepository = new InMemoryProfessionalsRepository();
    bookingsRepository = new InMemoryBookingsRepository();
    sut = new GetProfessionalDashboardUseCase(
      professionalsRepository,
      bookingsRepository,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar a estrutura correta do dashboard', async () => {
    // Mock de findNextAppointments para retornar agendamentos futuros
    vi.spyOn(bookingsRepository, 'findNextAppointments').mockResolvedValue([
      {
        id: 'booking-id-1',
        dataHoraInicio: new Date(),
        user: { nome: 'Cliente Teste' },
        items: [{ service: { nome: 'Corte de Cabelo' } }],
        status: 'CONFIRMADO',
      },
    ]);

    // Mock das outras funções do repositório
    vi.spyOn(
      bookingsRepository,
      'countByProfessionalAndDate',
    ).mockResolvedValue(5);
    vi.spyOn(
      bookingsRepository,
      'getEarningsByProfessionalAndDate',
    ).mockResolvedValue(100);
    vi.spyOn(
      bookingsRepository,
      'countByProfessionalAndStatus',
    ).mockResolvedValue(2);

    // Mock do repositório de profissionais
    vi.spyOn(professionalsRepository, 'findByProfessionalId').mockResolvedValue(
      {
        id: 'prof-id',
        especialidade: 'Barbeiro',
        avatarUrl: null,
        user: {
          id: 'user-id',
          nome: 'João Barber',
          email: 'teste@teste.com',
          senha: 'hashed-password',
          role: 'PROFISSIONAL',
          telefone: '11999999999',
          emailVerified: false,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ativo: true,
        bio: null,
        documento: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-id',
      },
    );

    const dashboard = await sut.execute('prof-id', {
      range: 'custom',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-06-30'),
    });

    // Expectativa
    expect(dashboard).toEqual({
      professional: {
        name: 'João Barber',
        specialty: 'Barbeiro',
        avatarUrl: null,
      },
      metrics: {
        appointments: 5,
        earnings: 100,
        canceled: 2,
        completed: 2,
      },
      nextAppointments: [
        {
          id: 'booking-id-1',
          date: expect.any(Date),
          clientName: 'Cliente Teste',
          service: 'Corte de Cabelo',
          status: 'CONFIRMADO',
        },
      ],
    });
  });

  it('deve retornar o dashboard do profissional com métricas e próximos agendamentos', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Cria agendamentos para diferentes status e datas
    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-15T10:00:00'), // Hoje - CONCLUIDO
      dataHoraFim: new Date('2023-06-15T11:00:00'),
      status: 'CONCLUIDO',
      valorFinal: 50,
      user: { connect: { id: 'client-1' } },
      profissional: { connect: { id: professional.id } },
    });

    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-15T14:00:00'), // Hoje - CANCELADO
      dataHoraFim: new Date('2023-06-15T15:00:00'),
      status: 'CANCELADO',
      valorFinal: null,
      user: { connect: { id: 'client-2' } },
      profissional: { connect: { id: professional.id } },
    });

    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-16T10:00:00'), // Amanhã - PENDENTE
      dataHoraFim: new Date('2023-06-16T11:00:00'),
      status: 'PENDENTE',
      valorFinal: null,
      user: { connect: { id: 'client-3' } },
      profissional: { connect: { id: professional.id } },
    });

    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-17T10:00:00'), // Depois de amanhã - CONFIRMADO
      dataHoraFim: new Date('2023-06-17T11:00:00'),
      status: 'CONFIRMADO',
      valorFinal: 60,
      user: { connect: { id: 'client-4' } },
      profissional: { connect: { id: professional.id } },
    });

    // Adiciona mocks para os relacionamentos nos agendamentos
    bookingsRepository.items.forEach((booking) => {
      if (booking.usuarioId === 'client-1') {
        booking.user = { nome: 'Cliente 1' };
        booking.items = [{ service: { nome: 'Corte de Cabelo' } }];
      }
      if (booking.usuarioId === 'client-2') {
        booking.user = { nome: 'Cliente 2' };
        booking.items = [{ service: { nome: 'Barba' } }];
      }
      if (booking.usuarioId === 'client-3') {
        booking.user = { nome: 'Cliente 3' };
        booking.items = [{ service: { nome: 'Corte e Barba' } }];
      }
      if (booking.usuarioId === 'client-4') {
        booking.user = { nome: 'Cliente 4' };
        booking.items = [{ service: { nome: 'Pintura de Cabelo' } }];
      }
    });

    const result = await sut.execute(professional.id, { range: 'today' });

    expect(result.professional.name).toBe('João Barber');
    expect(result.professional.specialty).toBe('Barbeiro');

    // Verifica as métricas para hoje
    expect(result.metrics.appointments).toBe(2);
    expect(result.metrics.earnings).toBe(50);
    expect(result.metrics.canceled).toBe(1);
    expect(result.metrics.completed).toBe(1);

    // Verifica os próximos agendamentos
    expect(result.nextAppointments).toHaveLength(2);
    expect(result.nextAppointments[0].clientName).toBe('Cliente 3');
    expect(result.nextAppointments[0].service).toBe('Corte e Barba');
    expect(result.nextAppointments[0].status).toBe('PENDENTE');
    expect(new Date(result.nextAppointments[0].date)).toEqual(
      new Date('2023-06-16T10:00:00'),
    );

    expect(result.nextAppointments[1].clientName).toBe('Cliente 4');
    expect(result.nextAppointments[1].service).toBe('Pintura de Cabelo');
    expect(result.nextAppointments[1].status).toBe('CONFIRMADO');
    expect(new Date(result.nextAppointments[1].date)).toEqual(
      new Date('2023-06-17T10:00:00'),
    );
  });

  it('deve retornar os próximos agendamentos ordenados por data', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Criar agendamentos em ordem desordenada
    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-16T14:00:00'),
      dataHoraFim: new Date('2023-06-16T15:00:00'),
      status: 'CONFIRMADO',
      user: { connect: { id: 'client-1' } },
      profissional: { connect: { id: professional.id } },
    });

    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-16T10:00:00'),
      dataHoraFim: new Date('2023-06-16T11:00:00'),
      status: 'CONFIRMADO',
      user: { connect: { id: 'client-2' } },
      profissional: { connect: { id: professional.id } },
    });

    // Adicionar mocks para os relacionamentos
    bookingsRepository.items.forEach((booking, index) => {
      booking.user = { nome: `Cliente ${index + 1}` };
      booking.items = [{ service: { nome: 'Serviço ' + (index + 1) } }];
    });

    const result = await sut.execute(professional.id, { range: 'week' });

    expect(result.nextAppointments[0].clientName).toBe('Cliente 2');
    expect(result.nextAppointments[1].clientName).toBe('Cliente 1');
    expect(new Date(result.nextAppointments[0].date).getTime()).toBeLessThan(
      new Date(result.nextAppointments[1].date).getTime(),
    );
  });

  it('deve calcular corretamente as métricas para diferentes períodos', async () => {
    // Configura data de referência (15/06 - quinta-feira)
    vi.setSystemTime(new Date('2023-06-15T12:00:00'));

    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Cria agendamentos para os últimos 7 dias (09/06 a 15/06)
    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-09T10:00:00'), // 6 dias atrás - CONCLUIDO
      dataHoraFim: new Date('2023-06-09T11:00:00'),
      status: 'CONCLUIDO',
      valorFinal: 50,
      user: { connect: { id: 'client-1' } },
      profissional: { connect: { id: professional.id } },
    });

    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-12T10:00:00'), // 3 dias atrás - CANCELADO
      dataHoraFim: new Date('2023-06-12T11:00:00'),
      status: 'CANCELADO',
      valorFinal: null,
      user: { connect: { id: 'client-2' } },
      profissional: { connect: { id: professional.id } },
    });

    // Cria agendamento para os últimos 30 dias (20/05)
    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-05-20T10:00:00'), // 30 dias atrás - CONCLUIDO
      dataHoraFim: new Date('2023-05-20T11:00:00'),
      status: 'CONCLUIDO',
      valorFinal: 70,
      user: { connect: { id: 'client-3' } },
      profissional: { connect: { id: professional.id } },
    });

    // Cria agendamento fora dos períodos (01/05)
    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-05-01T10:00:00'),
      dataHoraFim: new Date('2023-05-01T11:00:00'),
      status: 'CONCLUIDO',
      valorFinal: 100,
      user: { connect: { id: 'client-4' } },
      profissional: { connect: { id: professional.id } },
    });

    // Testa para a semana (últimos 7 dias - deve incluir 09/06 e 12/06)
    const weekResult = await sut.execute(professional.id, { range: 'week' });
    expect(weekResult.metrics.appointments).toBe(2);
    expect(weekResult.metrics.earnings).toBe(50);
    expect(weekResult.metrics.canceled).toBe(1);
    expect(weekResult.metrics.completed).toBe(1);

    // Testa para o mês (últimos 30 dias - deve incluir 09/06, 12/06 e 16/05)
    const monthResult = await sut.execute(professional.id, { range: 'month' });
    expect(monthResult.metrics.appointments).toBe(3);
    expect(monthResult.metrics.earnings).toBe(120); // 50 + 70
    expect(monthResult.metrics.canceled).toBe(1);
    expect(monthResult.metrics.completed).toBe(2);
  });

  it('deve funcionar com período customizado', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-10T10:00:00'),
      dataHoraFim: new Date('2023-06-10T11:00:00'),
      status: 'CONCLUIDO',
      valorFinal: 50,
      user: { connect: { id: 'client-1' } },
      profissional: { connect: { id: professional.id } },
    });

    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-15T10:00:00'),
      dataHoraFim: new Date('2023-06-15T11:00:00'),
      status: 'CONCLUIDO',
      valorFinal: 60,
      user: { connect: { id: 'client-2' } },
      profissional: { connect: { id: professional.id } },
    });

    const customResult = await sut.execute(professional.id, {
      range: 'custom',
      startDate: new Date('2023-06-14T00:00:00'),
      endDate: new Date('2023-06-16T23:59:59'),
    });

    expect(customResult.metrics.appointments).toBe(1);
    expect(customResult.metrics.earnings).toBe(60);
  });

  it('deve lançar erro quando o período customizado tiver datas invertidas', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(() =>
      sut.execute(professional.id, {
        range: 'custom',
        startDate: new Date('2023-06-16T00:00:00'),
        endDate: new Date('2023-06-14T23:59:59'),
      }),
    ).rejects.toThrow('Start date must be before end date');
  });

  it('deve lançar erro quando o profissional não for encontrado', async () => {
    await expect(() =>
      sut.execute('professional-not-found', { range: 'today' }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('deve lançar erro quando o período customizado não tiver datas', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(() =>
      sut.execute(professional.id, { range: 'custom' }),
    ).rejects.toThrow('Custom range requires start and end dates');
  });

  it('deve retornar métricas zeradas quando não houver agendamentos', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await sut.execute(professional.id, { range: 'today' });

    expect(result.metrics.appointments).toBe(0);
    expect(result.metrics.earnings).toBe(0);
    expect(result.metrics.canceled).toBe(0);
    expect(result.metrics.completed).toBe(0);
    expect(result.nextAppointments).toHaveLength(0);
  });

  it('deve lidar corretamente com agendamentos no limite do período', async () => {
    const professional = await professionalsRepository.create({
      user: { connect: { id: 'user-1' } },
      especialidade: 'Barbeiro',
      ativo: true,
    });

    professionalsRepository.addUser({
      id: 'user-1',
      nome: 'João Barber',
      email: 'joao@barber.com',
      senha: 'hashed-password',
      role: 'PROFISSIONAL',
      telefone: '11999999999',
      emailVerified: false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Agendamento exatamente no início do período
    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-15T00:00:00'),
      dataHoraFim: new Date('2023-06-15T01:00:00'),
      status: 'CONCLUIDO',
      valorFinal: 50,
      user: { connect: { id: 'client-1' } },
      profissional: { connect: { id: professional.id } },
    });

    // Agendamento exatamente no fim do período
    await bookingsRepository.create({
      dataHoraInicio: new Date('2023-06-15T23:59:59'),
      dataHoraFim: new Date('2023-06-16T00:59:59'),
      status: 'CONCLUIDO',
      valorFinal: 60,
      user: { connect: { id: 'client-2' } },
      profissional: { connect: { id: professional.id } },
    });

    const result = await sut.execute(professional.id, { range: 'today' });

    expect(result.metrics.appointments).toBe(2);
    expect(result.metrics.earnings).toBe(110);
  });
});
