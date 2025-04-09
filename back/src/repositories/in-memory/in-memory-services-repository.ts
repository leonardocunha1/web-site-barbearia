// src/repositories/in-memory/in-memory-services-repository.ts
import { Service, Prisma } from '@prisma/client';
import { ServicesRepository } from '@/repositories/services-repository';
import { randomUUID } from 'crypto';

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = [];

  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    const service: Service = {
      id: randomUUID(),
      nome: data.nome,
      descricao: data.descricao || null,
      precoPadrao: data.precoPadrao,
      duracao: data.duracao,
      categoria: data.categoria || null,
      ativo: data.ativo !== undefined ? data.ativo : true,
      professionalId: data.Professional?.connect?.id || null,
    };

    this.items.push(service);
    return service;
  }

  async findById(id: string): Promise<Service | null> {
    const service = this.items.find((item) => item.id === id);
    return service || null;
  }

  async findByName(nome: string): Promise<Service | null> {
    const service = this.items.find((item) => item.nome === nome);
    return service || null;
  }

  async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Service not found');
    }

    const currentService = this.items[index];

    const updatedService: Service = {
      ...currentService,
      nome: (data.nome as string) || currentService.nome,
      descricao: (data.descricao as string | null) ?? currentService.descricao,
      precoPadrao: (data.precoPadrao as number) || currentService.precoPadrao,
      duracao: (data.duracao as number) || currentService.duracao,
      categoria: (data.categoria as string | null) ?? currentService.categoria,
      ativo: (data.ativo as boolean) ?? currentService.ativo,
    };

    this.items[index] = updatedService;
    return updatedService;
  }

  async list(): Promise<Service[]> {
    return this.items;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
