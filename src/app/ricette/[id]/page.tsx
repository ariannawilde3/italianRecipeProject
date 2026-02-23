"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getRicetta, eliminaRicetta } from "@/lib/ricette-service";
import { togglePreferito } from "@/lib/ricette-service";
import { useAuth } from "@/lib/auth-context";
import { Ricetta } from "@/types";

export default function DettaglioRicettaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, utente } = useAuth();
  const router = useRouter();
  const [ricetta, setRicetta] = useState<Ricetta | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreferito, setIsPreferito] = useState(false);
  const [mostraConferma, setMostraConferma] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const isAutore = user && ricetta && user.uid === ricetta.autoreId;

  useEffect(() => {
    getRicetta(id)
      .then((r) => {
        setRicetta(r);
        if (utente && r) {
          setIsPreferito(utente.preferiti.includes(r.id));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, utente]);

  const handleToggle = async () => {
    if (!user || !ricetta) return;
    await togglePreferito(user.uid, ricetta.id, isPreferito);
    setIsPreferito(!isPreferito);
    setRicetta((prev) =>
      prev
        ? { ...prev, likes: isPreferito ? prev.likes - 1 : prev.likes + 1 }
        : prev
    );
  };

  const handleElimina = async () => {
    if (!ricetta) return;
    setEliminando(true);
    try {
      await eliminaRicetta(ricetta.id);
      router.push("/ricette");
    } catch (err) {
      console.error("Errore nell'eliminazione:", err);
      setEliminando(false);
      setMostraConferma(false);
    }
  };

  if (loading) {
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

  return (
    <div className="container">
      <div className="dettaglio-ricetta">
        <div className="dettaglio-header">
          {ricetta.immagineUrl ? (
            <img
              src={ricetta.immagineUrl}
              alt={ricetta.titolo}
              className="dettaglio-img"
            />
          ) : (
            <div className="dettaglio-img-placeholder">🍽️</div>
          )}

          <h1 className="page-titolo" style={{ textAlign: "left" }}>
            {ricetta.titolo}
          </h1>

          <div className="dettaglio-meta">
            <span className="dettaglio-badge">{ricetta.regione}</span>
            <span>
              di <strong>{ricetta.autoreNome}</strong>
            </span>
            <span>
              {new Date(ricetta.createdAt).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {user && (
              <button
                onClick={handleToggle}
                className={`btn-cuore ${isPreferito ? "attivo" : ""}`}
                style={{ fontSize: "1.1rem" }}
              >
                {isPreferito ? "❤️ Salvata" : "🤍 Salva"} ({ricetta.likes})
              </button>
            )}
          </div>

          {isAutore && (
            <div className="dettaglio-azioni-autore">
              <button
                onClick={() => router.push(`/ricette/${ricetta.id}/modifica`)}
                className="btn btn-outline btn-sm"
              >
                ✏️ Modifica
              </button>
              <button
                onClick={() => setMostraConferma(true)}
                className="btn btn-danger btn-sm"
              >
                🗑️ Elimina
              </button>
            </div>
          )}

          <p style={{ color: "var(--testo-chiaro)", fontSize: "1.05rem" }}>
            {ricetta.descrizione}
          </p>
        </div>

        <div className="dettaglio-sezione">
          <h2>Ingredienti</h2>
          <ul className="lista-ingredienti">
            {ricetta.ingredienti.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>

        <div className="dettaglio-sezione">
          <h2>Istruzioni</h2>
          <div className="dettaglio-istruzioni">{ricetta.istruzioni}</div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => router.push("/ricette")}
            className="btn btn-outline"
          >
            Torna alle Ricette
          </button>
          <button
            onClick={() => router.push(`/mappa`)}
            className="btn btn-outline"
          >
            Vedi sulla Mappa
          </button>
        </div>
      </div>

      {mostraConferma && (
        <div className="conferma-overlay" onClick={() => setMostraConferma(false)}>
          <div className="conferma-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminare questa ricetta?</h3>
            <p>
              Stai per eliminare <strong>&ldquo;{ricetta.titolo}&rdquo;</strong>.
              Questa azione non può essere annullata.
            </p>
            <div className="conferma-azioni">
              <button
                onClick={() => setMostraConferma(false)}
                className="btn btn-outline"
                disabled={eliminando}
              >
                Annulla
              </button>
              <button
                onClick={handleElimina}
                className="btn btn-danger"
                disabled={eliminando}
              >
                {eliminando ? "Eliminazione..." : "Elimina"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
