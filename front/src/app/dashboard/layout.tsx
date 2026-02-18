import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | El Bigódon Barber Shop",
  description: "Painel de controle e gerenciamento",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
