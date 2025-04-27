import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { registerUser } from './register';
import { authenticate } from './authenticate';
import { logout } from './logout';
import { refresh } from './refresh';

export async function authRoutes(app: FastifyInstance) {
  app.post('/users', registerUser);

  app.post(
    '/users/admin',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
    },
    registerUser,
  );

  app.post('/sessions', authenticate);
  app.post('/logout', logout);

  app.post('/token/refresh', refresh);
}
