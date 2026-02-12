import { BadRequestError } from './app-error';

export class SamePasswordError extends BadRequestError {
  constructor() {
    super('A nova senha não pode ser igual à senha atual.', 'SAME_PASSWORD');
  }
}
