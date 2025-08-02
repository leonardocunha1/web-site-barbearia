import type { Metadata } from "next";
import { Spectral, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/features/menu/header";
import { ApplicationProviders } from "./providers";
import { Footer } from "@/components/footer";
import { ModalPortal } from "@/components/modal-portal";

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
  description: "Corte na régua, barba afiada e estilo de verdade...",
};

export default async function RootLayout({
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
          <div id="modal-root" />
          <div className="flex min-h-screen flex-col bg-stone-50 text-sm text-stone-900">
            <Header />
            <main className="animate-fadeIn flex flex-1 justify-center">
              {children}
            </main>
            <Footer />
          </div>
          <ModalPortal />
        </ApplicationProviders>
      </body>
    </html>
  );
}
