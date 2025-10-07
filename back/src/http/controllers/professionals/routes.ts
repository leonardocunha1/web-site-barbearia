import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createProfessional } from './create';
import { updateProfessional } from './update';
import { listOrSearchProfessionals } from './list-search';
import { toggleProfessionalStatus } from './toggle-status-ativo';
import { dashboard } from './get-dashboard';
import { getSchedule } from './get-schedule';
import { FastifyTypedInstance } from '@/types';
import {
  createProfessionalBodySchema,
  dashboardQuerySchema,
  professionalSchema,
  searchProfessionalsQuerySchema,
  toggleProfessionalStatusParamsSchema,
  updateProfessionalBodySchema,
  updateProfessionalParamsSchema,
} from '@/schemas/profissional';
import { z } from 'zod';
import { dashboardSchema } from '@/schemas/dashboard-schema';
import { getScheduleQuerySchema } from '@/dtos/schedule-dto';

export async function professionalsRoutes(app: FastifyTypedInstance) {
  app.post(
    '/professionals',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'createProfessional',
        tags: ['professionals'],
        body: createProfessionalBodySchema,
        response: {
          201: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    createProfessional,
  );

  app.patch(
    '/professionals/:id',
    {
      onRequest: [verifyJwt, verifyUserRole(['ADMIN', 'PROFISSIONAL'])],
      schema: {
        operationId: 'updateProfessional',
        tags: ['professionals'],
        params: updateProfessionalParamsSchema,
        body: updateProfessionalBodySchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    updateProfessional,
  );

  app.patch(
    '/professionals/:id/status',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'toggleProfessionalStatus',
        tags: ['professionals'],
        params: toggleProfessionalStatusParamsSchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    toggleProfessionalStatus,
  );

  app.get(
    '/professionals',
    {
      schema: {
        operationId: 'listOrSearchProfessionals',
        tags: ['professionals'],
        querystring: searchProfessionalsQuerySchema,
        response: {
          200: z.object({
            professionals: z.array(professionalSchema),
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            totalPages: z.number(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    listOrSearchProfessionals,
  );

  // Dashboard do próprio profissional logado
  app.get(
    '/me/professional/dashboard',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        operationId: 'getProfessionalDashboard',
        tags: ['professionals'],
        querystring: dashboardQuerySchema,
        response: {
          200: dashboardSchema,
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    dashboard,
  );

  // Agenda do próprio profissional logado
  app.get(
    '/me/professional/schedule',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        operationId: 'getProfessionalSchedule',
        tags: ['professionals'],
        querystring: getScheduleQuerySchema,
        response: {
          200: z.object({
            date: z.string(),
            timeSlots: z.array(
              z.object({
                time: z.string(), // Formato "HH:MM"
                available: z.boolean(),
                booking: z
                  .object({
                    id: z.string(),
                    clientName: z.string(),
                    services: z.array(z.string()),
                  })
                  .optional(),
              }),
            ),
            businessHours: z.object({
              openAt: z.string(),
              closeAt: z.string(),
              breakStart: z.string().optional(),
              breakEnd: z.string().optional(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getSchedule,
  );
}
