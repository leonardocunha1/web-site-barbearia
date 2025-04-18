import { FastifyInstance } from 'fastify';
import { verifyEmail } from './verify-email';
import { sendVerificationEmail } from './send-verification-email';
import { forgotPassword } from './forgot-password';
import { resetPassword } from './reset-password';

export async function tokenRoutes(app: FastifyInstance) {
  app.get('/users/verify-email', verifyEmail);
  app.post('/users/send-verification-email', sendVerificationEmail);
  app.post('/users/forgot-password', forgotPassword);
  app.post('/users/reset-password', resetPassword);
}
