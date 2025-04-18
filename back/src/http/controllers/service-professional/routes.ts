import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { addToProfessional } from './add-to-professional-service';
import { removeFromProfessional } from './remove-from-professional-service';
import { listProfessionalServices } from './list-professionals-services';

export async function serviceProfessionalRoutes(app: FastifyInstance) {
  app.post(
    '/services/add-to-professional',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    addToProfessional,
  );

  app.delete(
    '/services/remove-from-professional',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    removeFromProfessional,
  );

  app.get('/professionals/:professionalId/services', listProfessionalServices);
}
