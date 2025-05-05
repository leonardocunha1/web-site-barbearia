import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createService } from './create';
import { listServices } from './list';
import { getService } from './get';
import { updateService } from './update';
import { deleteService } from './delete';
import { toggleServiceStatus } from './toggle-status-ativo';
import { FastifyTypedInstance } from '@/types';
import {
  createServiceBodySchema,
  deleteServiceQuerySchema,
  listServicesQuerySchema,
  serviceSchemaWithProfessional,
  servicesSchema,
  updateServiceBodySchema,
  updateServiceParamsSchema,
} from '@/schemas/services';
import { z } from 'zod';

export async function servicesRoutes(app: FastifyTypedInstance) {
  app.post(
    '/services',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['services'],
        body: createServiceBodySchema,
        response: {
          201: z.null().describe('Serviço criado com sucesso.'),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          403: z
            .object({ message: z.string() })
            .describe('Permissão insuficiente.'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado.'),
        },
      },
    },
    createService,
  );

  app.get(
    '/services',
    {
      schema: {
        tags: ['services'],
        querystring: listServicesQuerySchema,
        response: {
          200: z.object({
            services: z.array(servicesSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado.'),
        },
      },
    },
    listServices,
  );

  app.get(
    '/services/:id',
    {
      schema: {
        tags: ['services'],
        params: updateServiceParamsSchema,
        response: {
          200: z.object({
            service: serviceSchemaWithProfessional,
          }),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado.'),
        },
      },
    },
    getService,
  );

  app.put(
    '/services/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['services'],
        params: updateServiceParamsSchema,
        body: updateServiceBodySchema,
        response: {
          200: z.object({
            service: servicesSchema,
          }),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado.'),
        },
      },
    },
    updateService,
  );

  app.delete(
    '/services/:id',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['services'],
        params: updateServiceParamsSchema,
        querystring: deleteServiceQuerySchema,
        response: {
          204: z.null().describe('Serviço excluído com sucesso.'),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado.'),
        },
      },
    },
    deleteService,
  );

  app.patch(
    '/services/:id/status',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        tags: ['services'],
        params: updateServiceParamsSchema,
        response: {
          200: z.null().describe('Status do serviço atualizado com sucesso.'),
          400: z
            .object({ message: z.string() })
            .describe('Erro de validação dos dados'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado.'),
        },
      },
    },
    toggleServiceStatus,
  );
}
