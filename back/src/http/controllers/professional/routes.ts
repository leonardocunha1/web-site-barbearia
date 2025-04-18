import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createProfessional } from './create';
import { updateProfessional } from './update';

export async function professionalsRoutes(app: FastifyInstance) {
  app.post(
    '/professionals',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    createProfessional,
  );
  app.patch(
    '/professionals/:id',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    updateProfessional,
  );
}
