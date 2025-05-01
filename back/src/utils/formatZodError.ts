import { ZodError } from 'zod';

export function formatZodError(error: ZodError) {
  return {
    message: 'Erro na validação dos dados',
    issues: error.format(),
  };
}
