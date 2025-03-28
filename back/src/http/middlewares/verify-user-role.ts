import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(
  roleToVerify: 'ADMIN' | 'CLIENTE' | 'PROFISSIONAL',
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply
        .status(401)
        .send({ message: 'Acesso negado. Você não está logado.' });
    }

    const { role } = request.user;

    if (role !== roleToVerify) {
      return reply
        .status(401)
        .send({ message: 'Acesso negado, você não tem permissão para isso' });
    }
  };
}
