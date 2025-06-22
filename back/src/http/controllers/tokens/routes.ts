import { verifyEmail } from './verify-email';
import { sendVerificationEmail } from './send-verification-email';
import { forgotPassword } from './forgot-password';
import { resetPassword } from './reset-password';
import { FastifyTypedInstance } from '@/types';
import { z } from 'zod';
import {
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  sendVerificationEmailBodySchema,
  verifyEmailQuerySchema,
} from '@/schemas/tokens';

export async function tokenRoutes(app: FastifyTypedInstance) {
  app.get(
    '/users/verify-email',
    {
      schema: {
        operationId: 'verifyUserEmail',
        tags: ['users'],
        description: 'Verifica o e-mail do usuário.',
        querystring: verifyEmailQuerySchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    verifyEmail,
  );

  app.post(
    '/users/send-verification-email',
    {
      schema: {
        operationId: 'sendUserVerificationEmail',
        tags: ['users'],
        description: 'Envia um e-mail de verificação.',
        body: sendVerificationEmailBodySchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    sendVerificationEmail,
  );

  app.post(
    '/users/forgot-password',
    {
      schema: {
        operationId: 'sendForgotPasswordEmail',
        tags: ['users'],
        description: 'Envia um e-mail para redefinição de senha.',
        body: forgotPasswordBodySchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    forgotPassword,
  );

  app.post(
    '/users/reset-password',
    {
      schema: {
        operationId: 'resetUserPassword',
        tags: ['users'],
        description: 'Redefine a senha do usuário.',
        body: resetPasswordBodySchema,
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    resetPassword,
  );
}
