import type { Metadata } from "next";
import { Spectral, Poppins, Calistoga } from "next/font/google";
import "./globals.css";
import Header from "@/features/marketing/menu/header";
import { ApplicationProviders } from "./providers";
import { Footer } from "@/shared/components/footer";
import { ModalPortal } from "@/shared/components/modal-portal";

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

const type_third = Calistoga({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--type-third-calistoga",
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
        className={`${poppins.variable} ${type_second.variable} ${type_third.variable} antialiased`}
      >
        <div id="modal-root"></div>
        <ApplicationProviders>
          <div className="font-poppins flex min-h-screen flex-col bg-stone-50 text-sm text-stone-900">
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

