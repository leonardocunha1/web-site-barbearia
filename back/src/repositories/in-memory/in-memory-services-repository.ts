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
      createdAt: new Date(),
      updatedAt: new Date(),
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

  async list(params: {
    page: number;
    limit: number;
    nome?: string;
    categoria?: string;
    ativo?: boolean;
    professionalId?: string;
  }): Promise<{ services: Service[]; total: number }> {
    const { page, limit, nome, categoria, ativo } = params;

    let filteredItems = this.items;

    if (nome) {
      filteredItems = filteredItems.filter((item) =>
        item.nome.toLowerCase().includes(nome.toLowerCase()),
      );
    }

    if (categoria) {
      filteredItems = filteredItems.filter(
        (item) => item.categoria === categoria,
      );
    }

    if (ativo !== undefined) {
      filteredItems = filteredItems.filter((item) => item.ativo === ativo);
    }

    const total = filteredItems.length;
    const services = filteredItems.slice((page - 1) * limit, page * limit);

    return { services, total };
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  async softDelete(id: string): Promise<void> {
    const service = await this.findById(id);
    if (!service) return;
    service.ativo = false;
    service.updatedAt = new Date();
  }

  async toggleStatus(id: string, newStatus: boolean): Promise<Service> {
    const service = await this.findById(id);
    if (!service) throw new Error('Service not found');
    service.ativo = newStatus;
    service.updatedAt = new Date();
    return service;
  }
}
