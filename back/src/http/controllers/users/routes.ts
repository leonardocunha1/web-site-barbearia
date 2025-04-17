import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { registerUser } from './register';
import { authenticate } from './authenticate';
import { logout } from './logout';
import { verifyEmail } from './verify-email';
import { sendVerificationEmail } from './send-verification-email';
import { profile } from './profile';
import { updateProfile } from './update-profile';
import { forgotPassword } from './forgot-password-controller';
import { updatePassword } from './update-password';
import { listUsers } from './list';

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

  // Rota para pegar/atualizar os dados do usuário logado
  app.get('/me', { onRequest: [verifyJwt] }, profile);
  app.patch('/me', { onRequest: [verifyJwt] }, updateProfile);

  app.get(
    '/users',
    { onRequest: [verifyJwt, verifyUserRole('ADMIN')] },
    listUsers,
  );

  app.post('/users/forgot-password', forgotPassword);
  app.post('/users/update-password', updatePassword);
}
