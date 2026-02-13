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
  CreateProfessional201,
  CreateProfessional400,
  CreateProfessional404,
  CreateProfessional409,
  CreateProfessionalBody,
  GetProfessionalDashboard200,
  GetProfessionalDashboard400,
  GetProfessionalDashboard404,
  GetProfessionalDashboardParams,
  GetProfessionalSchedule200,
  GetProfessionalSchedule400,
  GetProfessionalSchedule404,
  GetProfessionalScheduleParams,
  GetPublicProfessionalSchedule200,
  GetPublicProfessionalSchedule400,
  GetPublicProfessionalSchedule404,
  GetPublicProfessionalScheduleParams,
  ListOrSearchProfessionals200,
  ListOrSearchProfessionals400,
  ListOrSearchProfessionalsParams,
  ToggleProfessionalStatus200,
  ToggleProfessionalStatus400,
  ToggleProfessionalStatus404,
  UpdateProfessional200,
  UpdateProfessional400,
  UpdateProfessional404,
  UpdateProfessionalBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

export const createProfessional = (
  createProfessionalBody: CreateProfessionalBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<CreateProfessional201>({
    url: `/professionals`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: createProfessionalBody,
    signal,
  });
};

export const getCreateProfessionalMutationOptions = <
  TError =
    | CreateProfessional400
    | CreateProfessional404
    | CreateProfessional409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof createProfessional>>,
    TError,
    { data: CreateProfessionalBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof createProfessional>>,
  TError,
  { data: CreateProfessionalBody },
  TContext
> => {
  const mutationKey = ["createProfessional"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof createProfessional>>,
    { data: CreateProfessionalBody }
  > = (props) => {
    const { data } = props ?? {};

    return createProfessional(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type CreateProfessionalMutationResult = NonNullable<
  Awaited<ReturnType<typeof createProfessional>>
>;
export type CreateProfessionalMutationBody = CreateProfessionalBody;
export type CreateProfessionalMutationError =
  | CreateProfessional400
  | CreateProfessional404
  | CreateProfessional409;

export const useCreateProfessional = <
  TError =
    | CreateProfessional400
    | CreateProfessional404
    | CreateProfessional409,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof createProfessional>>,
      TError,
      { data: CreateProfessionalBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof createProfessional>>,
  TError,
  { data: CreateProfessionalBody },
  TContext
> => {
  const mutationOptions = getCreateProfessionalMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const listOrSearchProfessionals = (
  params?: ListOrSearchProfessionalsParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<ListOrSearchProfessionals200>({
    url: `/professionals`,
    method: "GET",
    params,
    signal,
  });
};

export const getListOrSearchProfessionalsQueryKey = (
  params?: ListOrSearchProfessionalsParams,
) => {
  return [`/professionals`, ...(params ? [params] : [])] as const;
};

export const getListOrSearchProfessionalsInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof listOrSearchProfessionals>>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListOrSearchProfessionalsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listOrSearchProfessionals>>
  > = ({ signal }) => listOrSearchProfessionals(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof listOrSearchProfessionals>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListOrSearchProfessionalsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof listOrSearchProfessionals>>
>;
export type ListOrSearchProfessionalsInfiniteQueryError =
  ListOrSearchProfessionals400;

export function useListOrSearchProfessionalsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listOrSearchProfessionals>>>,
  TError = ListOrSearchProfessionals400,
>(
  params: undefined | ListOrSearchProfessionalsParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listOrSearchProfessionals>>,
          TError,
          Awaited<ReturnType<typeof listOrSearchProfessionals>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListOrSearchProfessionalsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listOrSearchProfessionals>>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listOrSearchProfessionals>>,
          TError,
          Awaited<ReturnType<typeof listOrSearchProfessionals>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListOrSearchProfessionalsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listOrSearchProfessionals>>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListOrSearchProfessionalsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof listOrSearchProfessionals>>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListOrSearchProfessionalsInfiniteQueryOptions(
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

export const getListOrSearchProfessionalsQueryOptions = <
  TData = Awaited<ReturnType<typeof listOrSearchProfessionals>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getListOrSearchProfessionalsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof listOrSearchProfessionals>>
  > = ({ signal }) => listOrSearchProfessionals(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listOrSearchProfessionals>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type ListOrSearchProfessionalsQueryResult = NonNullable<
  Awaited<ReturnType<typeof listOrSearchProfessionals>>
>;
export type ListOrSearchProfessionalsQueryError = ListOrSearchProfessionals400;

export function useListOrSearchProfessionals<
  TData = Awaited<ReturnType<typeof listOrSearchProfessionals>>,
  TError = ListOrSearchProfessionals400,
>(
  params: undefined | ListOrSearchProfessionalsParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listOrSearchProfessionals>>,
          TError,
          Awaited<ReturnType<typeof listOrSearchProfessionals>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListOrSearchProfessionals<
  TData = Awaited<ReturnType<typeof listOrSearchProfessionals>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listOrSearchProfessionals>>,
          TError,
          Awaited<ReturnType<typeof listOrSearchProfessionals>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useListOrSearchProfessionals<
  TData = Awaited<ReturnType<typeof listOrSearchProfessionals>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useListOrSearchProfessionals<
  TData = Awaited<ReturnType<typeof listOrSearchProfessionals>>,
  TError = ListOrSearchProfessionals400,
>(
  params?: ListOrSearchProfessionalsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof listOrSearchProfessionals>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getListOrSearchProfessionalsQueryOptions(
    params,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const updateProfessional = (
  id: string,
  updateProfessionalBody: UpdateProfessionalBody,
) => {
  return axiosInstance<UpdateProfessional200>({
    url: `/professionals/${id}`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: updateProfessionalBody,
  });
};

export const getUpdateProfessionalMutationOptions = <
  TError = UpdateProfessional400 | UpdateProfessional404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof updateProfessional>>,
    TError,
    { id: string; data: UpdateProfessionalBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof updateProfessional>>,
  TError,
  { id: string; data: UpdateProfessionalBody },
  TContext
> => {
  const mutationKey = ["updateProfessional"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateProfessional>>,
    { id: string; data: UpdateProfessionalBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return updateProfessional(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateProfessionalMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateProfessional>>
>;
export type UpdateProfessionalMutationBody = UpdateProfessionalBody;
export type UpdateProfessionalMutationError =
  | UpdateProfessional400
  | UpdateProfessional404;

export const useUpdateProfessional = <
  TError = UpdateProfessional400 | UpdateProfessional404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateProfessional>>,
      TError,
      { id: string; data: UpdateProfessionalBody },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof updateProfessional>>,
  TError,
  { id: string; data: UpdateProfessionalBody },
  TContext
> => {
  const mutationOptions = getUpdateProfessionalMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const toggleProfessionalStatus = (id: string) => {
  return axiosInstance<ToggleProfessionalStatus200>({
    url: `/professionals/${id}/status`,
    method: "PATCH",
  });
};

export const getToggleProfessionalStatusMutationOptions = <
  TError = ToggleProfessionalStatus400 | ToggleProfessionalStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof toggleProfessionalStatus>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof toggleProfessionalStatus>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ["toggleProfessionalStatus"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof toggleProfessionalStatus>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return toggleProfessionalStatus(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type ToggleProfessionalStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof toggleProfessionalStatus>>
>;

export type ToggleProfessionalStatusMutationError =
  | ToggleProfessionalStatus400
  | ToggleProfessionalStatus404;

export const useToggleProfessionalStatus = <
  TError = ToggleProfessionalStatus400 | ToggleProfessionalStatus404,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof toggleProfessionalStatus>>,
      TError,
      { id: string },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof toggleProfessionalStatus>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getToggleProfessionalStatusMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
export const getPublicProfessionalSchedule = (
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetPublicProfessionalSchedule200>({
    url: `/professionals/${professionalId}/schedule`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetPublicProfessionalScheduleQueryKey = (
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
) => {
  return [
    `/professionals/${professionalId}/schedule`,
    ...(params ? [params] : []),
  ] as const;
};

export const getGetPublicProfessionalScheduleInfiniteQueryOptions = <
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
  >,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetPublicProfessionalScheduleQueryKey(professionalId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
  > = ({ signal }) =>
    getPublicProfessionalSchedule(professionalId, params, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetPublicProfessionalScheduleInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
>;
export type GetPublicProfessionalScheduleInfiniteQueryError =
  | GetPublicProfessionalSchedule400
  | GetPublicProfessionalSchedule404;

export function useGetPublicProfessionalScheduleInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
  >,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPublicProfessionalScheduleInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
  >,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPublicProfessionalScheduleInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
  >,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetPublicProfessionalScheduleInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
  >,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetPublicProfessionalScheduleInfiniteQueryOptions(
    professionalId,
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

export const getGetPublicProfessionalScheduleQueryOptions = <
  TData = Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetPublicProfessionalScheduleQueryKey(professionalId, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
  > = ({ signal }) =>
    getPublicProfessionalSchedule(professionalId, params, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!professionalId,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetPublicProfessionalScheduleQueryResult = NonNullable<
  Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
>;
export type GetPublicProfessionalScheduleQueryError =
  | GetPublicProfessionalSchedule400
  | GetPublicProfessionalSchedule404;

export function useGetPublicProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPublicProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getPublicProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPublicProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetPublicProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
  TError = GetPublicProfessionalSchedule400 | GetPublicProfessionalSchedule404,
>(
  professionalId: string,
  params: GetPublicProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPublicProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetPublicProfessionalScheduleQueryOptions(
    professionalId,
    params,
    options,
  );

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getProfessionalDashboard = (
  params: GetProfessionalDashboardParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetProfessionalDashboard200>({
    url: `/me/professional/dashboard`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetProfessionalDashboardQueryKey = (
  params: GetProfessionalDashboardParams,
) => {
  return [`/me/professional/dashboard`, ...(params ? [params] : [])] as const;
};

export const getGetProfessionalDashboardInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalDashboard>>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetProfessionalDashboardQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionalDashboard>>
  > = ({ signal }) => getProfessionalDashboard(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getProfessionalDashboard>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetProfessionalDashboardInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProfessionalDashboard>>
>;
export type GetProfessionalDashboardInfiniteQueryError =
  | GetProfessionalDashboard400
  | GetProfessionalDashboard404;

export function useGetProfessionalDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalDashboard>>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalDashboard>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalDashboard>>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalDashboard>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalDashboard>>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetProfessionalDashboardInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalDashboard>>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetProfessionalDashboardInfiniteQueryOptions(
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

export const getGetProfessionalDashboardQueryOptions = <
  TData = Awaited<ReturnType<typeof getProfessionalDashboard>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetProfessionalDashboardQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionalDashboard>>
  > = ({ signal }) => getProfessionalDashboard(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getProfessionalDashboard>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetProfessionalDashboardQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProfessionalDashboard>>
>;
export type GetProfessionalDashboardQueryError =
  | GetProfessionalDashboard400
  | GetProfessionalDashboard404;

export function useGetProfessionalDashboard<
  TData = Awaited<ReturnType<typeof getProfessionalDashboard>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalDashboard>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalDashboard<
  TData = Awaited<ReturnType<typeof getProfessionalDashboard>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalDashboard>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalDashboard>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalDashboard<
  TData = Awaited<ReturnType<typeof getProfessionalDashboard>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetProfessionalDashboard<
  TData = Awaited<ReturnType<typeof getProfessionalDashboard>>,
  TError = GetProfessionalDashboard400 | GetProfessionalDashboard404,
>(
  params: GetProfessionalDashboardParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalDashboard>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetProfessionalDashboardQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getProfessionalSchedule = (
  params: GetProfessionalScheduleParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetProfessionalSchedule200>({
    url: `/me/professional/schedule`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetProfessionalScheduleQueryKey = (
  params: GetProfessionalScheduleParams,
) => {
  return [`/me/professional/schedule`, ...(params ? [params] : [])] as const;
};

export const getGetProfessionalScheduleInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalSchedule>>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetProfessionalScheduleQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionalSchedule>>
  > = ({ signal }) => getProfessionalSchedule(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getProfessionalSchedule>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetProfessionalScheduleInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProfessionalSchedule>>
>;
export type GetProfessionalScheduleInfiniteQueryError =
  | GetProfessionalSchedule400
  | GetProfessionalSchedule404;

export function useGetProfessionalScheduleInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalSchedule>>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalScheduleInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalSchedule>>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalScheduleInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalSchedule>>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetProfessionalScheduleInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getProfessionalSchedule>>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetProfessionalScheduleInfiniteQueryOptions(
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

export const getGetProfessionalScheduleQueryOptions = <
  TData = Awaited<ReturnType<typeof getProfessionalSchedule>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetProfessionalScheduleQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionalSchedule>>
  > = ({ signal }) => getProfessionalSchedule(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getProfessionalSchedule>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetProfessionalScheduleQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProfessionalSchedule>>
>;
export type GetProfessionalScheduleQueryError =
  | GetProfessionalSchedule400
  | GetProfessionalSchedule404;

export function useGetProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getProfessionalSchedule>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getProfessionalSchedule>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getProfessionalSchedule>>,
          TError,
          Awaited<ReturnType<typeof getProfessionalSchedule>>
        >,
        "initialData"
      >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getProfessionalSchedule>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getProfessionalSchedule>>,
  TError = GetProfessionalSchedule400 | GetProfessionalSchedule404,
>(
  params: GetProfessionalScheduleParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getProfessionalSchedule>>,
        TError,
        TData
      >
    >;
  },
  queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const queryOptions = getGetProfessionalScheduleQueryOptions(params, options);

  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey;

  return query;
}
