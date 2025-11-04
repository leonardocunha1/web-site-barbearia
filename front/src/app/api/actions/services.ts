"use server";

import { cookies } from "next/headers";
import {
  zodcreateServiceBody,
  zodlistServicesResponse,
  zodupdateServiceByIdBody,
  zodupdateServiceByIdParams,
  zodupdateServiceByIdResponse,
} from "@/api";
import apiError from "@/functions/api-error";
import {
  SERVICES_CREATE,
  SERVICES_GET,
  SERVICES_UPDATE,
} from "@/functions/api-services";

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

export async function servicesUpdate(
  id: string,
  data: {
    nome?: string;
    descricao?: string;
    precoPadrao?: number;
    duracao?: number;
    categoria?: string;
    ativo?: boolean;
  }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) throw new Error("Token de autenticação não encontrado");

    const validatedParams = zodupdateServiceByIdParams.parse({ id });
    const validatedData = zodupdateServiceByIdBody.parse(data);

    const { url, options } = SERVICES_UPDATE(validatedParams.id, validatedData, token);

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

    // 🔧 Evita "Unexpected end of JSON input"
    const text = await response.text();
    const json = text ? JSON.parse(text) : null;

    let responseData = null;
    if (json) {
      responseData = zodupdateServiceByIdResponse.parse(json);
    }

    return { data: responseData, ok: true, error: "" };
  } catch (error) {
    return apiError(error);
  }
}


export async function servicesCreate(data: {
  nome: string;
  descricao?: string;
  precoPadrao?: number;
  duracao?: number;
  categoria?: string;
  ativo?: boolean;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) throw new Error("Token de autenticação não encontrado");

    const validatedData = zodcreateServiceBody.parse(data);
    const { url, options } = SERVICES_CREATE(validatedData, token);

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

    if (response.status === 201) {
      return { data: null, ok: true, error: "" };
    }

    const text = await response.text();
    const json = text ? JSON.parse(text) : null;

    return { data: json, ok: true, error: "" };
  } catch (error) {
    return apiError(error);
  }
}
