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
  CreateBusinessHour201,
  CreateBusinessHour400,
  CreateBusinessHour404,
  CreateBusinessHour409,
  CreateBusinessHourBody,
  DeleteBusinessHour204,
  DeleteBusinessHour400,
  DeleteBusinessHour403,
  DeleteBusinessHour404,
  ListBusinessHours200,
  ListBusinessHours400,
  ListBusinessHours404,
  UpdateBusinessHour200,
  UpdateBusinessHour400,
  UpdateBusinessHour404,
  UpdateBusinessHourBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

/**
 * Criação de um novo horário de funcionamento.
 */
export const createBusinessHour = (
  createBusinessHourBody: CreateBusinessHourBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<CreateBusinessHour201>({
    url: `/business-hours`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: createBusinessHourBody,
    signal,
  });
};

export const getCreateBusinessHourMutationOptions = <
  TError =
    | CreateBusinessHour400
    | CreateBusinessHour404
    | CreateBusinessHour409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createBusinessHour>>,
    TError,
    { data: CreateBusinessHourBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createBusinessHour>>,
  TError,
  { data: CreateBusinessHourBody },
  TContext
> => {
  const mutationKey = ["createBusinessHour"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createBusinessHour>>,
    { data: CreateBusinessHourBody }
  > = (props) => {
    const { data } = props ?? {};

    return createBusinessHour(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateBusinessHourMutationResult = NonNullable<
  Awaited<ReturnType<typeof createBusinessHour>>
>;
export type CreateBusinessHourMutationBody = CreateBusinessHourBody;
export type CreateBusinessHourMutationError =
  | CreateBusinessHour400
  | CreateBusinessHour404
  | CreateBusinessHour409;

export const useCreateBusinessHour = <
  TError =
    | CreateBusinessHour400
    | CreateBusinessHour404
    | CreateBusinessHour409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createBusinessHour>>,
      TError,
      { data: CreateBusinessHourBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createBusinessHour>>,
  TError,
  { data: CreateBusinessHourBody },
  TContext
> => {
  const mutationOptions = getCreateBusinessHourMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Atualização de um horário de funcionamento.
 */
export const updateBusinessHour = (
  professionalId: string,
  updateBusinessHourBody: UpdateBusinessHourBody,
) => {
  return axiosInstance<UpdateBusinessHour200>({
    url: `/business-hours/${professionalId}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: updateBusinessHourBody,
  });
};

export const getUpdateBusinessHourMutationOptions = <
  TError = UpdateBusinessHour400 | UpdateBusinessHour404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateBusinessHour>>,
    TError,
    { professionalId: string; data: UpdateBusinessHourBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateBusinessHour>>,
  TError,
  { professionalId: string; data: UpdateBusinessHourBody },
  TContext
> => {
  const mutationKey = ["updateBusinessHour"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateBusinessHour>>,
    { professionalId: string; data: UpdateBusinessHourBody }
  > = (props) => {
    const { professionalId, data } = props ?? {};

    return updateBusinessHour(professionalId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateBusinessHourMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateBusinessHour>>
>;
export type UpdateBusinessHourMutationBody = UpdateBusinessHourBody;
export type UpdateBusinessHourMutationError =
  | UpdateBusinessHour400
  | UpdateBusinessHour404;

export const useUpdateBusinessHour = <
  TError = UpdateBusinessHour400 | UpdateBusinessHour404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateBusinessHour>>,
      TError,
      { professionalId: string; data: UpdateBusinessHourBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateBusinessHour>>,
  TError,
  { professionalId: string; data: UpdateBusinessHourBody },
  TContext
> => {
  const mutationOptions = getUpdateBusinessHourMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Listar horários de funcionamento.
 */
export const listBusinessHours = (
  professionalId: string,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListBusinessHours200>({
    url: `/business-hours/${professionalId}`,
    method: "GET",
    signal,
  });
};

export const getListBusinessHoursQueryKey = (professionalId: string) => {
  return [`/business-hours/${professionalId}`] as const;
};

export const getListBusinessHoursInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listBusinessHours>>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListBusinessHoursQueryKey(professionalId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listBusinessHours>>
  > = ({ signal }) => listBusinessHours(professionalId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listBusinessHours>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListBusinessHoursInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listBusinessHours>>
>;
export type ListBusinessHoursInfiniteQueryError =
  | ListBusinessHours400
  | ListBusinessHours404;

export function useListBusinessHoursInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listBusinessHours>>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listBusinessHours>>,
          TError,
          Awaited<ReturnType<typeof listBusinessHours>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListBusinessHoursInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listBusinessHours>>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listBusinessHours>>,
          TError,
          Awaited<ReturnType<typeof listBusinessHours>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListBusinessHoursInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listBusinessHours>>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListBusinessHoursInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listBusinessHours>>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListBusinessHoursInfiniteQueryOptions(
    professionalId,
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

export const getListBusinessHoursQueryOptions = <
  TData = Awaited<ReturnType<typeof listBusinessHours>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListBusinessHoursQueryKey(professionalId);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listBusinessHours>>
  > = ({ signal }) => listBusinessHours(professionalId, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof listBusinessHours>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListBusinessHoursQueryResult = NonNullable<
  Awaited<ReturnType<typeof listBusinessHours>>
>;
export type ListBusinessHoursQueryError =
  | ListBusinessHours400
  | ListBusinessHours404;

export function useListBusinessHours<
  TData = Awaited<ReturnType<typeof listBusinessHours>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listBusinessHours>>,
          TError,
          Awaited<ReturnType<typeof listBusinessHours>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListBusinessHours<
  TData = Awaited<ReturnType<typeof listBusinessHours>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listBusinessHours>>,
          TError,
          Awaited<ReturnType<typeof listBusinessHours>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListBusinessHours<
  TData = Awaited<ReturnType<typeof listBusinessHours>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListBusinessHours<
  TData = Awaited<ReturnType<typeof listBusinessHours>>,
  TError = ListBusinessHours400 | ListBusinessHours404,
>(
  professionalId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listBusinessHours>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListBusinessHoursQueryOptions(
    professionalId,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Deletar um horário de funcionamento.
 */
export const deleteBusinessHour = (businessHoursId: string) => {
  return axiosInstance<DeleteBusinessHour204>({
    url: `/business-hours/${businessHoursId}`,
    method: "DELETE",
  });
};

export const getDeleteBusinessHourMutationOptions = <
  TError =
    | DeleteBusinessHour400
    | DeleteBusinessHour403
    | DeleteBusinessHour404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteBusinessHour>>,
    TError,
    { businessHoursId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteBusinessHour>>,
  TError,
  { businessHoursId: string },
  TContext
> => {
  const mutationKey = ["deleteBusinessHour"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteBusinessHour>>,
    { businessHoursId: string }
  > = (props) => {
    const { businessHoursId } = props ?? {};

    return deleteBusinessHour(businessHoursId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteBusinessHourMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteBusinessHour>>
>;

export type DeleteBusinessHourMutationError =
  | DeleteBusinessHour400
  | DeleteBusinessHour403
  | DeleteBusinessHour404;

export const useDeleteBusinessHour = <
  TError =
    | DeleteBusinessHour400
    | DeleteBusinessHour403
    | DeleteBusinessHour404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteBusinessHour>>,
      TError,
      { businessHoursId: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof deleteBusinessHour>>,
  TError,
  { businessHoursId: string },
  TContext
> => {
  const mutationOptions = getDeleteBusinessHourMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
