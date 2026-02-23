"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getRicetta } from "@/lib/ricette-service";
import { useAuth } from "@/lib/auth-context";
import { Ricetta } from "@/types";
import FormRicetta from "@/components/FormRicetta";

export default function ModificaRicettaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [ricetta, setRicetta] = useState<Ricetta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRicetta(id)
      .then((r) => setRicetta(r))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || authLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!ricetta) {
    return (
      <div className="container">
        <div className="stato-vuoto">
          <div className="stato-vuoto-icona">🔍</div>
          <p>Ricetta non trovata.</p>
          <button
            onClick={() => router.push("/ricette")}
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Torna alle Ricette
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.uid !== ricetta.autoreId) {
    return (
      <div className="container">
        <div className="stato-vuoto">
          <div className="stato-vuoto-icona">🔒</div>
          <p>Solo l&apos;autore può modificare questa ricetta.</p>
          <button
            onClick={() => router.push(`/ricette/${id}`)}
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Torna alla Ricetta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <FormRicetta ricettaEsistente={ricetta} />
    </div>
  );
}
