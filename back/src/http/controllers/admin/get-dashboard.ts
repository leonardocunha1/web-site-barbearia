import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeAdminDashboardUseCase } from '@/use-cases/factories/make-admin-dashboard-use-case';
import { dashboardQuerySchema } from '@/schemas/admin';

export async function dashboard(request: FastifyRequest, reply: FastifyReply) {
  const { range, startDate, endDate } = dashboardQuerySchema.parse(request.query);

  const getDashboard = makeAdminDashboardUseCase();
  const dashboard = await getDashboard.execute({
    range,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  });
  return reply.status(200).send(dashboard);
}
