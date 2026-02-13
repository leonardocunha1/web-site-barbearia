import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeAdminDashboardUseCase } from '@/use-cases/factories/make-admin-dashboard-use-case';

export async function dashboard(_request: FastifyRequest, reply: FastifyReply) {
  const getDashboard = makeAdminDashboardUseCase();
  const dashboard = await getDashboard.execute();
  return reply.status(200).send(dashboard);
}
