import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createService } from './create';
import { listServices } from './list';
import { getService } from './get';
import { updateService } from './update';
import { deleteService } from './delete';
import { toggleServiceStatus } from './toggle-status';

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
}
