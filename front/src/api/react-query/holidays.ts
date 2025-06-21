import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import type {
  DeleteHolidaysHolidayId204,
  DeleteHolidaysHolidayId400,
  DeleteHolidaysHolidayId403,
  DeleteHolidaysHolidayId404,
  GetHolidays200,
  GetHolidays400,
  GetHolidays403,
  GetHolidaysParams,
  PostHolidays201,
  PostHolidays400,
  PostHolidays404,
  PostHolidays409,
  PostHolidaysBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo feriado.
 */
export const postHolidays = (
  postHolidaysBody: PostHolidaysBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostHolidays201>({
    url: `/holidays`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postHolidaysBody,
    signal,
  });
};

export const getPostHolidaysMutationOptions = <
  TError = PostHolidays400 | PostHolidays404 | PostHolidays409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postHolidays>>,
    TError,
    { data: PostHolidaysBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postHolidays>>,
  TError,
  { data: PostHolidaysBody },
  TContext
> => {
  const mutationKey = ["postHolidays"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postHolidays>>,
    { data: PostHolidaysBody }
  > = (props) => {
    const { data } = props ?? {};

    return postHolidays(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostHolidaysMutationResult = NonNullable<
  Awaited<ReturnType<typeof postHolidays>>
>;
export type PostHolidaysMutationBody = PostHolidaysBody;
export type PostHolidaysMutationError =
  | PostHolidays400
  | PostHolidays404
  | PostHolidays409;

export const usePostHolidays = <
  TError = PostHolidays400 | PostHolidays404 | PostHolidays409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postHolidays>>,
    TError,
    { data: PostHolidaysBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postHolidays>>,
  TError,
  { data: PostHolidaysBody },
  TContext
> => {
  const mutationOptions = getPostHolidaysMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Listar feriados.
 */
export const getHolidays = (
  params?: GetHolidaysParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetHolidays200>({
    url: `/holidays`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetHolidaysQueryKey = (params?: GetHolidaysParams) => {
  return [`/holidays`, ...(params ? [params] : [])] as const;
};

export const getGetHolidaysInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getHolidays>>,
  TError = GetHolidays400 | GetHolidays403,
>(
  params?: GetHolidaysParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getHolidays>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetHolidaysQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getHolidays>>> = ({
    signal,
  }) => getHolidays(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getHolidays>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetHolidaysInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getHolidays>>
>;
export type GetHolidaysInfiniteQueryError = GetHolidays400 | GetHolidays403;

export function useGetHolidaysInfinite<
  TData = Awaited<ReturnType<typeof getHolidays>>,
  TError = GetHolidays400 | GetHolidays403,
>(
  params?: GetHolidaysParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getHolidays>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetHolidaysInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetHolidaysQueryOptions = <
  TData = Awaited<ReturnType<typeof getHolidays>>,
  TError = GetHolidays400 | GetHolidays403,
>(
  params?: GetHolidaysParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getHolidays>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetHolidaysQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getHolidays>>> = ({
    signal,
  }) => getHolidays(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getHolidays>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetHolidaysQueryResult = NonNullable<
  Awaited<ReturnType<typeof getHolidays>>
>;
export type GetHolidaysQueryError = GetHolidays400 | GetHolidays403;

export function useGetHolidays<
  TData = Awaited<ReturnType<typeof getHolidays>>,
  TError = GetHolidays400 | GetHolidays403,
>(
  params?: GetHolidaysParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getHolidays>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetHolidaysQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Deletar um feriado.
 */
export const deleteHolidaysHolidayId = (holidayId: string) => {
  return axiosInstance<DeleteHolidaysHolidayId204>({
    url: `/holidays/${holidayId}`,
    method: "DELETE",
  });
};

export const getDeleteHolidaysHolidayIdMutationOptions = <
  TError =
    | DeleteHolidaysHolidayId400
    | DeleteHolidaysHolidayId403
    | DeleteHolidaysHolidayId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteHolidaysHolidayId>>,
    TError,
    { holidayId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteHolidaysHolidayId>>,
  TError,
  { holidayId: string },
  TContext
> => {
  const mutationKey = ["deleteHolidaysHolidayId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteHolidaysHolidayId>>,
    { holidayId: string }
  > = (props) => {
    const { holidayId } = props ?? {};

    return deleteHolidaysHolidayId(holidayId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteHolidaysHolidayIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteHolidaysHolidayId>>
>;

export type DeleteHolidaysHolidayIdMutationError =
  | DeleteHolidaysHolidayId400
  | DeleteHolidaysHolidayId403
  | DeleteHolidaysHolidayId404;

export const useDeleteHolidaysHolidayId = <
  TError =
    | DeleteHolidaysHolidayId400
    | DeleteHolidaysHolidayId403
    | DeleteHolidaysHolidayId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteHolidaysHolidayId>>,
    TError,
    { holidayId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteHolidaysHolidayId>>,
  TError,
  { holidayId: string },
  TContext
> => {
  const mutationOptions = getDeleteHolidaysHolidayIdMutationOptions(options);

  return useMutation(mutationOptions);
};
