import { Prisma } from '@prisma/client';

export type BusinessHours = {
  id: string;
  professionalId: string;
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  breakStart: string | null;
  breakEnd: string | null;
  active: boolean;
};

export interface IBusinessHoursRepository {
  findById(id: string): Promise<BusinessHours | null>;
  delete(id: string): Promise<void>;
  findByProfessionalAndDay(
    professionalId: string,
    dayOfWeek: number,
  ): Promise<BusinessHours | null>;
  create(data: Prisma.BusinessHoursCreateInput): Promise<BusinessHours>;
  update(id: string, date: Prisma.BusinessHoursUpdateInput): Promise<BusinessHours>;
  listByProfessional(professionalId: string): Promise<BusinessHours[]>;
}
