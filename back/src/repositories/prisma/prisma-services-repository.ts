import { Prisma, Service } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ServicesRepository } from '../services-repository';

export class PrismaServicesRepository implements ServicesRepository {
  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    const service = await prisma.service.create({
      data,
    });

    return service;
  }

  async findById(id: string): Promise<Service | null> {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    return service;
  }

  async findByName(name: string): Promise<Service | null> {
    const service = await prisma.service.findFirst({
      where: {
        nome: name,
      },
    });

    return service;
  }

  async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
    const service = await prisma.service.update({
      where: { id },
      data,
    });

    return service;
  }

  async delete(id: string): Promise<void> {
    await prisma.service.delete({
      where: { id },
    });
  }
}
