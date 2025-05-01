import { vi } from 'vitest';
import { Professional, Service, User } from '@prisma/client';
import { createMockUsersRepository } from './mock-users-repository';
import { createMockServicesRepository } from './mock-services-repository';

type ProfessionalWithRelations = Professional & {
  user: User;
  services: Service[];
};

export const createMockProfessionalsRepository = () => {
  const createMockProfessional = (
    overrides?: Partial<Professional>,
  ): Professional => ({
    id: 'prof-1',
    userId: 'user-1',
    especialidade: 'Corte de Cabelo',
    avatarUrl: null,
    bio: null,
    documento: null,
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const { createMockUser } = createMockUsersRepository();
  const user = createMockUser({ nome: 'Custom Name' });

  const { createMockService } = createMockServicesRepository();
  const services = [createMockService({ nome: 'Corte de Cabelo' })];

  const createMockProfessionalWithRelations = (
    overrides?: Partial<ProfessionalWithRelations>,
  ): ProfessionalWithRelations => ({
    ...createMockProfessional(),
    user,
    services,
    // se quiser passar outros valores para o mock, importar no teste o createMockUser e o createMockService e passar para o overrides da createMockProfessionalWithRelations
    ...overrides,
  });

  const mockRepository = {
    findById: vi.fn(),
    findByUserId: vi.fn(),
    findByProfessionalId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    count: vi.fn(),
    search: vi.fn(),
    countSearch: vi.fn(),
  };

  return {
    mockRepository,
    createMockProfessional,
    createMockProfessionalWithRelations,
  };
};
