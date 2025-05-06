import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HorariosFuncionamentoRepository } from '@/repositories/horarios-funcionamento-repository';
import { BusinessHoursNotFoundError } from '../errors/businnes-hours-not-found-error';
import { ProfissionalTentandoPegarInformacoesDeOutro } from '../errors/profissional-pegando-informacao-de-outro-usuario-error';
import { DeleteBusinessHoursUseCase } from './delete-horario-funcionamento-profissional-use-case';

// Tipo para o mock do repositório
type MockHorariosRepository = HorariosFuncionamentoRepository & {
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  findByProfessionalAndDay: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  listByProfessional: ReturnType<typeof vi.fn>;
};

describe('Delete Business Hours Use Case', () => {
  let useCase: DeleteBusinessHoursUseCase;
  let mockHorariosRepository: MockHorariosRepository;

  beforeEach(() => {
    // Criar mock do repositório
    mockHorariosRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
      findByProfessionalAndDay: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      listByProfessional: vi.fn(),
    };

    useCase = new DeleteBusinessHoursUseCase(mockHorariosRepository);
  });

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

  it('deve deletar horários de funcionamento com sucesso', async () => {
    // Configurar mocks
    mockHorariosRepository.findById.mockResolvedValue(mockBusinessHours);
    mockHorariosRepository.delete.mockResolvedValue(undefined);

    // Executar
    await useCase.execute({
      businessHoursId: 'hours-123',
      professionalId: 'prof-123',
    });

    // Verificar
    expect(mockHorariosRepository.findById).toHaveBeenCalledWith('hours-123');
    expect(mockHorariosRepository.delete).toHaveBeenCalledWith('hours-123');
  });

  it('deve lançar erro quando horário não existe', async () => {
    // Configurar mocks
    mockHorariosRepository.findById.mockResolvedValue(null);

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
    mockHorariosRepository.findById.mockResolvedValue(mockBusinessHours);

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
    mockHorariosRepository.findById.mockResolvedValue(mockBusinessHours);
    mockHorariosRepository.delete.mockResolvedValue(undefined);

    // Executar
    await useCase.execute({
      businessHoursId: 'hours-123',
      professionalId: 'prof-123',
    });

    // Verificar que delete foi chamado apenas uma vez
    expect(mockHorariosRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('deve garantir que o método delete não é chamado quando há erros de validação', async () => {
    // Configurar mocks para simular erro
    mockHorariosRepository.findById.mockResolvedValue(null);

    // Executar e verificar
    await expect(
      useCase.execute({
        businessHoursId: 'hours-123',
        professionalId: 'prof-123',
      }),
    ).rejects.toThrow();

    // Verificar que delete não foi chamado
    expect(mockHorariosRepository.delete).not.toHaveBeenCalled();
  });
});
