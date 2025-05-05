import { Service } from '@prisma/client';

export type ServiceDTO = Service & {
  profissionais: {
    id: string;
    professional: {
      id: string;
      user: {
        id: string;
        nome: string;
      };
    };
  }[];
};
