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
  CreateBooking201,
  CreateBooking400,
  CreateBooking404,
  CreateBooking409,
  CreateBookingBody,
  GetBookingById200,
  GetBookingById400,
  GetBookingById404,
  ListProfessionalBookings200,
  ListProfessionalBookings400,
  ListProfessionalBookings404,
  ListProfessionalBookingsParams,
  ListUserBookings200,
  ListUserBookings400,
  ListUserBookings403,
  ListUserBookings404,
  ListUserBookingsParams,
  UpdateBookingStatus200,
  UpdateBookingStatus400,
  UpdateBookingStatus403,
  UpdateBookingStatus404,
  UpdateBookingStatusBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo agendamento.
 */
export const createBooking = (
  createBookingBody: CreateBookingBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<CreateBooking201>({
    url: `/bookings`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: createBookingBody,
    signal,
  });
};

export const getCreateBookingMutationOptions = <
  TError = CreateBooking400 | CreateBooking404 | CreateBooking409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createBooking>>,
    TError,
    { data: CreateBookingBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createBooking>>,
  TError,
  { data: CreateBookingBody },
  TContext
> => {
  const mutationKey = ["createBooking"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createBooking>>,
    { data: CreateBookingBody }
  > = (props) => {
    const { data } = props ?? {};

    return createBooking(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateBookingMutationResult = NonNullable<
  Awaited<ReturnType<typeof createBooking>>
>;
export type CreateBookingMutationBody = CreateBookingBody;
export type CreateBookingMutationError =
  | CreateBooking400
  | CreateBooking404
  | CreateBooking409;

export const useCreateBooking = <
  TError = CreateBooking400 | CreateBooking404 | CreateBooking409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createBooking>>,
      TError,
      { data: CreateBookingBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createBooking>>,
  TError,
  { data: CreateBookingBody },
  TContext
> => {
  const mutationOptions = getCreateBookingMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Atualiza o status de um agendamento (apenas para profissionais)
 */
export const updateBookingStatus = (
  bookingId: string,
  updateBookingStatusBody: UpdateBookingStatusBody,
) => {
  return axiosInstance<UpdateBookingStatus200>({
    url: `/bookings/${bookingId}/status`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: updateBookingStatusBody,
  });
};

export const getUpdateBookingStatusMutationOptions = <
  TError =
    | UpdateBookingStatus400
    | UpdateBookingStatus403
    | UpdateBookingStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateBookingStatus>>,
    TError,
    { bookingId: string; data: UpdateBookingStatusBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateBookingStatus>>,
  TError,
  { bookingId: string; data: UpdateBookingStatusBody },
  TContext
> => {
  const mutationKey = ["updateBookingStatus"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateBookingStatus>>,
    { bookingId: string; data: UpdateBookingStatusBody }
  > = (props) => {
    const { bookingId, data } = props ?? {};

    return updateBookingStatus(bookingId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateBookingStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateBookingStatus>>
>;
export type UpdateBookingStatusMutationBody = UpdateBookingStatusBody;
export type UpdateBookingStatusMutationError =
  | UpdateBookingStatus400
  | UpdateBookingStatus403
  | UpdateBookingStatus404;

export const useUpdateBookingStatus = <
  TError =
    | UpdateBookingStatus400
    | UpdateBookingStatus403
    | UpdateBookingStatus404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateBookingStatus>>,
      TError,
      { bookingId: string; data: UpdateBookingStatusBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateBookingStatus>>,
  TError,
  { bookingId: string; data: UpdateBookingStatusBody },
  TContext
> => {
  const mutationOptions = getUpdateBookingStatusMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Lista os agendamentos do usuário autenticado
 */
export const listUserBookings = (
  params?: ListUserBookingsParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListUserBookings200>({
    url: `/bookings/me`,
    method: "GET",
    params,
    signal,
  });
};

export const getListUserBookingsQueryKey = (
  params?: ListUserBookingsParams,
) => {
  return [`/bookings/me`, ...(params ? [params] : [])] as const;
};

export const getListUserBookingsInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listUserBookings>>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListUserBookingsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listUserBookings>>
  > = ({ signal }) => listUserBookings(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listUserBookings>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListUserBookingsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listUserBookings>>
>;
export type ListUserBookingsInfiniteQueryError =
  | ListUserBookings400
  | ListUserBookings403
  | ListUserBookings404;

export function useListUserBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUserBookings>>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params: undefined | ListUserBookingsParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUserBookings>>,
          TError,
          Awaited<ReturnType<typeof listUserBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUserBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUserBookings>>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUserBookings>>,
          TError,
          Awaited<ReturnType<typeof listUserBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUserBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUserBookings>>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListUserBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listUserBookings>>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListUserBookingsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getListUserBookingsQueryOptions = <
  TData = Awaited<ReturnType<typeof listUserBookings>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListUserBookingsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listUserBookings>>
  > = ({ signal }) => listUserBookings(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listUserBookings>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListUserBookingsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listUserBookings>>
>;
export type ListUserBookingsQueryError =
  | ListUserBookings400
  | ListUserBookings403
  | ListUserBookings404;

export function useListUserBookings<
  TData = Awaited<ReturnType<typeof listUserBookings>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params: undefined | ListUserBookingsParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUserBookings>>,
          TError,
          Awaited<ReturnType<typeof listUserBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUserBookings<
  TData = Awaited<ReturnType<typeof listUserBookings>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listUserBookings>>,
          TError,
          Awaited<ReturnType<typeof listUserBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListUserBookings<
  TData = Awaited<ReturnType<typeof listUserBookings>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListUserBookings<
  TData = Awaited<ReturnType<typeof listUserBookings>>,
  TError = ListUserBookings400 | ListUserBookings403 | ListUserBookings404,
>(
  params?: ListUserBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listUserBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListUserBookingsQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Lista os agendamentos do profissional autenticado
 */
export const listProfessionalBookings = (
  params?: ListProfessionalBookingsParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListProfessionalBookings200>({
    url: `/bookings/professional`,
    method: "GET",
    params,
    signal,
  });
};

export const getListProfessionalBookingsQueryKey = (
  params?: ListProfessionalBookingsParams,
) => {
  return [`/bookings/professional`, ...(params ? [params] : [])] as const;
};

export const getListProfessionalBookingsInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalBookings>>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListProfessionalBookingsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listProfessionalBookings>>
  > = ({ signal }) => listProfessionalBookings(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listProfessionalBookings>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListProfessionalBookingsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listProfessionalBookings>>
>;
export type ListProfessionalBookingsInfiniteQueryError =
  | ListProfessionalBookings400
  | ListProfessionalBookings404;

export function useListProfessionalBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalBookings>>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params: undefined | ListProfessionalBookingsParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalBookings>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalBookings>>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalBookings>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalBookings>>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListProfessionalBookingsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listProfessionalBookings>>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListProfessionalBookingsInfiniteQueryOptions(
    params,
    options,
  );

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getListProfessionalBookingsQueryOptions = <
  TData = Awaited<ReturnType<typeof listProfessionalBookings>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListProfessionalBookingsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listProfessionalBookings>>
  > = ({ signal }) => listProfessionalBookings(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listProfessionalBookings>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListProfessionalBookingsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listProfessionalBookings>>
>;
export type ListProfessionalBookingsQueryError =
  | ListProfessionalBookings400
  | ListProfessionalBookings404;

export function useListProfessionalBookings<
  TData = Awaited<ReturnType<typeof listProfessionalBookings>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params: undefined | ListProfessionalBookingsParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalBookings>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalBookings<
  TData = Awaited<ReturnType<typeof listProfessionalBookings>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listProfessionalBookings>>,
          TError,
          Awaited<ReturnType<typeof listProfessionalBookings>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListProfessionalBookings<
  TData = Awaited<ReturnType<typeof listProfessionalBookings>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListProfessionalBookings<
  TData = Awaited<ReturnType<typeof listProfessionalBookings>>,
  TError = ListProfessionalBookings400 | ListProfessionalBookings404,
>(
  params?: ListProfessionalBookingsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listProfessionalBookings>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListProfessionalBookingsQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Busca os detalhes de um agendamento pelo ID.
 */
export const getBookingById = (bookingId: string, signal?: AbortSignal) => {
  return axiosInstance<GetBookingById200>({
    url: `/bookings/${bookingId}`,
    method: "GET",
    signal,
  });
};

export const getGetBookingByIdQueryKey = (bookingId: string) => {
  return [`/bookings/${bookingId}`] as const;
};

export const getGetBookingByIdInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getBookingById>>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBookingById>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetBookingByIdQueryKey(bookingId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBookingById>>> = ({
    signal,
  }) => getBookingById(bookingId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!bookingId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getBookingById>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetBookingByIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingById>>
>;
export type GetBookingByIdInfiniteQueryError =
  | GetBookingById400
  | GetBookingById404;

export function useGetBookingByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBookingById>>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBookingById>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBookingById>>,
          TError,
          Awaited<ReturnType<typeof getBookingById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBookingByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBookingById>>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBookingById>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBookingById>>,
          TError,
          Awaited<ReturnType<typeof getBookingById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBookingByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBookingById>>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBookingById>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetBookingByIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getBookingById>>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getBookingById>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetBookingByIdInfiniteQueryOptions(
    bookingId,
    options,
  );

  const query = useInfiniteQuery(
    queryOptions,
    queryClient,
  ) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetBookingByIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getBookingById>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getBookingById>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetBookingByIdQueryKey(bookingId);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBookingById>>> = ({
    signal,
  }) => getBookingById(bookingId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!bookingId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getBookingById>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetBookingByIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getBookingById>>
>;
export type GetBookingByIdQueryError = GetBookingById400 | GetBookingById404;

export function useGetBookingById<
  TData = Awaited<ReturnType<typeof getBookingById>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getBookingById>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBookingById>>,
          TError,
          Awaited<ReturnType<typeof getBookingById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBookingById<
  TData = Awaited<ReturnType<typeof getBookingById>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getBookingById>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getBookingById>>,
          TError,
          Awaited<ReturnType<typeof getBookingById>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetBookingById<
  TData = Awaited<ReturnType<typeof getBookingById>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getBookingById>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetBookingById<
  TData = Awaited<ReturnType<typeof getBookingById>>,
  TError = GetBookingById400 | GetBookingById404,
>(
  bookingId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getBookingById>>, TError, TData>
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetBookingByIdQueryOptions(bookingId, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}
