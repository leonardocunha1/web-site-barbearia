import { FastifyReply, FastifyRequest } from 'fastify';

export async function health(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
