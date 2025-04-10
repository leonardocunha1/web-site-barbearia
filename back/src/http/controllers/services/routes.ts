import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createService } from './create';
import { listServices } from './list-services';
import { getService } from './get-service';

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
  /*
  app.get('/services/professional/:professionalId', listServicesByProfessional); 
  
  app.put(
    '/services/:id',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN', 'PROFISSIONAL')] },
    updateService
  );
  
  app.patch(
    '/services/:id/status',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    toggleServiceStatus
  );
  
  app.delete(
    '/services/:id',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    deleteService
  );
  */
}
