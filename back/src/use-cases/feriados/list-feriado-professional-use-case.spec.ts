import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFeriadosRepository } from '@/repositories/in-memory/in-memory-feriados-repository';
import { ListHolidaysUseCase } from './list-feriado-professional-use-case';

describe('ListHolidaysUseCase', () => {
  let feriadosRepository: InMemoryFeriadosRepository;
  let sut: ListHolidaysUseCase;

  beforeEach(() => {
    feriadosRepository = new InMemoryFeriadosRepository();
    sut = new ListHolidaysUseCase(feriadosRepository);
  });

  it('deve listar feriados com paginação', async () => {
    await feriadosRepository.addHoliday('123', new Date('2025-12-25'), 'Natal');
    await feriadosRepository.addHoliday(
      '123',
      new Date('2025-01-01'),
      'Ano Novo',
    );

    const result = await sut.execute({
      professionalId: '123',
      page: 1,
      limit: 10,
    });

    expect(result.holidays.length).toBe(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('deve retornar total 0 quando não houver feriados', async () => {
    const result = await sut.execute({
      professionalId: '123',
      page: 1,
      limit: 10,
    });

    expect(result.holidays).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(0);
  });

  it('deve usar a paginação correta ao buscar feriados', async () => {
    // Adicionando 5 feriados no repositório
    for (let i = 1; i <= 5; i++) {
      await feriadosRepository.addHoliday(
        '123',
        new Date(`2025-12-${i}`),
        `Feriado ${i}`,
      );
    }

    const result = await sut.execute({
      professionalId: '123',
      page: 2, // Segunda página
      limit: 2, // 2 feriados por página
    });

    expect(result.holidays.length).toBe(2);
    expect(result.total).toBe(5);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(2);
    expect(result.totalPages).toBe(3); // 5 feriados / 2 por página
  });
});
