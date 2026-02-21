"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardRicetta from "@/components/CardRicetta";
import { getRicettePreferite } from "@/lib/ricette-service";
import { useAuth } from "@/lib/auth-context";
import { Ricetta } from "@/types";

export default function PreferitiPage() {
  const { user, utente, loading: authLoading, accediConGoogle } = useAuth();
  const router = useRouter();
  const [ricette, setRicette] = useState<Ricetta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!utente) {
      setLoading(false);
      return;
    }

    getRicettePreferite(utente.preferiti)
      .then(setRicette)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [utente, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="form-login-prompt">
          <h2>Accedi per vedere i tuoi preferiti</h2>
          <p>Devi effettuare l&apos;accesso per salvare e visualizzare le tue ricette preferite.</p>
          <button
            onClick={accediConGoogle}
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Accedi con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-titolo">Le Tue Ricette Preferite</h1>
      <p className="page-sottotitolo">
        Le ricette che hai salvato nella tua collezione personale
      </p>

      {ricette.length > 0 ? (
        <div className="griglia-ricette">
          {ricette.map((r) => (
            <CardRicetta key={r.id} ricetta={r} />
          ))}
        </div>
      ) : (
        <div className="stato-vuoto">
          <div className="stato-vuoto-icona">💛</div>
          <p>Non hai ancora salvato nessuna ricetta.</p>
          <p style={{ marginTop: "0.5rem" }}>
            Esplora le ricette e clicca sul cuore per salvarle!
          </p>
          <button
            onClick={() => router.push("/ricette")}
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Esplora le Ricette
          </button>
        </div>
      )}
    </div>
  );
}
