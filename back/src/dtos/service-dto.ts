import { Service } from '@prisma/client';

/**
 * Service Data Transfer Object with professional relations
 * Includes only public user fields (id, nome) for professionals
 * Automatically excludes sensitive information
 */
export type ServiceDTO = Service & {
  professionals: {
    id: string;
    professional: {
      id: string;
      user: {
        id: string;
        name: string;
      };
    };
  }[];
};
