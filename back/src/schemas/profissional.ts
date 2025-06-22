import { z } from 'zod';
import { paginationSchema } from './pagination';

// Regex patterns for common validations
const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

export const professionalSchema = z.object({
  id: z.string()
    .uuid()
    .describe('Unique identifier for the professional'),
    
  especialidade: z.string()
    .min(3, 'Specialty must be at least 3 characters')
    .describe('Professional specialty'),
    
  bio: z.string()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional()
    .describe('Professional biography'),
    
  avatarUrl: z.string()
    .regex(urlRegex, 'Invalid URL format')
    .optional()
    .describe('URL to professional avatar image'),
    
  ativo: z.coerce.boolean()
    .describe('Whether the professional is active'),
    
  user: z.object({
    id: z.string().uuid().describe('User ID'),
    nome: z.string().min(2).describe('User full name'),
    email: z.string().email().describe('User email address'),
    telefone: z.string()
      .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format')
      .nullable()
      .optional()
      .describe('User phone number'),
  }).describe('User account details'),
  
  services: z.array(
    z.object({
      id: z.string().uuid().describe('Service ID'),
      nome: z.string().min(2).describe('Service name'),
      descricao: z.string()
        .max(200, 'Description cannot exceed 200 characters')
        .optional()
        .describe('Service description'),
    })
  ).describe('List of services offered by the professional'),
}).describe("Complete professional profile with user details and services");

// Search professionals with pagination
export const searchProfessionalsQuerySchema = paginationSchema.extend({
  query: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .describe('Search term for professionals'),
    
  ativo: z.coerce.boolean()
    .optional()
    .default(true)
    .describe('Filter by active status (default: true)'),
}).describe("Search professionals with pagination parameters");

// List professionals with filters
export const listProfessionalsQuerySchema = paginationSchema.extend({
  query: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .optional()
    .describe('Optional search term'),
    
  especialidade: z.string()
    .optional()
    .describe('Filter by professional specialty'),
    
  ativo: z.coerce.boolean()
    .optional()
    .describe('Filter by active status'),
}).describe("List professionals with filtering and pagination");

// Professional status toggle
export const toggleProfessionalStatusParamsSchema = z.object({
  id: z.string()
    .uuid()
    .describe('Professional ID to toggle status'),
}).describe("Parameters for toggling professional status");

// Update professional parameters
export const updateProfessionalParamsSchema = z.object({
  id: z.string()
    .uuid()
    .describe('Professional ID to update'),
}).describe("Parameters for updating professional");

// Update professional body
export const updateProfessionalBodySchema = z.object({
  especialidade: z.string()
    .min(3, 'Specialty must be at least 3 characters')
    .optional()
    .describe('Updated professional specialty'),
    
  bio: z.string()
    .nullable()
    .optional()
    .describe('Updated professional biography'),
    
  documento: z.string()
    .nullable()
    .optional()
    .describe('Professional document number'),
    
  registro: z.string()
    .nullable()
    .optional()
    .describe('Professional registration number'),
    
  ativo: z.boolean()
    .optional()
    .describe('Set professional active status'),
    
  avatarUrl: z.string()
    .regex(urlRegex, 'Invalid URL format')
    .nullable()
    .optional()
    .describe('Updated avatar URL'),
}).describe("Professional profile update payload");

// Create professional body
export const createProfessionalBodySchema = z.object({
  userId: z.string()
    .uuid()
    .describe('Existing user ID to associate with professional'),
    
  especialidade: z.string()
    .min(3, 'Specialty must be at least 3 characters')
    .describe('Professional specialty'),
    
  bio: z.string()
    .optional()
    .describe('Professional biography'),
    
  documento: z.string()
    .optional()
    .describe('Professional document number'),
    
  registro: z.string()
    .optional()
    .describe('Professional registration number'),
    
  avatarUrl: z.string()
    .regex(urlRegex, 'Invalid URL format')
    .optional()
    .describe('Professional avatar URL'),
}).describe("Payload for creating new professional");

// Dashboard analytics query
export const dashboardQuerySchema = z.object({
  range: z.enum(['today', 'week', 'month', 'custom'])
    .describe('Time range for analytics'),
    
  startDate: z.string()
    .datetime({ offset: true })
    .optional()
    .describe('Custom start date (required for custom range)'),
    
  endDate: z.string()
    .datetime({ offset: true })
    .optional()
    .describe('Custom end date (required for custom range)'),
}).refine(data => {
  if (data.range === 'custom') {
    return data.startDate && data.endDate;
  }
  return true;
}, {
  message: 'Both startDate and endDate are required for custom range',
  path: ['startDate', 'endDate'],
}).describe("Parameters for dashboard analytics");

// Export inferred TypeScript types
export type Professional = z.infer<typeof professionalSchema>;
export type SearchProfessionalsQuery = z.infer<typeof searchProfessionalsQuerySchema>;
export type ListProfessionalsQuery = z.infer<typeof listProfessionalsQuerySchema>;
export type ToggleProfessionalStatusParams = z.infer<typeof toggleProfessionalStatusParamsSchema>;
export type UpdateProfessionalParams = z.infer<typeof updateProfessionalParamsSchema>;
export type UpdateProfessionalBody = z.infer<typeof updateProfessionalBodySchema>;
export type CreateProfessionalBody = z.infer<typeof createProfessionalBodySchema>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;