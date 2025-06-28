// import { seconds } from '@/utils/time';
// import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

// export const AXIOS_INSTANCE = Axios.create({
//   baseURL: 'http://localhost:3333',
//   withCredentials: true,
//   timeout: seconds(30),
// });

// export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
//   const source = Axios.CancelToken.source();

//   const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
//     ({ data }) => data
//   );

//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   promise.cancel = () => {
//     source.cancel('Query was cancelled by Vue Query');
//   };

//   return promise;
// };

// export default axiosInstance;

// // Agora, quando quiser usar o tipo de erro, use diretamente:
// export type { AxiosError }; // Opcional, se quiser reexportar para facilitar uso em outros arquivos

import { seconds } from '@/utils/time';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Criação da instância do Axios com configurações padrões
export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
  timeout: seconds(30),
});

// Interceptor para capturar e personalizar mensagens de erro da API
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    const customMessage =
      error.response?.data?.message || "Erro inesperado no servidor";

    // Sobrescreve a mensagem do erro com a que veio da API
    error.message = customMessage;

    return Promise.reject(error);
  }
);

// Função auxiliar para fazer requisições tipadas com suporte a cancelamento
export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data
  );

  // Adiciona método para cancelamento opcional da requisição
  // @ts-expect-error: adicionando método customizado `cancel` à promise
promise.cancel = () => {
  source.cancel('Query was cancelled by Vue Query');
};

  return promise;
};

// Exporta como padrão
export default axiosInstance;

// Exporta o tipo AxiosError se quiser usar em outros lugares
export type { AxiosError };
