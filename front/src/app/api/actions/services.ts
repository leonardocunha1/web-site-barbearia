"use server";

import { zodlistServicesResponse } from "@/api"; 
import apiError from "@/functions/api-error";
import { SERVICES_GET } from "@/functions/api-services";

export async function servicesGet(query?: {
  page?: number;
  limit?: number;
  nome?: string;
  categoria?: string;
  ativo?: boolean;
  professionalId?: string;
}) {
  try {
    const { url, options } = SERVICES_GET(query);

    const response = await fetch(url, {
      ...options,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: null,
        ok: false,
        error: `Erro ${response.status}: ${response.statusText}`,
      };
    }

    const json = await response.json();
    const data = zodlistServicesResponse.parse(json);

    return { data, ok: true, error: "" };
  } catch (error) {
    return apiError(error);
  }
}
