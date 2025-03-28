import { FastifyReply, FastifyRequest } from 'fastify';

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie('refreshToken', { path: '/' })
    .status(200)
    .send({ message: 'Logout realizado com sucesso' });
}
