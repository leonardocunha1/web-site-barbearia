import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { profile } from './profile';
import { listUsers } from './list';
import { anonymizeUser } from './anonymize';
import { updateProfile } from './update';

export async function usersRoutes(app: FastifyInstance) {
  app.get('/me', { onRequest: [verifyJwt] }, profile);
  app.patch('/me', { onRequest: [verifyJwt] }, updateProfile);

  app.get(
    '/users',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    listUsers,
  );

  app.patch(
    '/users/:userId/anonymize',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    anonymizeUser,
  );
}
