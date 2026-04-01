import { usersRepository } from '@/repositories/prisma/instances';
import { makeSendVerificationEmailUseCase } from './make-send-verification-email-use-case';
import { RegisterUserUseCase } from '../users/register-use-case';
import { traceUseCase } from '@/observability/use-case-trace';

export function makeRegisterUserUseCase() {
  const sendVerificationEmailUseCase = makeSendVerificationEmailUseCase();

  const registerUserUseCase = new RegisterUserUseCase({
    usersRepository,
    sendVerificationEmail: (email) => sendVerificationEmailUseCase.execute({ email }),
  });

  return traceUseCase('user.register', registerUserUseCase);
}
