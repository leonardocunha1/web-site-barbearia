import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type { GetAdminDashboard200, GetAdminDashboard400 } from "../schemas";

import { axiosInstance } from "../http/axios-instance";

export const getAdminDashboard = (signal?: AbortSignal) => {
  return axiosInstance<GetAdminDashboard200>({
    url: `/admin/dashboard`,
    method: "GET",
    signal,
  });
};

export const getGetAdminDashboardQueryKey = () => {
  return [`/admin/dashboard`] as const;
};

export const getGetAdminDashboardInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getAdminDashboard>>>,
  TError = GetAdminDashboard400,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAdminDashboard>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAdminDashboardQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAdminDashboard>>
  > = ({ signal }) => getAdminDashboard(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getAdminDashboard>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAdminDashboardInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAdminDashboard>>
>;
export type GetAdminDashboardInfiniteQueryError = GetAdminDashboard400;

export function useGetAdminDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAdminDashboard>>>,
  TError = GetAdminDashboard400,
>(
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAdminDashboard>>,
          TError,
          Awaited<ReturnType<typeof getAdminDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetAdminDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAdminDashboard>>>,
  TError = GetAdminDashboard400,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAdminDashboard>>,
          TError,
          Awaited<ReturnType<typeof getAdminDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetAdminDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAdminDashboard>>>,
  TError = GetAdminDashboard400,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetAdminDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAdminDashboard>>>,
  TError = GetAdminDashboard400,
>(
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetAdminDashboardInfiniteQueryOptions(options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetAdminDashboardQueryOptions = <
  TData = Awaited<ReturnType<typeof getAdminDashboard>>,
  TError = GetAdminDashboard400,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getAdminDashboard>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAdminDashboardQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAdminDashboard>>
  > = ({ signal }) => getAdminDashboard(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAdminDashboard>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAdminDashboardQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAdminDashboard>>
>;
export type GetAdminDashboardQueryError = GetAdminDashboard400;

export function useGetAdminDashboard<
  TData = Awaited<ReturnType<typeof getAdminDashboard>>,
  TError = GetAdminDashboard400,
>(
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAdminDashboard>>,
          TError,
          Awaited<ReturnType<typeof getAdminDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetAdminDashboard<
  TData = Awaited<ReturnType<typeof getAdminDashboard>>,
  TError = GetAdminDashboard400,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAdminDashboard>>,
          TError,
          Awaited<ReturnType<typeof getAdminDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetAdminDashboard<
  TData = Awaited<ReturnType<typeof getAdminDashboard>>,
  TError = GetAdminDashboard400,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetAdminDashboard<
  TData = Awaited<ReturnType<typeof getAdminDashboard>>,
  TError = GetAdminDashboard400,
>(
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAdminDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetAdminDashboardQueryOptions(options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}
