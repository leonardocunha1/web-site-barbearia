"use server";

import { zodlistProfessionalServicesResponse } from "@/api";
import apiError from "@/shared/services/api-error";
import { SERVICE_PROFESSIONALS_GET } from "@/shared/services/api-services-professional";


export async function servicesProfessionalGet(
  professionalId: string,
  query?: { page?: number; limit?: number; activeOnly?: boolean }
) {
  try {
    const { url, options } = SERVICE_PROFESSIONALS_GET(professionalId, query);
    
    const response = await fetch(url, { 
      ...options, 
      cache: "no-store" 
    });

    if (!response.ok) {
      return {
        data: null,
        ok: false,
        error: `Erro ${response.status}: ${response.statusText}`,
      };
    }

    const json = await response.json();
    const data = zodlistProfessionalServicesResponse.parse(json);

    return { data, ok: true, error: "" };
  } catch (error) {
    return apiError(error);
  }
}

