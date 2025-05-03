export class InvalidPageRangeError extends Error {
  constructor(
    message = 'A página solicitada está fora do intervalo permitido.',
  ) {
    super(message);
    this.name = 'InvalidPageRangeError';
  }
}
