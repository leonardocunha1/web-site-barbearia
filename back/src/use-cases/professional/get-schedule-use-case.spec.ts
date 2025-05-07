import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GetProfessionalScheduleUseCase } from './get-schedule-use-case';
import {
  createMockBookingsRepository,
  createMockFeriadosRepository,
  createMockHorariosRepository,
} from '@/mock/mock-repositories';

const defaultBusinessHours = {
  id: '1',
  profissionalId: 'prof-1',
  diaSemana: 3, // Quarta-feira (para o teste padrão)
  abreAs: '08:00',
  fechaAs: '17:00',
  pausaInicio: '12:00',
  pausaFim: '13:00',
  ativo: true,
};

describe('GetProfessionalScheduleUseCase', () => {
  let bookingsRepository: ReturnType<typeof createMockBookingsRepository>;
  let horariosFuncionamentoRepository: ReturnType<
    typeof createMockHorariosRepository
  >;
  let feriadosRepository: ReturnType<typeof createMockFeriadosRepository>;
  let sut: GetProfessionalScheduleUseCase;

  beforeEach(() => {
    bookingsRepository = createMockBookingsRepository();
    horariosFuncionamentoRepository = createMockHorariosRepository();
    feriadosRepository = createMockFeriadosRepository();

    // Configuração padrão dos mocks
    horariosFuncionamentoRepository.findByProfessionalAndDay = vi
      .fn()
      .mockResolvedValue(defaultBusinessHours);

    feriadosRepository.isProfessionalHoliday = vi.fn().mockResolvedValue(null);
    bookingsRepository.findByProfessionalAndDate = vi
      .fn()
      .mockResolvedValue([]); // Padrão para não quebrar testes que não mockam explicitamente

    sut = new GetProfessionalScheduleUseCase(
      bookingsRepository,
      horariosFuncionamentoRepository,
      feriadosRepository,
    );
  });

  it('deve retornar slots vazios quando for feriado', async () => {
    const holidayDate = '2023-05-01';
    feriadosRepository.isProfessionalHoliday = vi.fn().mockResolvedValue({
      motivo: 'Dia do Trabalho',
    });

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: holidayDate,
    });

    expect(result).toEqual({
      date: holidayDate,
      timeSlots: [],
      isHoliday: true,
      holidayReason: 'Dia do Trabalho',
    });
  });

  it('deve retornar slots vazios quando o horário de funcionamento estiver inativo', async () => {
    const testDate = '2023-05-02';
    // CORREÇÃO: Usar o objeto base defaultBusinessHours para sobrescrever
    horariosFuncionamentoRepository.findByProfessionalAndDay = vi
      .fn()
      .mockResolvedValue({
        ...defaultBusinessHours, // Usar o objeto base
        ativo: false,
      });

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: testDate,
    });

    expect(result).toEqual({
      date: testDate,
      timeSlots: [],
      isClosed: true,
    });
  });

  it('deve gerar slots de tempo corretamente sem agendamentos', async () => {
    const testDate = '2023-05-03';
    // bookingsRepository.findByProfessionalAndDate já mockado no beforeEach para retornar []

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: testDate,
    });

    expect(result.timeSlots[0].time).toBe('08:00');
    expect(result.timeSlots[0].available).toBe(true);
    // CORREÇÃO: Asserção corrigida para 48 slots (8h de trabalho - 1h de pausa = 7h = 420 min. 420min / 10min/slot = 42 slots. Erro no cálculo anterior, 08:00-12:00 -> 4h*6 = 24 slots. 13:00-17:00 -> 4h*6 = 24 slots. Total 48 slots)
    expect(result.timeSlots).toHaveLength(48);
  });

  it('deve marcar slots como indisponíveis quando houver agendamentos', async () => {
    const testDate = '2023-05-04';
    const mockBooking = {
      id: 'booking-1',
      dataHoraInicio: new Date(`${testDate}T10:00:00`),
      dataHoraFim: new Date(`${testDate}T10:30:00`), // 3 slots de 10 min: 10:00, 10:10, 10:20
      status: 'CONFIRMADO',
      user: { id: 'user-1', nome: 'Cliente Teste' },
      items: [
        {
          serviceProfessional: { service: { nome: 'Corte de Cabelo' } },
        },
      ],
    };

    bookingsRepository.findByProfessionalAndDate = vi
      .fn()
      .mockResolvedValue([mockBooking]);

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: testDate,
    });

    const bookedSlots = result.timeSlots.filter((s) => !s.available);
    expect(bookedSlots).toHaveLength(3); // 10:00, 10:10, 10:20
    expect(bookedSlots[0].booking).toEqual({
      id: 'booking-1',
      clientName: 'Cliente Teste',
      services: ['Corte de Cabelo'],
    });
  });

  it('deve lidar corretamente com dias sem pausa', async () => {
    const testDate = '2023-05-05';
    // CORREÇÃO: Usar o objeto base defaultBusinessHours para sobrescrever
    horariosFuncionamentoRepository.findByProfessionalAndDay = vi
      .fn()
      .mockResolvedValue({
        ...defaultBusinessHours, // Usar o objeto base
        diaSemana: 5, // Sexta-feira
        pausaInicio: null,
        pausaFim: null,
      });

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: testDate,
    });

    expect(result.timeSlots[0].time).toBe('08:00');
    expect(result.timeSlots[result.timeSlots.length - 1].time).toBe('16:50');
    // Com 9 horas de trabalho (08:00-17:00) e slots de 10 min, são 9*6 = 54 slots
    expect(result.timeSlots).toHaveLength(54);
  });

  it('deve retornar os horários de funcionamento corretamente', async () => {
    const testDate = '2023-05-08';

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: testDate,
    });

    expect(result.businessHours).toEqual({
      opensAt: '08:00',
      closesAt: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
    });
  });
});
