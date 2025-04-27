import { ProfessionalNotFoundError } from '@/use-cases/errors/professional-not-found-error';
import { makeProfessionalDashboardUseCase } from '@/use-cases/factories/make-dashboard-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const dashboardQuerySchema = z.object({
  range: z.enum(['today', 'week', 'month', 'custom']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export async function dashboard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { range, startDate, endDate } = dashboardQuerySchema.parse(
      request.query,
    );

    const getDashboard = makeProfessionalDashboardUseCase();
    const dashboard = await getDashboard.execute(request.user.sub, {
      range,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return reply.status(200).send(dashboard);
  } catch (error) {
    if (error instanceof ProfessionalNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: 'Erro na validação dos dados de entrada',
        issues: error.format(),
      });
    }

    throw error;
  }
}
