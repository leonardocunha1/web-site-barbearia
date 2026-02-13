"use server";

import { cookies } from "next/headers";
import { USER_GET, USER_REFRESH_TOKEN } from "@/shared/services/api-users";
import { zodgetUserProfileResponse } from "@/api";
import apiError from "@/shared/services/api-error";

export default async function userGet() {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    console.log("Access Token:", token);

    const { url } = USER_GET();

    let response: Response;

    if (token) {
      response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = new Response(null, { status: 401 });
    }

    if (response.status === 401) {
      if (!refreshToken) {
        return {
          ok: false,
          data: null,
          error: "Refresh token não encontrado",
        };
      }

      const refreshUrl = USER_REFRESH_TOKEN().url;
      const refreshResponse = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        return {
          ok: false,
          data: null,
          error: "Falha ao renovar token de acesso",
        };
      }

      const { token: newToken } = await refreshResponse.json();
      token = newToken;

      if (token) {
        const newCookieStore = await cookies();
        newCookieStore.set("accessToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60, // 1 hora
        });
      } else {
        return {
          ok: false,
          data: null,
          error: "Token não recebido do servidor",
        };
      }

      // Faça a requisição novamente com o novo token
      response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        return {
          ok: false,
          data: null,
          error: "Erro ao obter dados do usuário após refresh",
        };
      }
    }

    const json = await response.json();
    const data = zodgetUserProfileResponse.parse(json);
    return { ok: true, data, error: "" };
  } catch (error) {
    return apiError(error);
  }
}
