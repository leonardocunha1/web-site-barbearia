'use server';

import { redirect } from 'next/navigation';
import userGet from './user-get';
import axiosInstance from '@/api/http/axios-instance';
import { AxiosResponse } from 'axios';

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    role: string;
    createdAt: string;
    telefone: string | null;
    emailVerified: boolean;
    active: boolean;
  };
};

export async function loginUserAction(formData: FormData) {
  const email = formData.get('email') as string;
  const senha = formData.get('password') as string; 

  try {
    const loginResponse: AxiosResponse<LoginResponse> = await axiosInstance({
      url: `/auth/login`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { email, senha },
      withCredentials: true, 
    });

    if (loginResponse.status >= 200 && loginResponse.status < 300) {
      // 2. Cookies foram setados no response pelo backend

      // 3. Buscar dados do usuário autenticado
      const userResult = await userGet();

      if (userResult.ok && userResult.data) {
        // 4. Redirecionar para home
        redirect('/');
      } else {
        throw new Error('Falha ao carregar dados do usuário após login');
      }
    } else {
      throw new Error('Credenciais inválidas');
    }
  } catch (error: unknown) {
    console.error('Erro no login:', error);
    if (error instanceof Error) {
      return { error: error.message || 'Erro ao fazer login' };
    }
    return { error: 'Erro desconhecido ao fazer login' };
  }
}
