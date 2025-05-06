import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { ProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { UpdateBusinessHoursUseCase } from './update-horario-funcionamento-profissional-use-case';

// Tipos para os mocks
type MockHorariosRepository = HorariosFuncionamentoRepository & {
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  listByProfessional: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = ProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('Update Business Hours Use Case', () => {
  let useCase: UpdateBusinessHoursUseCase;
  let mockHorariosRepository: MockHorariosRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    // Criar mocks dos repositórios
    mockHorariosRepository = {
      findByProfessionalAndDay: vi.fn(),
      update: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
      listByProfessional: vi.fn(),
    };

    mockProfessionalsRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByProfessionalId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
      search: vi.fn(),
      countSearch: vi.fn(),
    };

    useCase = new UpdateBusinessHoursUseCase(
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

  const mockExistingHours = {
    id: 'hours-123',
    profissionalId: 'prof-123',
    diaSemana: 1,
    abreAs: '08:00',
    fechaAs: '18:00',
    pausaInicio: '12:00',
    pausaFim: '13:00',
    ativo: true,
  };

  it('deve atualizar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );
    mockHorariosRepository.update.mockResolvedValue({
      ...mockExistingHours,
      abreAs: '09:00',
      fechaAs: '19:00',
    });

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      diaSemana: 1,
      abreAs: '09:00',
      fechaAs: '19:00',
    });

    // Verificar
    expect(result).toEqual({
      ...mockExistingHours,
      abreAs: '09:00',
      fechaAs: '19:00',
    });
    expect(mockProfessionalsRepository.findById).toHaveBeenCalledWith(
      'prof-123',
    );
    expect(
      mockHorariosRepository.findByProfessionalAndDay,
    ).toHaveBeenCalledWith('prof-123', 1);
    expect(mockHorariosRepository.update).toHaveBeenCalledWith('hours-123', {
      abreAs: '09:00',
      fechaAs: '19:00',
      pausaInicio: '12:00',
      pausaFim: '13:00',
    });
  });

  it('deve atualizar apenas a pausa mantendo outros horários', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );
    mockHorariosRepository.update.mockResolvedValue({
      ...mockExistingHours,
      pausaInicio: '12:30',
      pausaFim: '13:30',
    });

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      diaSemana: 1,
      pausaInicio: '12:30',
      pausaFim: '13:30',
    });

    // Verificar
    expect(result).toEqual({
      ...mockExistingHours,
      pausaInicio: '12:30',
      pausaFim: '13:30',
    });
    expect(mockHorariosRepository.update).toHaveBeenCalledWith('hours-123', {
      abreAs: '08:00',
      fechaAs: '18:00',
      pausaInicio: '12:30',
      pausaFim: '13:30',
    });
  });

  it('deve remover a pausa quando informado null', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );
    mockHorariosRepository.update.mockResolvedValue({
      ...mockExistingHours,
      pausaInicio: null,
      pausaFim: null,
    });

    // Executar
    const result = await useCase.execute({
      professionalId: 'prof-123',
      diaSemana: 1,
      pausaInicio: null,
      pausaFim: null,
    });

    // Verificar
    expect(result).toEqual({
      ...mockExistingHours,
      pausaInicio: null,
      pausaFim: null,
    });
  });

  it('deve lançar erro quando profissional não existe', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'non-existent-prof',
        diaSemana: 1,
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro para dia da semana inválido', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 7, // Inválido (deve ser 0-6)
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando horário não existe para atualização', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando apenas um horário de pausa é informado', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );

    // Executar e verificar - apenas pausaInicio
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        pausaInicio: '12:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);

    // Executar e verificar - apenas pausaFim
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        pausaFim: '13:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro para formato de horário inválido', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );

    // Executar e verificar - abreAs inválido
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        abreAs: '25:00', // Hora inválida
      }),
    ).rejects.toThrow(InvalidTimeFormatError);

    // Executar e verificar - fechaAs inválido
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        fechaAs: '18:60', // Minutos inválidos
      }),
    ).rejects.toThrow(InvalidTimeFormatError);
  });

  it('deve lançar erro quando horário de abertura é após fechamento', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        abreAs: '19:00',
        fechaAs: '09:00', // Fecha antes de abrir
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando pausa está fora do horário de funcionamento', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );

    // Executar e verificar - pausa antes da abertura
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        pausaInicio: '07:00',
        pausaFim: '08:30',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);

    // Executar e verificar - pausa após o fechamento
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        pausaInicio: '18:30',
        pausaFim: '19:00',
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });

  it('deve lançar erro quando início da pausa é após o fim', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(mockProfessional);
    mockHorariosRepository.findByProfessionalAndDay.mockResolvedValue(
      mockExistingHours,
    );

    // Executar e verificar
    await expect(
      useCase.execute({
        professionalId: 'prof-123',
        diaSemana: 1,
        pausaInicio: '14:00',
        pausaFim: '13:00', // Fim antes do início
      }),
    ).rejects.toThrow(InvalidBusinessHoursError);
  });
});
