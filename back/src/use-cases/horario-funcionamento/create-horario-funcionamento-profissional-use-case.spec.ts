import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { DuplicateBusinessHoursError } from '../errors/duplicate-business-hours-error';
import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { CreateBusinessHoursUseCase } from './create-horario-funcionamento-profissional-use-case';
import {
  createMockHorariosRepository,
  createMockProfessionalsRepository,
} from '@/mock/mock-repositories';

// Tipos para os mocks
type MockHorariosRepository = HorariosFuncionamentoRepository & {
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  listByProfessional: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('Create Business Hours Use Case', () => {
  let useCase: CreateBusinessHoursUseCase;
  let mockHorariosRepository: MockHorariosRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    mockHorariosRepository = createMockHorariosRepository();
    mockProfessionalsRepository = createMockProfessionalsRepository();

    useCase = new CreateBusinessHoursUseCase(
      mockHorariosRepository,
      mockProfessionalsRepository,
    );
  });

  const mockProfessional = {
    id: 'prof-123',
    userId: 'user-123',
    especialidade: 'Especialidade Teste',
    ativo: true,
  };

  const mockBusinessHours = {
    id: 'hours-123',
    profissionalId: 'prof-123',
    diaSemana: 1,
    abreAs: '08:00',
    fechaAs: '18:00',
    pausaInicio: '12:00',
    pausaFim: '13:00',
    ativo: true,
  };

  it('deve criar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(null);
    mockHorariosRepository.create.mockResolvedValue(mockBusinessHours);

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      diaSemana: 1,
      abreAs: '08:00',
      fechaAs: '18:00',
      pausaInicio: '12:00',
      pausaFim: '13:00',
    });

    // Verificar
    expect(result).toEqual(mockBusinessHours);
    expect(mockProfessionalsRepository.findById).toHaveBeenCalledWith(
      'prof-123',
    );
    expect(
      mockHorariosRepository.findByProfessionalAndDay,
    ).toHaveBeenCalledWith('prof-123', 1);
    expect(mockHorariosRepository.create).toHaveBeenCalledWith({
      profissional: { connect: { id: 'prof-123' } },
      diaSemana: 1,
      abreAs: '08:00',
      fechaAs: '18:00',
      pausaInicio: '12:00',
      pausaFim: '13:00',
      ativo: true,
    });
  });

  it('deve lançar erro quando profissional não existe', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        professionalId: 'non-existent-prof',
        diaSemana: 1,
        abreAs: '08:00',
        fechaAs: '18:00',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro para formato de horário inválido', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        abreAs: '25:00', // Hora inválida
        fechaAs: '18:00',
      }),
    ).rejects.toThrow(InvalidTimeFormatError);
  });

  it('deve lançar erro quando horário de abertura é após fechamento', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        abreAs: '19:00',
        fechaAs: '09:00', // Fecha antes de abrir
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando já existe horário para o mesmo dia', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockBusinessHours,
    );

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1, // Dia com horário já existente
        abreAs: '09:00',
        fechaAs: '17:00',
      }),
    ).rejects.toThrow(DuplicateBusinessHoursError);
  });

  it('deve lançar erro para dia da semana inválido', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 7, // Dia inválido
        abreAs: '09:00',
        fechaAs: '17:00',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando pausa está fora do horário de funcionamento', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        abreAs: '09:00',
        fechaAs: '18:00',
        pausaInicio: '08:00', // Antes da abertura
        pausaFim: '09:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando apenas um dos horários de pausa é fornecido', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        abreAs: '09:00',
        fechaAs: '18:00',
        pausaInicio: '12:00', // Sem pausaFim
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });
});
