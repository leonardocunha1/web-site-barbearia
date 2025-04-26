import { InMemoryHorariosFuncionamentoRepository } from '@/repositories/in-memory/in-memory-horarios-funcionamento-repository';
import { InMemoryProfessionalsRepository } from '@/repositories/in-memory/in-memory-professionals-repository';
import { ProfessionalNotFoundError } from '../errors/professional-not-found-error';
import { InvalidBusinessHoursError } from '../errors/invalid-business-hours-error';
import { InvalidTimeFormatError } from '../errors/invalid-time-format-error';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateBusinessHoursUseCase } from './update-horario-funcionamento-profissional-use-case';

describe('Update Business Hours Use Case', () => {
  let horariosRepository: InMemoryHorariosFuncionamentoRepository;
  let professionalsRepository: InMemoryProfessionalsRepository;
  let sut: UpdateBusinessHoursUseCase;

  beforeEach(() => {
    horariosRepository = new InMemoryHorariosFuncionamentoRepository();
    professionalsRepository = new InMemoryProfessionalsRepository();
    sut = new UpdateBusinessHoursUseCase(
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

    // Adiciona um horário existente para segunda-feira (dia 1)
    horariosRepository.items.push({
      id: 'existing-hours-id',
      profissionalId: 'valid-professional-id',
      diaSemana: 1, // Segunda-feira
      abreAs: '08:00',
      fechaAs: '18:00',
      pausaInicio: '12:00',
      pausaFim: '13:00',
      ativo: true,
    });
  });

  it('should be able to update business hours', async () => {
    const result = await sut.execute({
      professionalId: 'valid-professional-id',
      diaSemana: 1,
      abreAs: '09:00', // Atualiza apenas a abertura
    });

    expect(result.abreAs).toBe('09:00');
    expect(result.fechaAs).toBe('18:00'); // Mantém o valor original
  });

  it('should be able to update break time', async () => {
    const result = await sut.execute({
      professionalId: 'valid-professional-id',
      diaSemana: 1,
      pausaInicio: '12:30',
      pausaFim: '13:30',
    });

    expect(result.pausaInicio).toBe('12:30');
    expect(result.pausaFim).toBe('13:30');
  });

  it('should be able to remove break time', async () => {
    const result = await sut.execute({
      professionalId: 'valid-professional-id',
      diaSemana: 1,
      pausaInicio: null,
      pausaFim: null,
    });

    expect(result.pausaInicio).toBeNull();
    expect(result.pausaFim).toBeNull();
  });

  it('should not update business hours for non-existent professional', async () => {
    await expect(
      sut.execute({
        professionalId: 'non-existent-professional',
        diaSemana: 1,
        abreAs: '09:00',
      }),
    ).rejects.toBeInstanceOf(ProfessionalNotFoundError);
  });

  it('should not update non-existent business hours', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 2, // Terça-feira (não existe horário cadastrado)
        abreAs: '09:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });

  it('should not update with invalid day of week', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 7, // Dia inválido
        abreAs: '09:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });

  it('should not update with invalid time format', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 1,
        abreAs: '25:00', // Hora inválida
      }),
    ).rejects.toBeInstanceOf(InvalidTimeFormatError);

    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 1,
        fechaAs: '18:60', // Minuto inválido
      }),
    ).rejects.toBeInstanceOf(InvalidTimeFormatError);
  });

  it('should not update with opening after closing', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 1,
        abreAs: '19:00',
        fechaAs: '18:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });

  it('should not update with incomplete break time', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 1,
        pausaInicio: '12:00', // Falta pausaFim
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });

  it('should not update with break time outside business hours', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 1,
        pausaInicio: '07:00',
        pausaFim: '19:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });

  it('should not update with break start after break end', async () => {
    await expect(
      sut.execute({
        professionalId: 'valid-professional-id',
        diaSemana: 1,
        pausaInicio: '14:00',
        pausaFim: '13:00',
      }),
    ).rejects.toBeInstanceOf(InvalidBusinessHoursError);
  });
});
