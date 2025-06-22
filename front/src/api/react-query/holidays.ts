import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  CreateHoliday201,
  CreateHoliday400,
  CreateHoliday404,
  CreateHoliday409,
  CreateHolidayBody,
  DeleteHoliday204,
  DeleteHoliday400,
  DeleteHoliday403,
  DeleteHoliday404,
  ListHolidays200,
  ListHolidays400,
  ListHolidays403,
  ListHolidaysParams,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo feriado.
 */
export const createHoliday = (
  createHolidayBody: CreateHolidayBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<CreateHoliday201>({
    url: `/holidays`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: createHolidayBody,
    signal,
  });
};

export const getCreateHolidayMutationOptions = <
  TError = CreateHoliday400 | CreateHoliday404 | CreateHoliday409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createHoliday>>,
    TError,
    { data: CreateHolidayBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createHoliday>>,
  TError,
  { data: CreateHolidayBody },
  TContext
> => {
  const mutationKey = ["createHoliday"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createHoliday>>,
    { data: CreateHolidayBody }
  > = (props) => {
    const { data } = props ?? {};

    return createHoliday(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateHolidayMutationResult = NonNullable<
  Awaited<ReturnType<typeof createHoliday>>
>;
export type CreateHolidayMutationBody = CreateHolidayBody;
export type CreateHolidayMutationError =
  | CreateHoliday400
  | CreateHoliday404
  | CreateHoliday409;

export const useCreateHoliday = <
  TError = CreateHoliday400 | CreateHoliday404 | CreateHoliday409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createHoliday>>,
      TError,
      { data: CreateHolidayBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createHoliday>>,
  TError,
  { data: CreateHolidayBody },
  TContext
> => {
  const mutationOptions = getCreateHolidayMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Listar feriados.
 */
export const listHolidays = (
  params?: ListHolidaysParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListHolidays200>({
    url: `/holidays`,
    method: "GET",
    params,
    signal,
  });
};

export const getListHolidaysQueryKey = (params?: ListHolidaysParams) => {
  return [`/holidays`, ...(params ? [params] : [])] as const;
};

export const getListHolidaysInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listHolidays>>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listHolidays>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListHolidaysQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listHolidays>>> = ({
    signal,
  }) => listHolidays(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listHolidays>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListHolidaysInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listHolidays>>
>;
export type ListHolidaysInfiniteQueryError = ListHolidays400 | ListHolidays403;

export function useListHolidaysInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listHolidays>>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params: undefined | ListHolidaysParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listHolidays>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listHolidays>>,
          TError,
          Awaited<ReturnType<typeof listHolidays>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListHolidaysInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listHolidays>>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listHolidays>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listHolidays>>,
          TError,
          Awaited<ReturnType<typeof listHolidays>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListHolidaysInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listHolidays>>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listHolidays>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListHolidaysInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listHolidays>>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listHolidays>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListHolidaysInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getListHolidaysQueryOptions = <
  TData = Awaited<ReturnType<typeof listHolidays>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listHolidays>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListHolidaysQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listHolidays>>> = ({
    signal,
  }) => listHolidays(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listHolidays>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListHolidaysQueryResult = NonNullable<
  Awaited<ReturnType<typeof listHolidays>>
>;
export type ListHolidaysQueryError = ListHolidays400 | ListHolidays403;

export function useListHolidays<
  TData = Awaited<ReturnType<typeof listHolidays>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params: undefined | ListHolidaysParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listHolidays>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listHolidays>>,
          TError,
          Awaited<ReturnType<typeof listHolidays>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListHolidays<
  TData = Awaited<ReturnType<typeof listHolidays>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listHolidays>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listHolidays>>,
          TError,
          Awaited<ReturnType<typeof listHolidays>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListHolidays<
  TData = Awaited<ReturnType<typeof listHolidays>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listHolidays>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListHolidays<
  TData = Awaited<ReturnType<typeof listHolidays>>,
  TError = ListHolidays400 | ListHolidays403,
>(
  params?: ListHolidaysParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof listHolidays>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListHolidaysQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Deletar um feriado.
 */
export const deleteHoliday = (holidayId: string) => {
  return axiosInstance<DeleteHoliday204>({
    url: `/holidays/${holidayId}`,
    method: "DELETE",
  });
};

export const getDeleteHolidayMutationOptions = <
  TError = DeleteHoliday400 | DeleteHoliday403 | DeleteHoliday404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteHoliday>>,
    TError,
    { holidayId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteHoliday>>,
  TError,
  { holidayId: string },
  TContext
> => {
  const mutationKey = ["deleteHoliday"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteHoliday>>,
    { holidayId: string }
  > = (props) => {
    const { holidayId } = props ?? {};

    return deleteHoliday(holidayId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteHolidayMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteHoliday>>
>;

export type DeleteHolidayMutationError =
  | DeleteHoliday400
  | DeleteHoliday403
  | DeleteHoliday404;

export const useDeleteHoliday = <
  TError = DeleteHoliday400 | DeleteHoliday403 | DeleteHoliday404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteHoliday>>,
      TError,
      { holidayId: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteHoliday>>,
  TError,
  { holidayId: string },
  TContext
> => {
  const mutationOptions = getDeleteHolidayMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
