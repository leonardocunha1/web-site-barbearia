import { InMemoryFeriadosRepository } from '@/repositories/in-memory/in-memory-feriados-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { HolidayNotFoundError } from '../errors/holiday-not-found-error';
import { PastHolidayDeletionError } from '../errors/past-holiday-deletion-error';
import { addDays, subDays } from 'date-fns';
import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteHolidayUseCase } from './delete-feriado-professional-use-case';

describe('Delete Holiday Use Case', () => {
  let feriadosRepository: InMemoryFeriadosRepository;
  let professionalsRepository: InMemoryProfessionalsRepository;
  let sut: DeleteHolidayUseCase;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  const yesterday = subDays(today, 1);

  beforeEach(() => {
    feriadosRepository = new InMemoryFeriadosRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new DeleteHolidayUseCase(feriadosRepository, professionalsRepository);

    // Adiciona um profissional para testes
    professionalsRepository.items.push({
      id: 'valid-professional-id',
      userId: 'user-1',
      especialidade: 'Dermatologista',
      bio: 'Especialista em pele',
      avatarUrl: 'http://example.com/avatar1.jpg',
      documento: '123456',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Adiciona alguns feriados para testes
    feriadosRepository.items.push(
      {
        id: 'future-holiday',
        profissionalId: 'valid-professional-id',
        data: tomorrow,
        motivo: 'Feriado futuro',
        createdAt: new Date(),
      },
      {
        id: 'past-holiday',
        profissionalId: 'valid-professional-id',
        data: yesterday,
        motivo: 'Feriado passado',
        createdAt: new Date(),
      },
    );
  });

  it('should be able to delete a future holiday', async () => {
    await sut.execute({
      holidayId: 'future-holiday',
      professionalId: 'valid-professional-id',
    });

    expect(feriadosRepository.items).toHaveLength(1);
    expect(
      feriadosRepository.items.find((h) => h.id === 'future-holiday'),
    ).toBeUndefined();
  });

  it('should not delete holiday for non-existent professional', async () => {
    await expect(
      sut.execute({
        holidayId: 'future-holiday',
        professionalId: 'non-existent-professional',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('should not delete non-existent holiday', async () => {
    await expect(
      sut.execute({
        holidayId: 'non-existent-holiday',
        professionalId: 'valid-professional-id',
      }),
    ).rejects.toBeInstanceOf(HolidayNotFoundError);
  });

  it('should not delete holiday that belongs to another professional', async () => {
    // Adiciona outro profissional
    professionalsRepository.items.push({
      id: 'another-professional-id',
      userId: 'user-2',
      especialidade: 'Cardiologista',
      bio: 'Especialista em coração',
      avatarUrl: 'http://example.com/avatar2.jpg',
      documento: '654321',
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      sut.execute({
        holidayId: 'future-holiday',
        professionalId: 'another-professional-id',
      }),
    ).rejects.toBeInstanceOf(HolidayNotFoundError);
  });

  it('should not delete past holidays', async () => {
    await expect(
      sut.execute({
        holidayId: 'past-holiday',
        professionalId: 'valid-professional-id',
      }),
    ).rejects.toBeInstanceOf(PastHolidayDeletionError);
  });
});
