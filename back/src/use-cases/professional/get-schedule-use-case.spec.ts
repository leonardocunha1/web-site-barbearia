import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BookingsRepository } from '@/repositories/bookings-repository';
import { FeriadosRepository } from '@/repositories/feriados-repository';
import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { parseISO } from 'date-fns';
import { GetProfessionalScheduleUseCase } from './get-schedule-use-case';

describe('GetProfessionalScheduleUseCase', () => {
  let bookingsRepository: Partial<BookingsRepository>;
  let horariosFuncionamentoRepository: Partial<HorariosFuncionamentoRepository>;
  let feriadosRepository: Partial<FeriadosRepository>;
  let sut: GetProfessionalScheduleUseCase;

  beforeEach(() => {
    // Mock dos repositórios
    bookingsRepository = {
      findByProfessionalAndDate: vi.fn().mockResolvedValue([]),
    };

    horariosFuncionamentoRepository = {
      findByProfessionalAndDay: vi.fn().mockResolvedValue({
        id: '1',
        profissionalId: 'prof-1',
        diaSemana: 1, // Segunda-feira
        abreAs: '08:00',
        fechaAs: '17:00',
        pausaInicio: '12:00',
        pausaFim: '13:00',
        ativo: true,
      }),
    };

    feriadosRepository = {
      isProfessionalHoliday: vi.fn().mockResolvedValue(null),
    };

    sut = new GetProfessionalScheduleUseCase(
      bookingsRepository as BookingsRepository,
      horariosFuncionamentoRepository as HorariosFuncionamentoRepository,
      feriadosRepository as FeriadosRepository,
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
    expect(feriadosRepository.isProfessionalHoliday).toHaveBeenCalledWith(
      'prof-1',
      expect.any(Date),
    );
  });

  it('deve retornar slots vazios quando o horário de funcionamento estiver inativo', async () => {
    const testDate = '2023-05-02';
    horariosFuncionamentoRepository.findByProfessionalAndDay = vi
      .fn()
      .mockResolvedValue({
        id: '1',
        profissionalId: 'prof-1',
        diaSemana: 2, // Terça-feira
        abreAs: '08:00',
        fechaAs: '17:00',
        pausaInicio: '12:00',
        pausaFim: '13:00',
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
    const testDate = '2023-05-03'; // Quarta-feira
    parseISO(testDate);

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: testDate,
    });

    // Verifica se os slots começam às 08:00
    expect(result.timeSlots[0].time).toBe('08:00');
    expect(result.timeSlots[0].available).toBe(true);

    // Verifica o último slot antes da pausa (11:50) e o primeiro depois (13:00)
    const lastSlotBeforeBreak = result.timeSlots.find(
      (slot) => slot.time === '11:50',
    );
    const firstSlotAfterBreak = result.timeSlots.find(
      (slot) => slot.time === '13:00',
    );

    expect(lastSlotBeforeBreak).toBeDefined();
    expect(firstSlotAfterBreak).toBeDefined();

    // Verifica que não há slots entre 12:00 e 13:00 (6 slots de 10 minutos)
    const breakSlots = result.timeSlots.filter((slot) => {
      const time = new Date(`2000-01-01T${slot.time}:00`);
      return (
        time >= new Date('2000-01-01T12:00:00') &&
        time < new Date('2000-01-01T13:00:00')
      );
    });
    expect(breakSlots.length).toBe(0);

    // Verifica o último slot antes do fechamento (16:50)
    const lastSlot = result.timeSlots[result.timeSlots.length - 1];
    expect(lastSlot.time).toBe('16:50');
  });

  it('deve marcar slots como indisponíveis quando houver agendamentos', async () => {
    const testDate = '2023-05-04';
    parseISO(testDate);

    // Mock mais completo do agendamento
    const mockBooking = {
      id: 'booking-1',
      dataHoraInicio: new Date('2023-05-04T10:00:00'),
      dataHoraFim: new Date('2023-05-04T10:30:00'),
      status: 'CONFIRMADO',
      user: {
        id: 'user-1',
        nome: 'Cliente Teste',
        // ... outros campos do usuário
      },
      items: [
        {
          id: 'item-1',
          serviceProfessional: {
            service: {
              nome: 'Corte de Cabelo',
            },
          },
          // ... outros campos do item
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

    // Verifica apenas o primeiro slot do agendamento
    const firstBookedSlot = result.timeSlots.find((s) => s.time === '10:00');

    expect(firstBookedSlot).toBeDefined();
    expect(firstBookedSlot?.available).toBe(false);

    // Verifica se o booking existe e tem a estrutura básica
    expect(firstBookedSlot?.booking).toBeDefined();
    expect(firstBookedSlot?.booking?.id).toBe('booking-1');
    expect(firstBookedSlot?.booking?.clientName).toBe('Cliente Teste');
    expect(firstBookedSlot?.booking?.services).toEqual(['Corte de Cabelo']);
  });

  it('deve lidar corretamente com dias sem pausa', async () => {
    const testDate = '2023-05-05'; // Sexta-feira
    horariosFuncionamentoRepository.findByProfessionalAndDay = vi
      .fn()
      .mockResolvedValue({
        id: '1',
        profissionalId: 'prof-1',
        diaSemana: 5,
        abreAs: '09:00',
        fechaAs: '18:00',
        pausaInicio: null,
        pausaFim: null,
        ativo: true,
      });

    const result = await sut.execute({
      professionalId: 'prof-1',
      date: testDate,
    });

    // Verifica se todos os slots têm diferença de 10 minutos
    for (let i = 1; i < result.timeSlots.length; i++) {
      const prevTime = new Date(
        `2000-01-01T${result.timeSlots[i - 1].time}:00`,
      );
      const currTime = new Date(`2000-01-01T${result.timeSlots[i].time}:00`);
      const diffMinutes =
        (currTime.getTime() - prevTime.getTime()) / (1000 * 60);
      expect(diffMinutes).toBe(10);
    }

    // Verifica primeiro e último slot
    expect(result.timeSlots[0].time).toBe('09:00');
    expect(result.timeSlots[result.timeSlots.length - 1].time).toBe('17:50');
  });

  it('deve retornar os horários de funcionamento corretamente', async () => {
    const testDate = '2023-05-08'; // Segunda-feira
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
