import { InMemoryHorariosFuncionamentoRepository } from '@/repositories/in-memory/in-memory-horarios-funcionamento-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { DuplicateBusinessHoursError } from '../errors/duplicate-business-hours-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { describe, expect, beforeEach, it } from 'vitest';
import { CreateBusinessHoursUseCase } from './create-horario-funcionamento-profissional-use-case';

describe('Create Business Hours Use Case', () => {
  let horariosRepository: InMemoryHorariosFuncionamentoRepository;
  let professionalsRepository: InMemoryProfessionalsRepository;
  let sut: CreateBusinessHoursUseCase;

  beforeEach(() => {
    horariosRepository = new InMemoryHorariosFuncionamentoRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new CreateBusinessHoursUseCase(
      horariosRepository,
      professionalsRepository,
    );

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

  it('should be able to create business hours', async () => {
    const result = await sut.execute({
      professionalId: 'valid-professional-id',
      diaSemana: 1, // Segunda-feira
      abreAs: '08:00',
      fechaAs: '18:00',
    });

    expect(result).toEqual(
      expect.objectContaining({
        profissionalId: 'valid-professional-id',
        diaSemana: 1,
        abreAs: '08:00',
        fechaAs: '18:00',
        ativo: true,
      }),
    );
    expect(horariosRepository.items).toHaveLength(1);
  });

  it('should be able to create business hours with break time', async () => {
    const result = await sut.execute({
      professionalId: 'valid-professional-id',
      diaSemana: 2, // Terça-feira
      abreAs: '09:00',
      fechaAs: '17:00',
      pausaInicio: '12:00',
      pausaFim: '13:00',
    });

    expect(result).toEqual(
      expect.objectContaining({
        pausaInicio: '12:00',
        pausaFim: '13:00',
      }),
    );
  });

  it('should not create business hours for non-existent professional', async () => {
    await expect(
      sut.execute({
        professionalId: 'non-existent-professional',
        diaSemana: 1,
        abreAs: '08:00',
        fechaAs: '18:00',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('should not create duplicate business hours for same day', async () => {
    await sut.execute({
      professionalId: 'valid-professional-id',
      diaSemana: 3, // Quarta-feira
      abreAs: '08:00',
      fechaAs: '18:00',
    });

    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 3,
        abreAs: '10:00',
        fechaAs: '19:00',
      }),
    ).rejects.toBeInstanceOf(DuplicateBusinessHoursError);
  });

  it('should not create business hours with invalid time format', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 4,
        abreAs: '25:00', // Hora inválida
        fechaAs: '18:00',
      }),
    ).rejects.toBeInstanceOf(InvalidTimeFormatError);

    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 4,
        abreAs: '08:00',
        fechaAs: '18:60', // Minuto inválido
      }),
    ).rejects.toBeInstanceOf(InvalidTimeFormatError);
  });

  it('should not create business hours with invalid logic', async () => {
    // Abertura depois do fechamento
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 5,
        abreAs: '18:00',
        fechaAs: '08:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);

    // Pausa incompleta
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 5,
        abreAs: '08:00',
        fechaAs: '18:00',
        pausaInicio: '12:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);

    // Pausa fora do horário
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 5,
        abreAs: '08:00',
        fechaAs: '18:00',
        pausaInicio: '07:00',
        pausaFim: '19:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });

  it('should not create business hours with invalid day of week', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 7, // Dia inválido
        abreAs: '08:00',
        fechaAs: '18:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });
});
