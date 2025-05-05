import { InvalidLimitError } from '@/use-cases/errors/invalid-limit-error';
import { InvalidPageError } from '@/use-cases/errors/invalid-page-error';

export function validatePagination(page: unknown, limit: unknown) {
  if (typeof page !== 'number' || page < 1) {
    throw new InvalidPageError();
  }

  if (typeof limit !== 'number' || limit < 1 || limit > 100) {
    throw new InvalidLimitError();
  }
}
