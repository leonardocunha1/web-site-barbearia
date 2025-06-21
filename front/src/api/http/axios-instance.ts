import { seconds } from '@/utils/time';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
  timeout: seconds(30),
});

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by Vue Query');
  };

  return promise;
};

export default axiosInstance;

// Agora, quando quiser usar o tipo de erro, use diretamente:
export type { AxiosError }; // Opcional, se quiser reexportar para facilitar uso em outros arquivos
