export function SERVICES_GET(query?: {
  page?: number;
  limit?: number;
  nome?: string;
  categoria?: string;
  ativo?: boolean;
  professionalId?: string;
}) {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.nome) params.append("nome", query.nome);
  if (query?.categoria) params.append("categoria", query.categoria);
  if (query?.ativo !== undefined) params.append("ativo", String(query.ativo));
  if (query?.professionalId) params.append("professionalId", query.professionalId);

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/services${
    queryString ? `?${queryString}` : ""
  }`;

  return {
    url,
    options: {
      method: "GET",
    },
  };
}

export function SERVICES_UPDATE(
  id: string,
  data: {
    nome?: string;
    descricao?: string;
    precoPadrao?: number;
    duracao?: number;
    categoria?: string;
    ativo?: boolean;
  },
  token: string
) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/services/${id}`;

  return {
    url,
    options: {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  };
}

export function SERVICES_CREATE(
  data: {
    nome: string;
    descricao?: string;
    precoPadrao?: number;
    duracao?: number;
    categoria?: string;
    ativo?: boolean;
  },
  token: string
) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/services`;

  return {
    url,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  };
}

