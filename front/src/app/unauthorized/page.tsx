import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-stone-900">
          Acesso não autorizado
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Você não tem permissão para acessar esta área.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Voltar para o início 
        </Link>
      </div>
    </section>
  );
}
