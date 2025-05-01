import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createBusinessHours } from './create';
import { updateBusinessHours } from './update';
import { FastifyTypedInstance } from '@/types';

export async function businessHoursRoutes(app: FastifyTypedInstance) {
  // Rota para criar horários de funcionamento
  app.post(
    '/business-hours',
    {
      onRequest: [verifyJwt, verifyUserRole(['ADMIN', 'PROFISSIONAL'])],
    },
    createBusinessHours,
  );

  // Rota para atualizar horários de funcionamento
  app.put(
    '/business-hours/:professionalId',
    {
      onRequest: [verifyJwt, verifyUserRole(['ADMIN', 'PROFISSIONAL'])],
    },
    updateBusinessHours,
  );
}
