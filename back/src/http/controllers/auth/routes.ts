import { registerUser } from './register';
import { authenticate } from './authenticate';
import { logout } from './logout';
import { refresh } from './refresh';
import { FastifyTypedInstance } from '@/types';
import {
  loginUserSchema,
  registerUserSchema,
  userSchema,
} from '@/schemas/user';
import { InsufficientPermissionsError } from '@/use-cases/errors/insufficient-permissions-error';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { z } from 'zod';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';

export async function authRoutes(app: FastifyTypedInstance) {
  app.post(
    '/auth/register',
    {
      schema: {
        operationId: 'registerUser',
        tags: ['auth'],
        description: 'Registro de novo usuário.',
        body: registerUserSchema,
        response: {
          201: z.null().describe('Usuário criado com sucesso.'),
          400: z
            .object({
              message: z.string(),
            })
            .describe('Erro de validação dos dados de entrada'),
          409: z
            .object({
              message: z.string(),
            })
            .describe(new UserAlreadyExistsError().message),
          403: z
            .object({
              message: z.string(),
            })
            .describe(new InsufficientPermissionsError().message),
        },
      },
    },
    registerUser,
  );

  app.post(
    '/auth/login',
    {
      schema: {
        operationId: 'loginUser',
        tags: ['auth'],
        description: 'Autenticação do usuário.',
        body: loginUserSchema,
        response: {
          200: z
            .object({
              token: z.string(),
              user: userSchema,
            })
            .describe('Login bem-sucedido'),
          400: z
            .object({
              message: z.string(),
            })
            .describe('Erro de validação dos dados de entrada'),
          401: z
            .object({
              message: z.string(),
            })
            .describe(new InvalidCredentialsError().message),
          403: z
            .object({
              message: z.string(),
            })
            .describe('Conta desativada ou email não verificado'),
        },
      },
    },
    authenticate,
  );

  app.post(
    '/auth/logout',
    {
      schema: {
        operationId: 'logoutUser',
        tags: ['auth'],
        description: 'Logout do usuário, removendo cookies de autenticação.',
        response: {
          200: z
            .object({
              message: z.string(),
            })
            .describe('Logout realizado com sucesso.'),
        },
      },
    },
    logout,
  );

  app.post(
    '/auth/refresh-token',
    {
      schema: {
        operationId: 'refreshToken',
        tags: ['auth'],
        description:
          'Geração de um novo token de acesso com base no refresh token válido presente nos cookies.',
        response: {
          200: z
            .object({
              token: z.string(),
            })
            .describe('Novo token gerado com sucesso.'),
          401: z
            .object({
              message: z.string(),
            })
            .describe('Refresh token ausente ou inválido.'),
        },
      },
    },
    refresh,
  );
}
