import { z } from 'zod';

export const paginationSchema = z
  .object({
    page: z.coerce
      .number()
      .int('A página deve ser um número inteiro')
      .positive('A página deve ser maior que zero')
      .default(1)
      .describe('Número da página atual (começa em 1)'),

    limit: z.coerce
      .number()
      .int('O limite deve ser um número inteiro')
      .positive('O limite deve ser maior que zero')
      .max(100, 'O limite máximo por página é 100')
      .default(10)
      .describe('Quantidade de itens por página (máximo 100)'),

    sortBy: z.string().optional().describe('Campo para ordenação (opcional)'),

    sortDirection: z
      .enum(['asc', 'desc'])
      .default('asc')
      .describe('Direção da ordenação: asc (crescente) ou desc (decrescente)'),
  })
  .describe('Schema para parâmetros de paginação e ordenação');

// Tipo TypeScript inferido
export type Pagination = z.infer<typeof paginationSchema>;
