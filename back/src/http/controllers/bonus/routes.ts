import { verifyJwt } from '@/http/middlewares/verify-jwt';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { FastifyTypedInstance } from '@/types';
import { assignBonus } from './assign-bonus';
import { z } from 'zod';
import { assignBonusBodySchema } from '@/schemas/bonus';
import { getBalance } from './get-balance';

export async function bonusRoutes(app: FastifyTypedInstance) {
  app.post(
    '/bonus/assign',
    {
      onRequest: [verifyJwt, verifyUserRole('PROFISSIONAL')],
      schema: {
        tags: ['bonus'],
        description: 'Atribuir bônus a um usuário.',
        body: assignBonusBodySchema,
        response: {
          201: z.null().describe('Bônus atribuído com sucesso.'),
          400: z.object({ message: z.string() }).describe('Erro de validação'),
          404: z
            .object({ message: z.string() })
            .describe('Recurso não encontrado'),
        },
      },
    },
    assignBonus,
  );

  app.get(
    '/bonus/balance',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['bonus'],
        description:
          'Obter o saldo de bônus (pontos e valor em R$) do usuário autenticado.',
        response: {
          200: z.object({
            points: z.object({
              bookingPoints: z.number(),
              loyaltyPoints: z.number(),
              totalPoints: z.number(),
            }),
            monetaryValue: z.object({
              bookingValue: z.number(),
              loyaltyValue: z.number(),
              totalValue: z.number(),
            }),
          }),
          401: z.object({ message: z.string() }).describe('Não autorizado'),
          404: z
            .object({ message: z.string() })
            .describe('Usuário não encontrado'),
        },
      },
    },
    getBalance,
  );
}
