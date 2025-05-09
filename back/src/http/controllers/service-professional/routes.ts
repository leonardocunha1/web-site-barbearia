import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { removeFromProfessional } from './remove-from-professional-service';
import { listProfessionalServices } from './list-professional-services';
import { FastifyTypedInstance } from '@/types';
import {
  addServiceToProfessionalBodySchema,
  listProfessionalServicesParamsSchema,
  listProfessionalServicesQuerySchema,
  removeServiceFromProfessionalParamsSchema,
  servicesSchema,
  updateServiceProfessionalBodySchema,
  updateServiceProfessionalParamsSchema,
} from '@/schemas/services';
import { z } from 'zod';
import { updateServiceProfessional } from './update-service-professional';
import { addToProfessional } from './add-to-professional-service';

export async function serviceProfessionalRoutes(app: FastifyTypedInstance) {
  app.post(
    '/professionals/:professionalId/services',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['service-professional'],
        body: addServiceToProfessionalBodySchema,
        params: listProfessionalServicesParamsSchema,
        response: {
          201: z.null().describe('Serviço adicionado com sucesso.'),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    addToProfessional,
  );

  app.delete(
    '/professionals/:professionalId/services/:serviceId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['service-professional'],
        params: removeServiceFromProfessionalParamsSchema,
        response: {
          204: z.null().describe('Serviço removido com sucesso.'),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    removeFromProfessional,
  );

  app.get(
    '/professionals/:professionalId/services',
    {
      schema: {
        tags: ['service-professional'],
        params: listProfessionalServicesParamsSchema,
        query: listProfessionalServicesQuerySchema,
        response: {
          200: z.object({
            services: z.array(servicesSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              totalPages: z.number(),
              total: z.number(),
            }),
          }),
          400: z.object({ message: z.string() }).describe('Erro de validação'),
        },
      },
    },
    listProfessionalServices,
  );

  app.put(
    '/professionals/:professionalId/services/:serviceId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['service-professional'],
        body: updateServiceProfessionalBodySchema,
        params: updateServiceProfessionalParamsSchema,
        response: {
          204: z.null().describe('Serviço atualizado com sucesso.'),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    updateServiceProfessional,
  );
}
