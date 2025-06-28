export default function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 font-serif text-3xl font-bold text-stone-900 sm:text-4xl md:text-5xl">
      {children}
    </h2>
  );
}
