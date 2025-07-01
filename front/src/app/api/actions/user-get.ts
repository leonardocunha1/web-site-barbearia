'use server';

import { GetUsersMe200 } from '@/api';
import { USER_GET } from '@/functions/api';
import { USER_REFRESH_TOKEN } from '@/functions/api';
import { cookies } from 'next/headers';

export default async function userGet() {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get('accessToken')?.value;

    if (!token) throw new Error('Token não encontrado.');

    const { url } = USER_GET();
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 60,
      },
      credentials: 'include',
    });

    // Se deu 401, tenta refresh token
    if (response.status === 401) {
      const refreshUrl = USER_REFRESH_TOKEN().url;
      const refreshResponse = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!refreshResponse.ok) {
        throw new Error('Falha ao renovar token de acesso');
      }

      const { token: newToken } = await refreshResponse.json();
      token = newToken;

      // Tenta novamente a requisição original com novo token
      response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 60,
        },
        credentials: 'include',
      });

      // Se ainda falhar após o refresh, lança erro
      if (!response.ok) {
        throw new Error('Erro ao obter dados do usuário após refresh');
      }
    }

    const data = (await response.json()) as GetUsersMe200;
    return { data, ok: true, error: '' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { data: null, ok: false, error: errorMessage };
  }
}