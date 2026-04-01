import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    if (request.user.tokenType !== 'access') {
      return reply.status(401).send({ message: 'Sem autorização.' });
    }
  } catch (err) {
    return reply.status(401).send({ message: 'Sem autorização.' });
  }
}
