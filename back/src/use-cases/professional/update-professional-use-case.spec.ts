import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UpdateProfessionalUseCase } from './update-professional-use-case';
import { IProfessionalsRepository } from '@/repositories/professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { createMockProfessionalsRepository } from '@/mock/mock-repositories';
import { makeProfessional } from '@/test/factories';

// Tipo para o mock do repositório
type MockProfessionalsRepository = IProfessionalsRepository & {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

describe('UpdateProfessionalUseCase', () => {
  let professionalsRepository: MockProfessionalsRepository;
  let sut: UpdateProfessionalUseCase;

  beforeEach(() => {
    professionalsRepository = createMockProfessionalsRepository();

    sut = new UpdateProfessionalUseCase(professionalsRepository);
  });

  it('deve atualizar um profissional com todos os campos', async () => {
    // Mock do profissional existente
    const mockProfessional = makeProfessional({
      id: 'prof-123',
      userId: 'user-123',
      specialty: 'Dentista',
      bio: 'Bio antiga',
      document: '12345',
      active: true,
      avatarUrl: 'old-avatar.jpg',
    });

    // Mock da atualização
    const updatedProfessional = {
      ...mockProfessional,
      specialty: 'Ortodontista',
      bio: 'Nova bio',
      document: '54321',
      active: false,
      avatarUrl: 'new-avatar.jpg',
      updatedAt: new Date(),
    };

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue(updatedProfessional);

    // Dados para atualização
    const updateData = {
      id: 'prof-123',
      specialty: 'Ortodontista',
      bio: 'Nova bio',
      document: '54321',
      active: false,
      avatarUrl: 'new-avatar.jpg',
    };

    // Executar
    const result = await sut.execute(updateData);

    // Verificar
    expect(result).toEqual(updatedProfessional);
    expect(professionalsRepository.findById).toHaveBeenCalledWith('prof-123');
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      specialty: 'Ortodontista',
      bio: 'Nova bio',
      document: '54321',
      active: false,
      avatarUrl: 'new-avatar.jpg',
      updatedAt: expect.any(Date),
    });
  });

  it('deve atualizar apenas campos específicos quando outros são undefined', async () => {
    const mockProfessional = makeProfessional({
      id: 'prof-123',
      userId: 'user-123',
      specialty: 'Dentista',
      bio: 'Bio antiga',
      document: '12345',
      active: true,
      avatarUrl: 'old-avatar.jpg',
    });

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      specialty: 'Ortodontista',
      updatedAt: new Date(),
    });

    const result = await sut.execute({
      id: 'prof-123',
      specialty: 'Ortodontista',
    });

    expect(result?.specialty).toBe('Ortodontista');
    expect(result?.bio).toBe('Bio antiga'); // Deve manter o valor antigo
    expect(professionalsRepository.update).toHaveBeenCalledWith('prof-123', {
      specialty: 'Ortodontista',
      updatedAt: expect.any(Date),
    });
  });

  it('deve permitir definir campos como null', async () => {
    const mockProfessional = makeProfessional({
      id: 'prof-123',
      userId: 'user-123',
      specialty: 'Dentista',
      bio: 'Bio antiga',
      document: '12345',
      active: true,
      avatarUrl: 'old-avatar.jpg',
    });

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockResolvedValue({
      ...mockProfessional,
      bio: null,
      document: null,
      updatedAt: new Date(),
    });

    const result = await sut.execute({
      id: 'prof-123',
      bio: null,
      document: null,
    });

    expect(result?.bio).toBeNull();
    expect(result?.document).toBeNull();
  });

  it('deve lançar erro quando profissional não for encontrado', async () => {
    professionalsRepository.findById.mockResolvedValue(null);

    await expect(
      sut.execute({
        id: 'prof-inexistente',
        specialty: 'Dentista',
      }),
    ).rejects.toThrow(ProfessionalNotFoundError);

    expect(professionalsRepository.update).not.toHaveBeenCalled();
  });

  it('deve atualizar a data de atualização mesmo quando outros campos não mudam', async () => {
    const mockProfessional = makeProfessional({
      id: 'prof-123',
      userId: 'user-123',
      specialty: 'Dentista',
      bio: 'Bio existente',
      updatedAt: new Date('2023-01-01'),
    });

    professionalsRepository.findById.mockResolvedValue(mockProfessional);
    professionalsRepository.update.mockImplementation(async (_id, data) => ({
      ...mockProfessional,
      ...data,
    }));

    const oldUpdatedAt = mockProfessional.updatedAt;
    const result = await sut.execute({
      id: 'prof-123',
      bio: 'Bio existente', // Mesmo valor
    });

    expect(result?.updatedAt).not.toEqual(oldUpdatedAt);
    expect(result?.updatedAt).toEqual(expect.any(Date));
  });
});
