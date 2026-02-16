"use server";

import { PROFESSIONALS_LIST } from "@/shared/services/api-professional";
import apiError from "@/shared/services/api-error";
import { zodlistOrSearchProfessionalsResponse } from "@/api";

export type Professional = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  especialidade: string;
  ativo: string;
};

export async function professionalsList(query?: {
  page?: number;
  limit?: number;
  search?: string;
  especialidade?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}) {
  try {
    const { url, options } = PROFESSIONALS_LIST(query);

    const response = await fetch(url, { ...options, cache: "no-store" });

    if (!response.ok) {
      return {
        data: null,
        ok: false,
        error: `Erro ${response.status}: ${response.statusText}`,
      };
    }

    const json = await response.json();
    const data = zodlistOrSearchProfessionalsResponse.parse(json);

    const professionals: Professional[] = data.professionals.map((p) => ({
      id: p.id,
      name: p.user.name,
      email: p.user.email,
      phone: p.user.phone ?? null,
      especialidade: p.specialty,
      ativo: p.active ? "Ativo" : "Inativo",
    }));

    return { data: { ...data, professionals }, ok: true, error: "" };
  } catch (error) {
    return apiError(error);
  }
}
