import { z } from 'zod';
import { paginationSchema } from './pagination';

// Padrões Regex para validações comuns
const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

export const professionalSchema = z.object({
  id: z.string()
    .uuid({ message: 'ID deve ser um UUID válido' })
    .describe('Identificador único do profissional'),
    
  especialidade: z.string()
    .min(3, { message: 'A especialidade deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'A especialidade não pode exceder 100 caracteres' })
    .describe('Especialidade do profissional'),
    
  bio: z.string()
    .max(500, { message: 'A biografia não pode exceder 500 caracteres' })
    .optional()
    .describe('Biografia do profissional'),
    
  avatarUrl: z.string()
    .regex(urlRegex, { message: 'Formato de URL inválido' })
    .optional()
    .describe('URL da imagem de avatar do profissional'),
    
  ativo: z.coerce.boolean()
    .describe('Indica se o profissional está ativo'),
    
  user: z.object({
    id: z.string()
      .uuid({ message: 'ID do usuário deve ser um UUID válido' })
      .describe('ID do usuário'),
    nome: z.string()
      .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
      .describe('Nome completo do usuário'),
    email: z.string()
      .email({ message: 'E-mail inválido' })
      .describe('Endereço de e-mail do usuário'),
    telefone: z.string()
      .regex(/^\+?[0-9]{10,15}$/, { message: 'Formato de telefone inválido' })
      .nullable()
      .optional()
      .describe('Número de telefone do usuário'),
  }).describe('Detalhes da conta do usuário'),
  
  services: z.array(
    z.object({
      id: z.string()
        .uuid({ message: 'ID do serviço deve ser um UUID válido' })
        .describe('ID do serviço'),
      nome: z.string()
        .min(2, { message: 'O nome do serviço deve ter pelo menos 2 caracteres' })
        .describe('Nome do serviço'),
      descricao: z.string()
        .max(200, { message: 'A descrição não pode exceder 200 caracteres' })
        .optional()
        .describe('Descrição do serviço'),
    })
  ).describe('Lista de serviços oferecidos pelo profissional'),
}).describe("Perfil completo do profissional com detalhes do usuário e serviços");

// Buscar profissionais com paginação
export const searchProfessionalsQuerySchema = paginationSchema.extend({
  query: z.string()
    .min(2, { message: 'A busca deve ter pelo menos 2 caracteres' })
    .describe('Termo de busca para profissionais'),
    
  ativo: z.coerce.boolean({
    invalid_type_error: 'O status ativo deve ser verdadeiro ou falso'
  })
  .optional()
  .default(true)
  .describe('Filtrar por status ativo (padrão: verdadeiro)'),
}).describe("Busca de profissionais com parâmetros de paginação");

// Listar profissionais com filtros
export const listProfessionalsQuerySchema = paginationSchema.extend({
  query: z.string()
    .min(2, { message: 'A busca deve ter pelo menos 2 caracteres' })
    .optional()
    .describe('Termo de busca opcional'),
    
  especialidade: z.string()
    .optional()
    .describe('Filtrar por especialidade do profissional'),
    
  ativo: z.coerce.boolean({
    invalid_type_error: 'O status ativo deve ser verdadeiro ou falso'
  })
  .optional()
  .describe('Filtrar por status ativo'),
}).describe("Listagem de profissionais com filtros e paginação");

// Alternar status do profissional
export const toggleProfessionalStatusParamsSchema = z.object({
  id: z.string()
    .uuid({ message: 'ID do profissional deve ser um UUID válido' })
    .describe('ID do profissional para alternar status'),
}).describe("Parâmetros para alternar status do profissional");

// Parâmetros para atualizar profissional
export const updateProfessionalParamsSchema = z.object({
  id: z.string()
    .uuid({ message: 'ID do profissional deve ser um UUID válido' })
    .describe('ID do profissional para atualização'),
}).describe("Parâmetros para atualização do profissional");

// Corpo para atualizar profissional
export const updateProfessionalBodySchema = z.object({
  especialidade: z.string()
    .min(3, { message: 'A especialidade deve ter pelo menos 3 caracteres' })
    .optional()
    .describe('Especialidade atualizada do profissional'),
    
  bio: z.string()
    .nullable()
    .optional()
    .describe('Biografia atualizada do profissional'),
    
  documento: z.string()
    .nullable()
    .optional()
    .describe('Número do documento profissional'),
    
  registro: z.string()
    .nullable()
    .optional()
    .describe('Número de registro profissional'),
    
  ativo: z.boolean()
    .optional()
    .describe('Definir status ativo do profissional'),
    
  avatarUrl: z.string()
    .regex(urlRegex, { message: 'Formato de URL inválido' })
    .nullable()
    .optional()
    .describe('URL do avatar atualizado'),
}).describe("Dados para atualização do perfil profissional");

// Corpo para criar profissional
export const createProfessionalBodySchema = z.object({
  userId: z.string()
    .uuid({ message: 'ID do usuário deve ser um UUID válido' })
    .describe('ID do usuário existente para associar ao profissional'),
    
  especialidade: z.string()
    .min(3, { message: 'A especialidade deve ter pelo menos 3 caracteres' })
    .describe('Especialidade do profissional'),
    
  bio: z.string()
    .optional()
    .describe('Biografia do profissional'),
    
  documento: z.string()
    .optional()
    .describe('Número do documento profissional'),
    
  registro: z.string()
    .optional()
    .describe('Número de registro profissional'),
    
  avatarUrl: z.string()
    .regex(urlRegex, { message: 'Formato de URL inválido' })
    .optional()
    .describe('URL do avatar do profissional'),
}).describe("Dados para criação de novo profissional");

// Consulta para dashboard analítico
export const dashboardQuerySchema = z.object({
  range: z.enum(['today', 'week', 'month', 'custom'], {
    errorMap: () => ({ message: 'O período deve ser: today, week, month ou custom' })
  })
  .describe('Período de tempo para análise'),
    
  startDate: z.string()
    .datetime({ offset: true, message: 'Data de início inválida' })
    .optional()
    .describe('Data de início personalizada (obrigatória para período custom)'),
    
  endDate: z.string()
    .datetime({ offset: true, message: 'Data de término inválida' })
    .optional()
    .describe('Data de término personalizada (obrigatória para período custom)'),
}).refine(data => {
  if (data.range === 'custom') {
    return data.startDate && data.endDate;
  }
  return true;
}, {
  message: 'Ambas as datas (início e término) são obrigatórias para período customizado',
  path: ['startDate', 'endDate'],
}).describe("Parâmetros para análise do dashboard");

// Exportar tipos TypeScript inferidos
export type Professional = z.infer<typeof professionalSchema>;
export type SearchProfessionalsQuery = z.infer<typeof searchProfessionalsQuerySchema>;
export type ListProfessionalsQuery = z.infer<typeof listProfessionalsQuerySchema>;
export type ToggleProfessionalStatusParams = z.infer<typeof toggleProfessionalStatusParamsSchema>;
export type UpdateProfessionalParams = z.infer<typeof updateProfessionalParamsSchema>;
export type UpdateProfessionalBody = z.infer<typeof updateProfessionalBodySchema>;
export type CreateProfessionalBody = z.infer<typeof createProfessionalBodySchema>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;