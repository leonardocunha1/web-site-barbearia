import { prisma } from '@/lib/prisma';
import { ServiceProfessionalRepository } from '../service-professional-repository';
import { Prisma } from '@prisma/client';

export class PrismaServiceProfessionalRepository
  implements ServiceProfessionalRepository
{
  async create(data: Prisma.ServiceProfessionalCreateInput): Promise<{
    id: string;
    serviceId: string;
    professionalId: string;
    preco: number;
    duracao: number;
  }> {
    const created = await prisma.serviceProfessional.create({
      data,
    });

    return {
      id: created.id,
      serviceId: created.serviceId,
      professionalId: created.professionalId,
      preco: created.preco,
      duracao: created.duracao,
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.serviceProfessional.delete({
      where: { id },
    });
  }

  async findByServiceAndProfessional(
    serviceId: string,
    professionalId: string,
  ): Promise<{
    id: string;
    serviceId: string;
    professionalId: string;
    preco: number;
    duracao: number;
  } | null> {
    const result = await prisma.serviceProfessional.findFirst({
      where: {
        serviceId,
        professionalId,
      },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      serviceId: result.serviceId,
      professionalId: result.professionalId,
      preco: result.preco,
      duracao: result.duracao,
    };
  }
}
