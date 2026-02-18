import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { TokenService } from '@/services/token-service';
import { loginUserSchema } from '@/schemas/user';
import { UserDTO } from '@/dtos/user-dto';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginUserSchema.parse(request.body);
  const authenticateUseCase = makeAuthenticateUseCase();
  const { user, professionalId } = await authenticateUseCase.execute({ email, password });
  console.log('Usuário autenticado:', user);
  const tokenService = new TokenService(reply);
  const { token, refreshToken } = await tokenService.generateTokens({
    id: user.id,
    role: user.role,
    professionalId,
  });
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', professionalId)

  const userWithoutPassword: UserDTO = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    phone: user.phone,
    emailVerified: user.emailVerified,
    active: user.active,
  };

  return tokenService
    .setAuthCookies(token, refreshToken)
    .status(200)
    .send({ token, refreshToken, user: userWithoutPassword });
}
