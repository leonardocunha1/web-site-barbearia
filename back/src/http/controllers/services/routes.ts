import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createService } from './create';
import { listServices } from './list';
import { getService } from './get';
import { updateService } from './update';
import { deleteService } from './delete';
import { toggleServiceStatus } from './toggle-status';
import { addToProfessional } from './add-to-professional';
import { removeFromProfessional } from './remove-from-professional';
import { listProfessionalServices } from './professionals-services';

export async function servicesRoutes(app: FastifyInstance) {
  app.post(
    '/services',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
    },
    createService,
  );

  app.get('/services', listServices);
  app.get('/services/:id', getService);

  app.put(
    '/services/:id',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    updateService,
  );

  app.delete(
    '/services/:id',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    deleteService,
  );

  app.patch(
    '/services/:id/status',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    toggleServiceStatus,
  );

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
