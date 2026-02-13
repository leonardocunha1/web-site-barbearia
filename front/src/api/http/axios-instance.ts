import { API_BASE_URL } from "@/shared/constants";
import { seconds } from "@/shared/utils/time";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";

type ApiErrorPayload = {
  message?: string;
  error?: string;
  detail?: string;
};

export const AXIOS_INSTANCE = Axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: seconds(30),
});

const getErrorMessage = (error: AxiosError<ApiErrorPayload>) => {
  const data = error.response?.data;

  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (data?.detail) return data.detail;
  if (error.code === "ERR_NETWORK") return "Erro de rede";

  return "Erro inesperado no servidor";
};

type RetryConfig = AxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

let refreshPromise: Promise<void> | null = null;
let logoutPromise: Promise<void> | null = null;

const runRefreshToken = async () => {
  await AXIOS_INSTANCE.post("/auth/refresh-token", undefined, {
    skipAuthRefresh: true,
  } as RetryConfig);
};

const runRefreshOnce = () => {
  if (!refreshPromise) {
    refreshPromise = runRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const shouldRedirectToLogin = () => {
  if (typeof window === "undefined") return false;

  const path = window.location.pathname;
  return path.startsWith("/conta");
};

const runLogout = async () => {
  try {
    await AXIOS_INSTANCE.post("/auth/logout", undefined, {
      skipAuthRefresh: true,
    } as RetryConfig);
  } catch {
    // ignore logout errors
  }

  if (shouldRedirectToLogin()) {
    window.location.href = "/login";
  }
};

const runLogoutOnce = async () => {
  if (!logoutPromise) {
    logoutPromise = runLogout().finally(() => {
      logoutPromise = null;
    });
  }

  return logoutPromise;
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    error.message = getErrorMessage(error);

    const config = error.config as RetryConfig | undefined;

    if (!config || config.skipAuthRefresh) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isUnauthorized = status === 401;
    const isRefreshEndpoint = config.url?.includes("/auth/refresh-token");
    const isLogoutEndpoint = config.url?.includes("/auth/logout");

    if (!isUnauthorized || isRefreshEndpoint || isLogoutEndpoint) {
      return Promise.reject(error);
    }

    if (!config._retry) {
      config._retry = true;

      try {
        await runRefreshOnce();
        return AXIOS_INSTANCE(config);
      } catch (refreshError) {
        if (shouldRedirectToLogin()) {
          await runLogoutOnce();
        }
        return Promise.reject(refreshError);
      }
    }

    if (shouldRedirectToLogin()) {
      await runLogoutOnce();
    }
    return Promise.reject(error);
  },
);

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );

  // @ts-expect-error: adicionando método customizado `cancel` à promise
  promise.cancel = () => {
    source.cancel("Query was cancelled by React Query");
  };

  return promise;
};

export default axiosInstance;
export type { AxiosError };
