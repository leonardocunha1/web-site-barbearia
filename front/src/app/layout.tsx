import type { Metadata } from "next";
import { Spectral, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/features/menu/header";
import { ApplicationProviders } from "./providers"; // Importe o provider
import { Footer } from "@/components/footer";

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
        <ApplicationProviders>
          <div className="flex min-h-screen flex-col bg-stone-50 text-sm text-stone-900">
            <Header />
            <main className="flex items-center justify-center">{children}</main>
            <Footer />
          </div>
        </ApplicationProviders>
      </body>
    </html>
  );
}
