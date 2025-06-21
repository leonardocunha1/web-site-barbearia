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
  GetMeProfessionalDashboard200,
  GetMeProfessionalDashboard400,
  GetMeProfessionalDashboard404,
  GetMeProfessionalDashboardParams,
  GetMeProfessionalSchedule200,
  GetMeProfessionalSchedule400,
  GetMeProfessionalSchedule404,
  GetMeProfessionalScheduleParams,
  GetProfessionals200,
  GetProfessionals400,
  GetProfessionalsParams,
  PatchProfessionalsId200,
  PatchProfessionalsId400,
  PatchProfessionalsId404,
  PatchProfessionalsIdBody,
  PatchProfessionalsIdStatus200,
  PatchProfessionalsIdStatus400,
  PatchProfessionalsIdStatus404,
  PostProfessionals201,
  PostProfessionals400,
  PostProfessionals404,
  PostProfessionals409,
  PostProfessionalsBody,
} from "../schemas";

import { axiosInstance } from "../http/axios-instance";

export const postProfessionals = (
  postProfessionalsBody: PostProfessionalsBody,
  signal?: AbortSignal,
) => {
  return axiosInstance<PostProfessionals201>({
    url: `/professionals`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postProfessionalsBody,
    signal,
  });
};

export const getPostProfessionalsMutationOptions = <
  TError = PostProfessionals400 | PostProfessionals404 | PostProfessionals409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProfessionals>>,
    TError,
    { data: PostProfessionalsBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postProfessionals>>,
  TError,
  { data: PostProfessionalsBody },
  TContext
> => {
  const mutationKey = ["postProfessionals"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postProfessionals>>,
    { data: PostProfessionalsBody }
  > = (props) => {
    const { data } = props ?? {};

    return postProfessionals(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostProfessionalsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postProfessionals>>
>;
export type PostProfessionalsMutationBody = PostProfessionalsBody;
export type PostProfessionalsMutationError =
  | PostProfessionals400
  | PostProfessionals404
  | PostProfessionals409;

export const usePostProfessionals = <
  TError = PostProfessionals400 | PostProfessionals404 | PostProfessionals409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProfessionals>>,
    TError,
    { data: PostProfessionalsBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postProfessionals>>,
  TError,
  { data: PostProfessionalsBody },
  TContext
> => {
  const mutationOptions = getPostProfessionalsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getProfessionals = (
  params: GetProfessionalsParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetProfessionals200>({
    url: `/professionals`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetProfessionalsQueryKey = (params: GetProfessionalsParams) => {
  return [`/professionals`, ...(params ? [params] : [])] as const;
};

export const getGetProfessionalsInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getProfessionals>>,
  TError = GetProfessionals400,
>(
  params: GetProfessionalsParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getProfessionals>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetProfessionalsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionals>>
  > = ({ signal }) => getProfessionals(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getProfessionals>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetProfessionalsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProfessionals>>
>;
export type GetProfessionalsInfiniteQueryError = GetProfessionals400;

export function useGetProfessionalsInfinite<
  TData = Awaited<ReturnType<typeof getProfessionals>>,
  TError = GetProfessionals400,
>(
  params: GetProfessionalsParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getProfessionals>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetProfessionalsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetProfessionalsQueryOptions = <
  TData = Awaited<ReturnType<typeof getProfessionals>>,
  TError = GetProfessionals400,
>(
  params: GetProfessionalsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getProfessionals>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetProfessionalsQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getProfessionals>>
  > = ({ signal }) => getProfessionals(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getProfessionals>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetProfessionalsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProfessionals>>
>;
export type GetProfessionalsQueryError = GetProfessionals400;

export function useGetProfessionals<
  TData = Awaited<ReturnType<typeof getProfessionals>>,
  TError = GetProfessionals400,
>(
  params: GetProfessionalsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getProfessionals>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetProfessionalsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const patchProfessionalsId = (
  id: string,
  patchProfessionalsIdBody: PatchProfessionalsIdBody,
) => {
  return axiosInstance<PatchProfessionalsId200>({
    url: `/professionals/${id}`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: patchProfessionalsIdBody,
  });
};

export const getPatchProfessionalsIdMutationOptions = <
  TError = PatchProfessionalsId400 | PatchProfessionalsId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchProfessionalsId>>,
    TError,
    { id: string; data: PatchProfessionalsIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchProfessionalsId>>,
  TError,
  { id: string; data: PatchProfessionalsIdBody },
  TContext
> => {
  const mutationKey = ["patchProfessionalsId"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchProfessionalsId>>,
    { id: string; data: PatchProfessionalsIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchProfessionalsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchProfessionalsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchProfessionalsId>>
>;
export type PatchProfessionalsIdMutationBody = PatchProfessionalsIdBody;
export type PatchProfessionalsIdMutationError =
  | PatchProfessionalsId400
  | PatchProfessionalsId404;

export const usePatchProfessionalsId = <
  TError = PatchProfessionalsId400 | PatchProfessionalsId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchProfessionalsId>>,
    TError,
    { id: string; data: PatchProfessionalsIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchProfessionalsId>>,
  TError,
  { id: string; data: PatchProfessionalsIdBody },
  TContext
> => {
  const mutationOptions = getPatchProfessionalsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const patchProfessionalsIdStatus = (id: string) => {
  return axiosInstance<PatchProfessionalsIdStatus200>({
    url: `/professionals/${id}/status`,
    method: "PATCH",
  });
};

export const getPatchProfessionalsIdStatusMutationOptions = <
  TError = PatchProfessionalsIdStatus400 | PatchProfessionalsIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchProfessionalsIdStatus>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchProfessionalsIdStatus>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ["patchProfessionalsIdStatus"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchProfessionalsIdStatus>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return patchProfessionalsIdStatus(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchProfessionalsIdStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchProfessionalsIdStatus>>
>;

export type PatchProfessionalsIdStatusMutationError =
  | PatchProfessionalsIdStatus400
  | PatchProfessionalsIdStatus404;

export const usePatchProfessionalsIdStatus = <
  TError = PatchProfessionalsIdStatus400 | PatchProfessionalsIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchProfessionalsIdStatus>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchProfessionalsIdStatus>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getPatchProfessionalsIdStatusMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getMeProfessionalDashboard = (
  params: GetMeProfessionalDashboardParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetMeProfessionalDashboard200>({
    url: `/me/professional/dashboard`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetMeProfessionalDashboardQueryKey = (
  params: GetMeProfessionalDashboardParams,
) => {
  return [`/me/professional/dashboard`, ...(params ? [params] : [])] as const;
};

export const getGetMeProfessionalDashboardInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
  TError = GetMeProfessionalDashboard400 | GetMeProfessionalDashboard404,
>(
  params: GetMeProfessionalDashboardParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetMeProfessionalDashboardQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getMeProfessionalDashboard>>
  > = ({ signal }) => getMeProfessionalDashboard(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMeProfessionalDashboardInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMeProfessionalDashboard>>
>;
export type GetMeProfessionalDashboardInfiniteQueryError =
  | GetMeProfessionalDashboard400
  | GetMeProfessionalDashboard404;

export function useGetMeProfessionalDashboardInfinite<
  TData = Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
  TError = GetMeProfessionalDashboard400 | GetMeProfessionalDashboard404,
>(
  params: GetMeProfessionalDashboardParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMeProfessionalDashboardInfiniteQueryOptions(
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

export const getGetMeProfessionalDashboardQueryOptions = <
  TData = Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
  TError = GetMeProfessionalDashboard400 | GetMeProfessionalDashboard404,
>(
  params: GetMeProfessionalDashboardParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetMeProfessionalDashboardQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getMeProfessionalDashboard>>
  > = ({ signal }) => getMeProfessionalDashboard(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMeProfessionalDashboardQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMeProfessionalDashboard>>
>;
export type GetMeProfessionalDashboardQueryError =
  | GetMeProfessionalDashboard400
  | GetMeProfessionalDashboard404;

export function useGetMeProfessionalDashboard<
  TData = Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
  TError = GetMeProfessionalDashboard400 | GetMeProfessionalDashboard404,
>(
  params: GetMeProfessionalDashboardParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalDashboard>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMeProfessionalDashboardQueryOptions(
    params,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getMeProfessionalSchedule = (
  params: GetMeProfessionalScheduleParams,
  signal?: AbortSignal,
) => {
  return axiosInstance<GetMeProfessionalSchedule200>({
    url: `/me/professional/schedule`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetMeProfessionalScheduleQueryKey = (
  params: GetMeProfessionalScheduleParams,
) => {
  return [`/me/professional/schedule`, ...(params ? [params] : [])] as const;
};

export const getGetMeProfessionalScheduleInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
  TError = GetMeProfessionalSchedule400 | GetMeProfessionalSchedule404,
>(
  params: GetMeProfessionalScheduleParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetMeProfessionalScheduleQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getMeProfessionalSchedule>>
  > = ({ signal }) => getMeProfessionalSchedule(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMeProfessionalScheduleInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMeProfessionalSchedule>>
>;
export type GetMeProfessionalScheduleInfiniteQueryError =
  | GetMeProfessionalSchedule400
  | GetMeProfessionalSchedule404;

export function useGetMeProfessionalScheduleInfinite<
  TData = Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
  TError = GetMeProfessionalSchedule400 | GetMeProfessionalSchedule404,
>(
  params: GetMeProfessionalScheduleParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
      TError,
      TData
    >;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMeProfessionalScheduleInfiniteQueryOptions(
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

export const getGetMeProfessionalScheduleQueryOptions = <
  TData = Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
  TError = GetMeProfessionalSchedule400 | GetMeProfessionalSchedule404,
>(
  params: GetMeProfessionalScheduleParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
      TError,
      TData
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetMeProfessionalScheduleQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getMeProfessionalSchedule>>
  > = ({ signal }) => getMeProfessionalSchedule(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetMeProfessionalScheduleQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMeProfessionalSchedule>>
>;
export type GetMeProfessionalScheduleQueryError =
  | GetMeProfessionalSchedule400
  | GetMeProfessionalSchedule404;

export function useGetMeProfessionalSchedule<
  TData = Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
  TError = GetMeProfessionalSchedule400 | GetMeProfessionalSchedule404,
>(
  params: GetMeProfessionalScheduleParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getMeProfessionalSchedule>>,
      TError,
      TData
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetMeProfessionalScheduleQueryOptions(
    params,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
