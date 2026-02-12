import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IBusinessHoursRepository } from '@/repositories/business-hours-repository';
import { BusinessHoursNotFoundError } from '../errors/business-hours-not-found-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { DeleteBusinessHoursUseCase } from './delete-business-hours-use-case';
import { createMockBusinessHoursRepository } from '@/mock/mock-repositories';

// Tipo para o mock do repositório
type MockBusinessHoursRepository = IBusinessHoursRepository & {
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  listByProfessional: ReturnType<typeof vi.fn>;
};

describe('Delete Business Hours Use Case', () => {
  let useCase: DeleteBusinessHoursUseCase;
  let mockBusinessHoursRepository: MockBusinessHoursRepository;

  beforeEach(() => {
    mockBusinessHoursRepository = createMockBusinessHoursRepository();

    useCase = new DeleteBusinessHoursUseCase(mockBusinessHoursRepository);
  });

  const mockBusinessHours = {
    id: 'hours-123',
    professionalId: 'prof-123',
    dayOfWeek: 1,
    opensAt: '08:00',
    closesAt: '18:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    ativo: true,
  };

  it('deve deletar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockBusinessHoursRepository.findById.mockResolvedValue(mockBusinessHours);
    mockBusinessHoursRepository.delete.mockResolvedValue(undefined);

    // Executar
    await useCase.execute({
      businessHoursId: 'hours-123',
      professionalId: 'prof-123',
    });

    // Verificar
    expect(mockBusinessHoursRepository.findById).toHaveBeenCalledWith('hours-123');
    expect(mockBusinessHoursRepository.delete).toHaveBeenCalledWith('hours-123');
  });

  it('deve lançar erro quando horário não existe', async () => {
    // Configurar mocks
    mockBusinessHoursRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        businessHoursId: 'non-existent-hours',
        professionalId: 'prof-123',
      }),
    ).rejects.toThrow(BusinessHoursNotFoundError);
  });

  it('deve lançar erro quando profissional não é o dono do horário', async () => {
    // Configurar mocks
    mockBusinessHoursRepository.findById.mockResolvedValue(mockBusinessHours);

    // Executar e verificar
    await expect(
      useCase.execute({
        businessHoursId: 'hours-123',
        professionalId: 'another-prof', // ID diferente
      }),
    ).rejects.toThrow(ProfissionalTentandoPegarInformacoesDeOutro);
  });

  it('deve garantir que o método delete é chamado apenas quando todas as validações passam', async () => {
    // Configurar mocks
    mockBusinessHoursRepository.findById.mockResolvedValue(mockBusinessHours);
    mockBusinessHoursRepository.delete.mockResolvedValue(undefined);

    // Executar
    await useCase.execute({
      businessHoursId: 'hours-123',
      professionalId: 'prof-123',
    });

    // Verificar que delete foi chamado apenas uma vez
    expect(mockBusinessHoursRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('deve garantir que o método delete não é chamado quando há erros de validação', async () => {
    // Configurar mocks para simular erro
    mockBusinessHoursRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        businessHoursId: 'hours-123',
        professionalId: 'prof-123',
      }),
    ).rejects.toThrow();

    // Verificar que delete não foi chamado
    expect(mockBusinessHoursRepository.delete).not.toHaveBeenCalled();
  });
});






