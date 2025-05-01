export const ZodErrorResponse = {
  description: 'Erro de validação dos dados.',
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Erro na validação dos dados',
    },
    issues: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          _errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Erro de validação no campo.'],
          },
        },
      },
      example: {
        email: { _errors: ['Email inválido'] },
        senha: { _errors: ['Senha deve conter no mínimo 6 caracteres'] },
      },
    },
  },
};
