import { servicesProfessionalGet } from "@/app/api/actions/services-professional";
import ProfessionalServicesTable from "@/features/conta/admin/professional-section/id/professional-service-table";
import { GoBackButton } from "@/components/ui/go-back-button";

interface ProfissionalPageProps {
  params: { id: string };
  searchParams?: {
    page?: string;
    limit?: string;
    activeOnly?: string;
  };
}

export default async function ProfissionalPage({
  params,
  searchParams,
}: ProfissionalPageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const page = Number(sp?.page ?? 1);
  const limit = Number(sp?.limit ?? 10);
  const activeOnly = sp?.activeOnly === "true";

  const { data, ok, error } = await servicesProfessionalGet(id, {
    page,
    limit,
    activeOnly,
  });

  if (!ok || !data) {
    return <div>Erro: {error}</div>;
  }

  return (
    <section className="w-full flex-1 bg-stone-100 px-6 pt-[124px] pb-16 xl:px-0">
      <div className="mx-auto max-w-7xl">
        <GoBackButton href="/conta?tab=info-professional" />

        <h1 className="mt-4 mb-4 text-2xl font-bold">
          Serviços do Profissional {id}
        </h1>

        <ProfessionalServicesTable
          data={data.services}
          pagination={data.pagination}
          activeOnly={activeOnly}
          id={id}
        />
      </div>
    </section>
  );
}
