import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { registerUser } from './register';
import { authenticate } from './authenticate';
import { logout } from './logout';
import { verifyEmail } from './verify-email';
import { sendVerificationEmail } from './send-verification-email';
import { profile } from './profile';

export async function usersRoutes(app: FastifyInstance) {
  // Rota pública para registro de clientes
  app.post('/users', registerUser);

  // Rota protegida para registro de administradores
  app.post(
    '/users/admin',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
    },
    registerUser,
  );

  // Rotas de autenticação
  app.post('/sessions', authenticate);

  // Rota de logout
  app.post('/logout', logout);

  // Rota de verificação de e-mail
  app.get('/users/verify-email', verifyEmail);
  app.post('/users/send-verification-email', sendVerificationEmail);

  app.get('/me', { onRequest: [verifyJwt] }, profile);
}
