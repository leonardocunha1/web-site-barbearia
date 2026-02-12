import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { profile } from './get';
import { listUsers } from './list';
import { anonymizeUser } from './anonymize';
import { updateProfile } from './update';
import { FastifyTypedInstance } from '@/types';
import { updatePassword } from './update-password';
import {
  anonymizeUserParamsSchema,
  listUsersQuerySchema,
  updatePasswordBodySchema,
  updateProfileBodySchema,
  userSchema,
} from '@/schemas/user';
import { z } from 'zod';

export async function usersRoutes(app: FastifyTypedInstance) {
  app.get(
    '/users/me',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'getUserProfile',
        tags: ['users'],
        description: 'Retorna o perfil do usuário logado.',
        response: {
          200: z.object({
            user: userSchema,
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    profile,
  );

  app.patch(
    '/users/me',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'updateUserProfile',
        tags: ['users'],
        description: 'Atualiza o perfil do usuário logado.',
        body: updateProfileBodySchema,
        response: {
          200: z.null().describe('Usuário atualizado com sucesso.'),
          400: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    updateProfile,
  );

  app.get(
    '/users',
    {
      onRequest: [verifyJwt, verifyUserRole(['ADMIN', 'PROFESSIONAL'])],
      schema: {
        operationId: 'listUsers',
        tags: ['users'],
        description: 'Listar usuários',
        querystring: listUsersQuerySchema,
        response: {
          200: z.object({
            users: z.array(userSchema),
            page: z.number(),
            limit: z.number(),
            total: z.number(),
            totalPages: z.number(),
          }),
          400: z
            .object({
              message: z.string(),
            })
            .describe('Erro de validação dos dados de entrada'),
        },
      },
    },
    listUsers,
  );

  app.patch(
    '/users/:userId/anonymize',
    {
      onRequest: [verifyJwt, verifyUserRole(['ADMIN', 'CLIENT'])],
      schema: {
        operationId: 'anonymizeUser',
        tags: ['users'],
        description: 'Anonimiza um usuário.',
        params: anonymizeUserParamsSchema,
        response: {
          204: z.null().describe('Usuário anonimizado com sucesso.'),
          400: z.object({
            message: z.string(),
          }),
          403: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    anonymizeUser,
  );

  app.patch(
    '/users/update-password',
    {
      onRequest: [verifyJwt],
      schema: {
        operationId: 'updateUserPassword',
        tags: ['users'],
        description: 'Atualiza a senha do usuário logado.',
        body: updatePasswordBodySchema,
        response: {
          200: z.null().describe('Senha atualizada com sucesso.'),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    updatePassword,
  );
}
