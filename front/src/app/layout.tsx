import type { Metadata } from "next";
import { Spectral, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/menu/header";

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  display: "swap",
});

const type_second = Spectral({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--type-second-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: "El Bigódon Barber Shop",
  description:
    "Corte na régua, barba afiada e estilo de verdade. Atendimento de primeira em um ambiente moderno e descontraído. Vem pro Bigódon!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${type_second.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-stone-50 text-sm text-stone-900">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
