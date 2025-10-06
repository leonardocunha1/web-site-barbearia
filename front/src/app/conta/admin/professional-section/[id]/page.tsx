import { servicesProfessionalGet } from "@/app/api/actions/services-professional";
import Link from "next/link";

interface ProfissionalPageProps {
  params: Promise<{ id: string }>;
  searchParams?: { page?: string; limit?: string; activeOnly?: string };
}

export default async function ProfissionalPage({
  params,
  searchParams,
}: ProfissionalPageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const page = sp?.page ? Number(sp.page) : 1;
  const limit = sp?.limit ? Number(sp.limit) : 10;
  const activeOnly = sp?.activeOnly === "true";

  const { data, ok, error } = await servicesProfessionalGet(id, {
    page,
    limit,
    activeOnly,
  });

  if (!ok || !data) {
    return (
      <section className="w-full flex-1 bg-red-200 px-6 pt-[124px] pb-16 xl:px-0">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-bold">Erro ao carregar serviços</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex-1 bg-stone-500 px-6 pt-[124px] pb-16 xl:px-0">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold">Profissional ID: {id}</h1>

        {/* Filtro activeOnly */}
        <form method="get" className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activeOnly"
              defaultChecked={activeOnly}
            />
            Apenas ativos
          </label>
          <input type="hidden" name="page" value={page} />
          <input type="hidden" name="limit" value={limit} />
          <button
            type="submit"
            className="ml-2 rounded bg-blue-500 px-3 py-1 text-white"
          >
            Filtrar
          </button>
        </form>

        <h2 className="mt-6 mb-2 text-xl font-semibold">Serviços</h2>
        <ul className="space-y-2">
          {data.services.map((service) => (
            <li key={service.id} className="rounded-lg bg-white p-4 shadow">
              <p className="font-medium">{service.nome}</p>
              <p className="text-sm text-gray-600">{service.descricao}</p>
              <p className="text-xs text-gray-500">
                Categoria: {service.categoria ?? "—"}
              </p>
            </li>
          ))}
        </ul>

        {/* Paginação */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/profissional/${id}?page=${page - 1}&limit=${limit}&activeOnly=${activeOnly}`}
            className={`rounded bg-gray-200 px-3 py-1 ${
              page <= 1 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Anterior
          </Link>

          <Link
            href={`/profissional/${id}?page=${page + 1}&limit=${limit}&activeOnly=${activeOnly}`}
            className="rounded bg-gray-200 px-3 py-1"
          >
            Próxima
          </Link>
        </div>

        {/* Info de página */}
        <p className="mt-2 text-sm text-gray-400">
          Página {data.pagination.page} de {data.pagination.totalPages} | Total:{" "}
          {data.pagination.total}
        </p>

        {/* Seleção de limite */}
        <form method="get" className="mt-2">
          <label>
            Serviços por página:{" "}
            <select name="limit" defaultValue={String(limit)}>
              {[5, 10, 20, 50].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <input type="hidden" name="page" value={page} />
          <input type="hidden" name="activeOnly" value={String(activeOnly)} />
          <button
            type="submit"
            className="ml-2 rounded bg-blue-500 px-3 py-1 text-white"
          >
            Aplicar
          </button>
        </form>
      </div>
    </section>
  );
}
