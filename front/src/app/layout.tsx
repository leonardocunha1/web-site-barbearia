import type { Metadata } from "next";
import { Poppins, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/features/marketing/menu/conditional-header";
import { ApplicationProviders } from "./providers";
import { ConditionalFooter } from "@/shared/components/conditional-footer";
import { ModalPortal } from "@/shared/components/modal-portal";
import { ErrorBoundary } from "@/shared/components/error-boundary";

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  display: "swap",
});

const display = Fraunces({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--type-third-calistoga",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--type-mono-editorial",
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
        className={`${poppins.variable} ${display.variable} ${mono.variable} antialiased`}
      >
        <div id="modal-root"></div>
        <ApplicationProviders>
          <ErrorBoundary>
            <div className="font-poppins flex min-h-screen flex-col bg-stone-50 text-sm text-stone-900">
              <ConditionalHeader />
              <main className="animate-fadeIn flex flex-1 justify-center">
                {children}
              </main>
              <ConditionalFooter />
            </div>
          </ErrorBoundary>
          <ModalPortal />
        </ApplicationProviders>
      </body>
    </html>
  );
}

