import { vi } from 'vitest';
import { Service } from '@prisma/client';

// Mock da estrutura de dados
const createMockService = (overrides?: Partial<Service>): Service => ({
  id: 'service-1',
  nome: 'Corte de Cabelo',
  duracao: 60,
  precoPadrao: 50,
  descricao: 'Corte de cabelo masculino',
  categoria: 'Beleza',
  ativo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Mock do repositório
export const createMockServicesRepository = () => {
  const mockRepository = {
    create: vi.fn().mockResolvedValue(createMockService()),
    findById: vi.fn().mockResolvedValue(createMockService()),
    findByName: vi.fn().mockResolvedValue(createMockService()),
    update: vi.fn().mockResolvedValue(createMockService()),
    delete: vi.fn().mockResolvedValue(undefined),
    softDelete: vi.fn().mockResolvedValue(undefined),
    toggleStatus: vi
      .fn()
      .mockResolvedValue(createMockService({ ativo: false })),
    list: vi.fn().mockResolvedValue({
      services: [createMockService()],
      total: 1,
    }),
  };

  return {
    mockRepository,
    createMockService,
  };
};
