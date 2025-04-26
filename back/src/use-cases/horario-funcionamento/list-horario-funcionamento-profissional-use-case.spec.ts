import { InMemoryHorariosFuncionamentoRepository } from '@/repositories/in-memory/in-memory-horarios-funcionamento-repository';
import { describe, expect, it } from 'vitest';

describe('listByProfessional', () => {
  it('should return business hours ordered by day of week', async () => {
    const professionalId = 'prof-123';
    const repository = new InMemoryHorariosFuncionamentoRepository();

    // Adiciona horários em ordem aleatória
    repository.items.push(
      {
        id: '3',
        profissionalId: professionalId,
        diaSemana: 3, // Quarta
        abreAs: '09:00',
        fechaAs: '18:00',
        pausaInicio: '12:00',
        pausaFim: '13:00',
        ativo: true,
      },
      {
        id: '1',
        profissionalId: professionalId,
        diaSemana: 1, // Segunda
        abreAs: '08:00',
        fechaAs: '17:00',
        pausaInicio: null,
        pausaFim: null,
        ativo: true,
      },
    );

    const result = await repository.listByProfessional(professionalId);

    expect(result).toHaveLength(2);
    expect(result[0].diaSemana).toBe(1); // Segunda primeiro
    expect(result[1].diaSemana).toBe(3); // Quarta depois
  });

  it('should return empty array if no business hours found', async () => {
    const repository = new InMemoryHorariosFuncionamentoRepository();
    const result = await repository.listByProfessional('non-existent');
    expect(result).toEqual([]);
  });
});
