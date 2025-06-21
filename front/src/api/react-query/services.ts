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
  DeleteServicesId204,
  DeleteServicesId400,
  DeleteServicesId404,
  DeleteServicesIdParams,
  GetServices200,
  GetServices400,
  GetServices404,
  GetServicesId200,
  GetServicesId400,
  GetServicesId404,
  GetServicesParams,
  PatchServicesIdStatus200,
  PatchServicesIdStatus400,
  PatchServicesIdStatus404,
  PostServices201,
  PostServices400,
  PostServices403,
  PostServices404,
  PostServicesBody,
  PutServicesId200,
  PutServicesId400,
  PutServicesId404,
  PutServicesIdBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

export const postServices = (
  postServicesBody: PostServicesBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostServices201>({
    url: `/services`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postServicesBody,
    signal,
  });
};

export const getPostServicesMutationOptions = <
  TError = PostServices400 | PostServices403 | PostServices404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postServices>>,
    TError,
    { data: PostServicesBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postServices>>,
  TError,
  { data: PostServicesBody },
  TContext
> => {
  const mutationKey = ["postServices"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postServices>>,
    { data: PostServicesBody }
  > = (props) => {
    const { data } = props ?? {};

    return postServices(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostServicesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postServices>>
>;
export type PostServicesMutationBody = PostServicesBody;
export type PostServicesMutationError =
  | PostServices400
  | PostServices403
  | PostServices404;

export const usePostServices = <
  TError = PostServices400 | PostServices403 | PostServices404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postServices>>,
    TError,
    { data: PostServicesBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postServices>>,
  TError,
  { data: PostServicesBody },
  TContext
> => {
  const mutationOptions = getPostServicesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getServices = (
  params?: GetServicesParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetServices200>({
    url: `/services`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetServicesQueryKey = (params?: GetServicesParams) => {
  return [`/services`, ...(params ? [params] : [])] as const;
};

export const getGetServicesInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getServices>>,
  TError = GetServices400 | GetServices404,
>(
  params?: GetServicesParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getServices>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetServicesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getServices>>> = ({
    signal,
  }) => getServices(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getServices>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetServicesInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getServices>>
>;
export type GetServicesInfiniteQueryError = GetServices400 | GetServices404;

export function useGetServicesInfinite<
  TData = Awaited<ReturnType<typeof getServices>>,
  TError = GetServices400 | GetServices404,
>(
  params?: GetServicesParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getServices>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetServicesInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetServicesQueryOptions = <
  TData = Awaited<ReturnType<typeof getServices>>,
  TError = GetServices400 | GetServices404,
>(
  params?: GetServicesParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getServices>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetServicesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getServices>>> = ({
    signal,
  }) => getServices(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getServices>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetServicesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getServices>>
>;
export type GetServicesQueryError = GetServices400 | GetServices404;

export function useGetServices<
  TData = Awaited<ReturnType<typeof getServices>>,
  TError = GetServices400 | GetServices404,
>(
  params?: GetServicesParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getServices>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetServicesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getServicesId = (id: string, signal?: AbortSignal) => {
  return axiosInstance<GetServicesId200>({
    url: `/services/${id}`,
    method: "GET",
    signal,
  });
};

export const getGetServicesIdQueryKey = (id: string) => {
  return [`/services/${id}`] as const;
};

export const getGetServicesIdInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getServicesId>>,
  TError = GetServicesId400 | GetServicesId404,
>(
  id: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getServicesId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetServicesIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getServicesId>>> = ({
    signal,
  }) => getServicesId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getServicesId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetServicesIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getServicesId>>
>;
export type GetServicesIdInfiniteQueryError =
  | GetServicesId400
  | GetServicesId404;

export function useGetServicesIdInfinite<
  TData = Awaited<ReturnType<typeof getServicesId>>,
  TError = GetServicesId400 | GetServicesId404,
>(
  id: string,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getServicesId>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetServicesIdInfiniteQueryOptions(id, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetServicesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getServicesId>>,
  TError = GetServicesId400 | GetServicesId404,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getServicesId>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetServicesIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getServicesId>>> = ({
    signal,
  }) => getServicesId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getServicesId>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetServicesIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getServicesId>>
>;
export type GetServicesIdQueryError = GetServicesId400 | GetServicesId404;

export function useGetServicesId<
  TData = Awaited<ReturnType<typeof getServicesId>>,
  TError = GetServicesId400 | GetServicesId404,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getServicesId>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetServicesIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const putServicesId = (
  id: string,
  putServicesIdBody: PutServicesIdBody,
) => {
  return axiosInstance<PutServicesId200>({
    url: `/services/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putServicesIdBody,
  });
};

export const getPutServicesIdMutationOptions = <
  TError = PutServicesId400 | PutServicesId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putServicesId>>,
    TError,
    { id: string; data: PutServicesIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putServicesId>>,
  TError,
  { id: string; data: PutServicesIdBody },
  TContext
> => {
  const mutationKey = ["putServicesId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putServicesId>>,
    { id: string; data: PutServicesIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return putServicesId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutServicesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putServicesId>>
>;
export type PutServicesIdMutationBody = PutServicesIdBody;
export type PutServicesIdMutationError = PutServicesId400 | PutServicesId404;

export const usePutServicesId = <
  TError = PutServicesId400 | PutServicesId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putServicesId>>,
    TError,
    { id: string; data: PutServicesIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putServicesId>>,
  TError,
  { id: string; data: PutServicesIdBody },
  TContext
> => {
  const mutationOptions = getPutServicesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteServicesId = (
  id: string,
  params?: DeleteServicesIdParams,
) => {
  return axiosInstance<DeleteServicesId204>({
    url: `/services/${id}`,
    method: "DELETE",
    params,
  });
};

export const getDeleteServicesIdMutationOptions = <
  TError = DeleteServicesId400 | DeleteServicesId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteServicesId>>,
    TError,
    { id: string; params?: DeleteServicesIdParams },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteServicesId>>,
  TError,
  { id: string; params?: DeleteServicesIdParams },
  TContext
> => {
  const mutationKey = ["deleteServicesId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteServicesId>>,
    { id: string; params?: DeleteServicesIdParams }
  > = (props) => {
    const { id, params } = props ?? {};

    return deleteServicesId(id, params);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteServicesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteServicesId>>
>;

export type DeleteServicesIdMutationError =
  | DeleteServicesId400
  | DeleteServicesId404;

export const useDeleteServicesId = <
  TError = DeleteServicesId400 | DeleteServicesId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteServicesId>>,
    TError,
    { id: string; params?: DeleteServicesIdParams },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteServicesId>>,
  TError,
  { id: string; params?: DeleteServicesIdParams },
  TContext
> => {
  const mutationOptions = getDeleteServicesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const patchServicesIdStatus = (id: string) => {
  return axiosInstance<PatchServicesIdStatus200>({
    url: `/services/${id}/status`,
    method: "PATCH",
  });
};

export const getPatchServicesIdStatusMutationOptions = <
  TError = PatchServicesIdStatus400 | PatchServicesIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchServicesIdStatus>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchServicesIdStatus>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ["patchServicesIdStatus"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchServicesIdStatus>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return patchServicesIdStatus(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchServicesIdStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchServicesIdStatus>>
>;

export type PatchServicesIdStatusMutationError =
  | PatchServicesIdStatus400
  | PatchServicesIdStatus404;

export const usePatchServicesIdStatus = <
  TError = PatchServicesIdStatus400 | PatchServicesIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchServicesIdStatus>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchServicesIdStatus>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getPatchServicesIdStatusMutationOptions(options);

  return useMutation(mutationOptions);
};
