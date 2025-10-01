// import { notFound } from "next/navigation";

interface ProfissionalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfissionalPage({
  params,
}: ProfissionalPageProps) {
  const { id } = await params; // ⬅️ agora funciona

  // Exemplo fake (troque pelo fetch real):
  const profissional = { id, nome: "Fulano da Silva" };

  console.log("ID do profissional:", id);

  return (
    <section className="w-full flex-1 bg-stone-500 px-6 pt-[124px] pb-16 xl:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="p-[400px]">
          <h1 className="text-2xl font-bold">
            Profissional: {profissional.nome}
          </h1>
          <p>ID: {profissional.id}</p>
        </div>
      </div>
    </section>
  );
}
