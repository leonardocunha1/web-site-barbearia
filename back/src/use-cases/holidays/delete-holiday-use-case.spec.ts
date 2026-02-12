import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IHolidaysRepository } from '@/repositories/holidays-repository';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';

import { startOfToday } from 'date-fns';
import { DeleteHolidayUseCase } from './delete-holiday-use-case';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { PastHolidayDeletionError } from '../errors/past-holiday-deletion-error';
import {
  createMockHolidaysRepository,
  createMockProfessionalsRepository,
} from '@/mock/mock-repositories';
import { makeHoliday, makeProfessional } from '@/test/factories';

// Tipos para os mocks
type MockHolidaysRepository = IHolidaysRepository & {
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
};

describe('DeleteHolidayUseCase', () => {
  let useCase: DeleteHolidayUseCase;
  let mockHolidaysRepository: MockHolidaysRepository;
  let mockProfessionalsRepository: MockProfessionalsRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    mockHolidaysRepository = createMockHolidaysRepository();
    mockProfessionalsRepository = createMockProfessionalsRepository();

    useCase = new DeleteHolidayUseCase(mockHolidaysRepository, mockProfessionalsRepository);
  });

  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mockHoliday = makeHoliday({
    id: 'feriado-123',
    professionalId: 'pro-123',
    date: tomorrow,
    reason: 'Feriado teste',
  });

  it('deve deletar um feriado com sucesso', async () => {
    // Configurar mocks
    mockProfessionalsRepository.findById.mockResolvedValue(makeProfessional({ id: 'pro-123' }));
    mockHolidaysRepository.findById.mockResolvedValue(mockHoliday);

    // Executar
    await useCase.execute({
      holidayId: 'feriado-123',
      professionalId: 'pro-123',
    });

    // Verificar
    expect(mockHolidaysRepository.delete).toHaveBeenCalledWith('feriado-123');
  });

  it('deve lançar erro quando profissional não existe', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('deve lançar erro quando feriado não existe', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(makeProfessional({ id: 'pro-123' }));
    mockHolidaysRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(HolidayNotFoundError);
  });

  it('deve lançar erro quando profissional não é o dono do feriado', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(makeProfessional({ id: 'pro-123' }));
    mockHolidaysRepository.findById.mockResolvedValue({
      ...mockHoliday,
      professionalId: 'pro-456', // ID diferente
    });

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(ProfissionalTentandoPegarInformacoesDeOutro);
  });

  it('deve lançar erro quando tentar deletar feriado passado', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(makeProfessional({ id: 'pro-123' }));
    mockHolidaysRepository.findById.mockResolvedValue({
      ...mockHoliday,
      date: yesterday, // Data no passado
    });

    await expect(
      useCase.execute({
        holidayId: 'feriado-123',
        professionalId: 'pro-123',
      }),
    ).rejects.toThrow(PastHolidayDeletionError);
  });

  it('não deve lançar erro quando data do feriado é hoje', async () => {
    mockProfessionalsRepository.findById.mockResolvedValue(makeProfessional({ id: 'pro-123' }));
    mockHolidaysRepository.findById.mockResolvedValue({
      ...mockHoliday,
      date: today, // Data é hoje
    });

    await useCase.execute({
      holidayId: 'feriado-123',
      professionalId: 'pro-123',
    });

    expect(mockHolidaysRepository.delete).toHaveBeenCalled();
  });
});
