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
  GetBookingsBookingId200,
  GetBookingsBookingId400,
  GetBookingsBookingId404,
  GetBookingsMe200,
  GetBookingsMe400,
  GetBookingsMe403,
  GetBookingsMe404,
  GetBookingsMeParams,
  GetBookingsProfessional200,
  GetBookingsProfessional400,
  GetBookingsProfessional404,
  GetBookingsProfessionalParams,
  PatchBookingsBookingIdStatus200,
  PatchBookingsBookingIdStatus400,
  PatchBookingsBookingIdStatus403,
  PatchBookingsBookingIdStatus404,
  PatchBookingsBookingIdStatusBody,
  PostBookings201,
  PostBookings400,
  PostBookings404,
  PostBookings409,
  PostBookingsBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo agendamento.
 */
export const postBookings = (
  postBookingsBody: PostBookingsBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostBookings201>({
    url: `/bookings`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postBookingsBody,
    signal,
  });
};

export const getPostBookingsMutationOptions = <
  TError = PostBookings400 | PostBookings404 | PostBookings409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postBookings>>,
    TError,
    { data: PostBookingsBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postBookings>>,
  TError,
  { data: PostBookingsBody },
  TContext
> => {
  const mutationKey = ["postBookings"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postBookings>>,
    { data: PostBookingsBody }
  > = (props) => {
    const { data } = props ?? {};

    return postBookings(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostBookingsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postBookings>>
>;
export type PostBookingsMutationBody = PostBookingsBody;
export type PostBookingsMutationError =
  | PostBookings400
  | PostBookings404
  | PostBookings409;

export const usePostBookings = <
  TError = PostBookings400 | PostBookings404 | PostBookings409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postBookings>>,
    TError,
    { data: PostBookingsBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postBookings>>,
  TError,
  { data: PostBookingsBody },
  TContext
> => {
  const mutationOptions = getPostBookingsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Atualiza o status de um agendamento (apenas para profissionais)
 */
export const patchBookingsBookingIdStatus = (
  bookingId: string,
  patchBookingsBookingIdStatusBody: PatchBookingsBookingIdStatusBody,
) => {
  return axiosInstance<PatchBookingsBookingIdStatus200>({
    url: `/bookings/${bookingId}/status`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: patchBookingsBookingIdStatusBody,
  });
};

export const getPatchBookingsBookingIdStatusMutationOptions = <
  TError =
    | PatchBookingsBookingIdStatus400
    | PatchBookingsBookingIdStatus403
    | PatchBookingsBookingIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchBookingsBookingIdStatus>>,
    TError,
    { bookingId: string; data: PatchBookingsBookingIdStatusBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchBookingsBookingIdStatus>>,
  TError,
  { bookingId: string; data: PatchBookingsBookingIdStatusBody },
  TContext
> => {
  const mutationKey = ["patchBookingsBookingIdStatus"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchBookingsBookingIdStatus>>,
    { bookingId: string; data: PatchBookingsBookingIdStatusBody }
  > = (props) => {
    const { bookingId, data } = props ?? {};

    return patchBookingsBookingIdStatus(bookingId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchBookingsBookingIdStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchBookingsBookingIdStatus>>
>;
export type PatchBookingsBookingIdStatusMutationBody =
  PatchBookingsBookingIdStatusBody;
export type PatchBookingsBookingIdStatusMutationError =
  | PatchBookingsBookingIdStatus400
  | PatchBookingsBookingIdStatus403
  | PatchBookingsBookingIdStatus404;

export const usePatchBookingsBookingIdStatus = <
  TError =
    | PatchBookingsBookingIdStatus400
    | PatchBookingsBookingIdStatus403
    | PatchBookingsBookingIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchBookingsBookingIdStatus>>,
    TError,
    { bookingId: string; data: PatchBookingsBookingIdStatusBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchBookingsBookingIdStatus>>,
  TError,
  { bookingId: string; data: PatchBookingsBookingIdStatusBody },
  TContext
> => {
  const mutationOptions =
    getPatchBookingsBookingIdStatusMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Lista os agendamentos do usuário autenticado
 */
export const getBookingsMe = (
  params?: GetBookingsMeParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetBookingsMe200>({
    url: `/bookings/me`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetBookingsMeQueryKey = (params?: GetBookingsMeParams) => {
  return [`/bookings/me`, ...(params ? [params] : [])] as const;
};

export const getGetBookingsMeInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getBookingsMe>>,
  TError = GetBookingsMe400 | GetBookingsMe403 | GetBookingsMe404,
>(
  params?: GetBookingsMeParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBookingsMe>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetBookingsMeQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBookingsMe>>> = ({
    signal,
  }) => getBookingsMe(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBookingsMe>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBookingsMeInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingsMe>>
>;
export type GetBookingsMeInfiniteQueryError =
  | GetBookingsMe400
  | GetBookingsMe403
  | GetBookingsMe404;

export function useGetBookingsMeInfinite<
  TData = Awaited<ReturnType<typeof getBookingsMe>>,
  TError = GetBookingsMe400 | GetBookingsMe403 | GetBookingsMe404,
>(
  params?: GetBookingsMeParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBookingsMe>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingsMeInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetBookingsMeQueryOptions = <
  TData = Awaited<ReturnType<typeof getBookingsMe>>,
  TError = GetBookingsMe400 | GetBookingsMe403 | GetBookingsMe404,
>(
  params?: GetBookingsMeParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBookingsMe>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetBookingsMeQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBookingsMe>>> = ({
    signal,
  }) => getBookingsMe(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getBookingsMe>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBookingsMeQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingsMe>>
>;
export type GetBookingsMeQueryError =
  | GetBookingsMe400
  | GetBookingsMe403
  | GetBookingsMe404;

export function useGetBookingsMe<
  TData = Awaited<ReturnType<typeof getBookingsMe>>,
  TError = GetBookingsMe400 | GetBookingsMe403 | GetBookingsMe404,
>(
  params?: GetBookingsMeParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBookingsMe>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingsMeQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Lista os agendamentos do profissional autenticado
 */
export const getBookingsProfessional = (
  params?: GetBookingsProfessionalParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetBookingsProfessional200>({
    url: `/bookings/professional`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetBookingsProfessionalQueryKey = (
  params?: GetBookingsProfessionalParams,
) => {
  return [`/bookings/professional`, ...(params ? [params] : [])] as const;
};

export const getGetBookingsProfessionalInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getBookingsProfessional>>,
  TError = GetBookingsProfessional400 | GetBookingsProfessional404,
>(
  params?: GetBookingsProfessionalParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBookingsProfessional>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetBookingsProfessionalQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getBookingsProfessional>>
  > = ({ signal }) => getBookingsProfessional(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBookingsProfessional>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBookingsProfessionalInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingsProfessional>>
>;
export type GetBookingsProfessionalInfiniteQueryError =
  | GetBookingsProfessional400
  | GetBookingsProfessional404;

export function useGetBookingsProfessionalInfinite<
  TData = Awaited<ReturnType<typeof getBookingsProfessional>>,
  TError = GetBookingsProfessional400 | GetBookingsProfessional404,
>(
  params?: GetBookingsProfessionalParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBookingsProfessional>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingsProfessionalInfiniteQueryOptions(
    params,
    options,
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetBookingsProfessionalQueryOptions = <
  TData = Awaited<ReturnType<typeof getBookingsProfessional>>,
  TError = GetBookingsProfessional400 | GetBookingsProfessional404,
>(
  params?: GetBookingsProfessionalParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBookingsProfessional>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetBookingsProfessionalQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getBookingsProfessional>>
  > = ({ signal }) => getBookingsProfessional(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getBookingsProfessional>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBookingsProfessionalQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingsProfessional>>
>;
export type GetBookingsProfessionalQueryError =
  | GetBookingsProfessional400
  | GetBookingsProfessional404;

export function useGetBookingsProfessional<
  TData = Awaited<ReturnType<typeof getBookingsProfessional>>,
  TError = GetBookingsProfessional400 | GetBookingsProfessional404,
>(
  params?: GetBookingsProfessionalParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBookingsProfessional>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingsProfessionalQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Busca os detalhes de um agendamento pelo ID.
 */
export const getBookingsBookingId = (
  bookingId: string,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetBookingsBookingId200>({
    url: `/bookings/${bookingId}`,
    method: "GET",
    signal,
  });
};

export const getGetBookingsBookingIdQueryKey = (bookingId: string) => {
  return [`/bookings/${bookingId}`] as const;
};

export const getGetBookingsBookingIdInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getBookingsBookingId>>,
  TError = GetBookingsBookingId400 | GetBookingsBookingId404,
>(
  bookingId: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBookingsBookingId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetBookingsBookingIdQueryKey(bookingId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getBookingsBookingId>>
  > = ({ signal }) => getBookingsBookingId(bookingId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!bookingId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBookingsBookingId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBookingsBookingIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingsBookingId>>
>;
export type GetBookingsBookingIdInfiniteQueryError =
  | GetBookingsBookingId400
  | GetBookingsBookingId404;

export function useGetBookingsBookingIdInfinite<
  TData = Awaited<ReturnType<typeof getBookingsBookingId>>,
  TError = GetBookingsBookingId400 | GetBookingsBookingId404,
>(
  bookingId: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getBookingsBookingId>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingsBookingIdInfiniteQueryOptions(
    bookingId,
    options,
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetBookingsBookingIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getBookingsBookingId>>,
  TError = GetBookingsBookingId400 | GetBookingsBookingId404,
>(
  bookingId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBookingsBookingId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetBookingsBookingIdQueryKey(bookingId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getBookingsBookingId>>
  > = ({ signal }) => getBookingsBookingId(bookingId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!bookingId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getBookingsBookingId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetBookingsBookingIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingsBookingId>>
>;
export type GetBookingsBookingIdQueryError =
  | GetBookingsBookingId400
  | GetBookingsBookingId404;

export function useGetBookingsBookingId<
  TData = Awaited<ReturnType<typeof getBookingsBookingId>>,
  TError = GetBookingsBookingId400 | GetBookingsBookingId404,
>(
  bookingId: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getBookingsBookingId>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBookingsBookingIdQueryOptions(bookingId, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
