import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { createHoliday } from './create';
import { deleteHoliday } from './delete';
import { listHolidays } from './list';

export async function holidayRoutes(app: FastifyInstance) {
  // Rota para criar um feriado
  app.post(
    '/holidays',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
    },
    createHoliday,
  );

  // Rota para deletar um feriado
  app.delete(
    '/holidays/:holidayId/:professionalId',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
    },
    deleteHoliday,
  );

  app.get(
    '/holidays',
    {
      onRequest: [verifyJwt],
    },
    listHolidays,
  );
}
