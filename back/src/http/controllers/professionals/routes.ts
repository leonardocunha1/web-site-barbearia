import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createProfessional } from './create';
import { updateProfessional } from './update';
import { listProfessionals } from './list';
import { toggleProfessionalStatus } from './toggle-status-ativo';
import { searchProfessionals } from './search-professionals';

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
  app.get('/professionals', { onRequest: [verifyJwt] }, listProfessionals);
  app.patch(
    '/professionals/:id/toggle-status',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    toggleProfessionalStatus,
  );
  app.get(
    '/professionals/search',
    { onRequest: [verifyJwt] },
    searchProfessionals,
  );
}
