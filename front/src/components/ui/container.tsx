export default async function Container({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full max-w-7xl px-6">{children}</div>;
}
