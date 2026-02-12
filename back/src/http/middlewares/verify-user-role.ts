import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(
  rolesToVerify: 'ADMIN' | 'CLIENT' | 'PROFESSIONAL' | Array<'ADMIN' | 'CLIENT' | 'PROFESSIONAL'>,
) {
  const rolesArray = Array.isArray(rolesToVerify) ? rolesToVerify : [rolesToVerify];

  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ message: 'Acesso negado. Você não está logado.' });
    }

    const { role } = request.user;

    if (!rolesArray.includes(role)) {
      return reply.status(403).send({ message: 'Acesso negado. Permissão insuficiente.' });
    }
  };
}
