import ClientDashboard from "@/features/conta/cliente/dashboard";

export default function Page() {
  return (
    <section className="w-full flex-1 bg-stone-500 px-6 pt-[124px] xl:px-0">
      <div className="mx-auto max-w-7xl">
        <ClientDashboard />
      </div>
    </section>
  );
}
