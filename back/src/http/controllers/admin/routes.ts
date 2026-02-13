import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import type { FastifyTypedInstance } from '@/types';
import { z } from 'zod';
import { adminDashboardSchema } from '@/schemas/admin-dashboard-schema';
import { dashboard } from './get-dashboard';

export async function adminRoutes(app: FastifyTypedInstance) {
  app.get(
    '/admin/dashboard',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        operationId: 'getAdminDashboard',
        tags: ['admin'],
        response: {
          200: adminDashboardSchema,
          400: z.object({ message: z.string() }),
        },
      },
    },
    dashboard,
  );
}
