import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { register } from './register';
import { registerAdmin } from './register-admin';
import { authenticate } from './authenticate';
import { logout } from './logout';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/user', register);
  app.post(
    '/user/admin',
    { onRequest: [verifyUserRole('ADMIN'), verifyJwt] },
    registerAdmin,
  );

  app.post('/sessions', authenticate);
  app.post('/logout', logout);
}
