import { InMemoryFeriadosRepository } from '@/repositories/in-memory/in-memory-feriados-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { PastDateError } from '../errors/past-date-error';
import { InvalidHolidayDescriptionError } from '../errors/invalid-holiday-description-error';
import { DuplicateHolidayError } from '../errors/duplicate-holiday-error';
import { addDays } from 'date-fns';
import { CreateHolidayUseCase } from './create-feriado-professional-use-case';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Create Holiday Use Case', () => {
  let feriadosRepository: InMemoryFeriadosRepository;
  let professionalsRepository: InMemoryProfessionalsRepository;
  let sut: CreateHolidayUseCase;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  beforeEach(() => {
    feriadosRepository = new InMemoryFeriadosRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new CreateHolidayUseCase(feriadosRepository, professionalsRepository);

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
  });

  it('should be able to create a holiday', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        date: tomorrow,
        motivo: 'Feriado municipal',
      }),
    ).resolves.not.toThrow();

    expect(feriadosRepository.items).toHaveLength(1);
    expect(feriadosRepository.items[0]).toEqual(
      expect.objectContaining({
        profissionalId: 'valid-professional-id',
        motivo: 'Feriado municipal',
      }),
    );
  });

  it('should not create holiday for non-existent professional', async () => {
    await expect(
      sut.execute({
        professionalId: 'non-existent-professional',
        date: tomorrow,
        motivo: 'Feriado teste',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('should not create holiday with past date', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        date: yesterday,
        motivo: 'Feriado teste',
      }),
    ).rejects.toBeInstanceOf(PastDateError);
  });

  it('should not create holiday with invalid description (too short)', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        date: tomorrow,
        motivo: 'A',
      }),
    ).rejects.toBeInstanceOf(InvalidHolidayDescriptionError);
  });

  it('should not create holiday with invalid description (too long)', async () => {
    const longDescription = 'a'.repeat(101);
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        date: tomorrow,
        motivo: longDescription,
      }),
    ).rejects.toBeInstanceOf(InvalidHolidayDescriptionError);
  });

  it('should not create holiday with empty description', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        date: tomorrow,
        motivo: '',
      }),
    ).rejects.toBeInstanceOf(InvalidHolidayDescriptionError);
  });

  it('should not create duplicate holiday for same professional and date', async () => {
    // Cria o primeiro feriado
    await sut.execute({
      professionalId: 'valid-professional-id',
      date: tomorrow,
      motivo: 'Feriado existente',
    });

    // Tenta criar o mesmo feriado novamente
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        date: tomorrow,
        motivo: 'Novo motivo',
      }),
    ).rejects.toBeInstanceOf(DuplicateHolidayError);
  });

  it('should allow different professionals to have holidays on same date', async () => {
    // Adiciona um segundo profissional
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

    // Cria feriado para o primeiro profissional
    await sut.execute({
      professionalId: 'valid-professional-id',
      date: tomorrow,
      motivo: 'Feriado 1',
    });

    // Cria feriado para o segundo profissional na mesma data
    await expect(
      sut.execute({
        professionalId: 'another-professional-id',
        date: tomorrow,
        motivo: 'Feriado 2',
      }),
    ).resolves.not.toThrow();

    expect(feriadosRepository.items).toHaveLength(2);
  });
});
