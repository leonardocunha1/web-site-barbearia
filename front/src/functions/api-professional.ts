export function PROFESSIONALS_LIST(query?: {
  page?: number;
  limit?: number;
  search?: string;
  especialidade?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}) {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.especialidade) params.append("especialidade", query.especialidade);
  if (query?.status) params.append("ativo", query.status);
  if (query?.sortBy) params.append("sortBy", query.sortBy);
  if (query?.sortDirection) params.append("sortDirection", query.sortDirection);

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/professionals${queryString ? `?${queryString}` : ""}`;

  return { url, options: { method: "GET" } };
}
