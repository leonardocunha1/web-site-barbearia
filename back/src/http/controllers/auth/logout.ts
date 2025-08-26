import { FastifyReply, FastifyRequest } from 'fastify';

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .clearCookie('accessToken', {   // <-- limpa o accessToken também
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .send({ message: 'Logout realizado com sucesso' });
}
