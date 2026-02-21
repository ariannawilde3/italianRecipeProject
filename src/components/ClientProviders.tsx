"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
      <footer className="footer">
        <p>Ricette d&apos;Italia &copy; 2026 - Fatto con amore per la cucina italiana</p>
      </footer>
    </AuthProvider>
  );
}
