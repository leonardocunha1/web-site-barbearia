/**
 * Common types used across the application
 * Centralized type definitions for better maintainability
 */

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Role = "ADMIN" | "PROFISSIONAL" | "CLIENTE";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  avatar?: string | null;
}

export interface Professional {
  id: string;
  userId: string;
  specialty: string;
  active: boolean;
  avatarUrl?: string | null;
  user?: User;
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  active: boolean;
  defaultPrice?: number;
}

export interface Booking {
  id: string;
  userId: string;
  professionalId: string;
  startDateTime: string;
  endDateTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  notes?: string | null;
  totalAmount: number;
  pointsUsed?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProfessional {
  id: string;
  professionalId: string;
  serviceId: string;
  price: number;
  duration: number;
  service?: Service;
}

/**
 * User profile response from /users/me endpoint
 * Note: This uses English field names as per the backend API (name, phone, role)
 */
export interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role?: "CLIENT" | "PROFESSIONAL" | "ADMIN";
    emailVerified: boolean;
    active: boolean;
    createdAt: string;
  };
}
