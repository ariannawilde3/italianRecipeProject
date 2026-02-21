import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata: Metadata = {
  title: "Ricette d'Italia - Condividi le ricette della tua regione",
  description:
    "Scopri e condividi ricette tradizionali italiane, organizzate per regione su una mappa interattiva.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
