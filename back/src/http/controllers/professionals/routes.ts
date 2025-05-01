import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createProfessional } from './create';
import { updateProfessional } from './update';
import { listProfessionals } from './list';
import { toggleProfessionalStatus } from './toggle-status-ativo';
import { searchProfessionals } from './search-professionals';
import { dashboard } from './get-dashboard';
import { getSchedule } from './get-schedule';
import { FastifyTypedInstance } from '@/types';

export async function professionalsRoutes(app: FastifyTypedInstance) {
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
  app.get(
    '/professionals/dashboard',
    { onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')] },
    dashboard,
  );
  app.get(
    '/professionals/schedule',
    { onRequest: verifyUserRole('PROFISSIONAL') },
    getSchedule,
  );
}
