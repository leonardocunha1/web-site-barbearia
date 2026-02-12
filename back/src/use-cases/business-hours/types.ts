import { BusinessHours } from '@/repositories/business-hours-repository';
import type {
  CreateBusinessHoursBody,
  UpdateBusinessHoursBody,
  ListBusinessHoursParams,
  DeleteBusinessHoursParams,
} from '@/schemas/business-hours';

/**
 * Create request extends schema validation type with professional ID
 */
export interface CreateBusinessHoursUseCaseRequest extends CreateBusinessHoursBody {
  professionalId: string;
}

/**
 * Update request extends schema validation type with professional ID
 */
export interface UpdateBusinessHoursUseCaseRequest extends UpdateBusinessHoursBody {
  professionalId: string;
  dayOfWeek: number;
}

/**
 * Delete request extends schema params with professional ID for authorization
 */
export interface DeleteBusinessHoursUseCaseRequest extends DeleteBusinessHoursParams {
  professionalId: string;
}

/**
 * List request uses schema params type
 */
export type ListBusinessHoursUseCaseRequest = ListBusinessHoursParams;

export interface ListBusinessHoursUseCaseResponse {
  businessHours: BusinessHours[];
}
