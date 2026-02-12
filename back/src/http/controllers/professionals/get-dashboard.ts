import { dashboardQuerySchema } from '@/schemas/profissional';
import { makeProfessionalDashboardUseCase } from '@/use-cases/factories/make-dashboard-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function dashboard(request: FastifyRequest, reply: FastifyReply) {
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
}
