import type {
  CreateProfessionalBody,
  UpdateProfessionalBody,
  ListProfessionalsQuery,
} from '@/schemas/profissional';
import { ListProfessionalsResponse } from '@/dtos/professional-dto';

/**
 * Use-case types for professional module.
 * These types leverage Zod schema types where possible, reducing code duplication.
 */

/**
 * Reuses schema validation type directly (no type conversion needed)
 */
export type CreateProfessionalUseCaseRequest = CreateProfessionalBody;

/**
 * Update professional extends schema validation with ID param
 */
export interface UpdateProfessionalUseCaseRequest extends UpdateProfessionalBody {
  id: string;
}

/**
 * List/search professionals reuses schema query params
 */
export type ListOrSearchProfessionalsUseCaseRequest = ListProfessionalsQuery & {
  query?: string; // Additional query param for search
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

export type ListOrSearchProfessionalsUseCaseResponse = ListProfessionalsResponse;
