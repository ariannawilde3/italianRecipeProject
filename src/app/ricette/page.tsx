"use client";

import { useState, useEffect } from "react";
import CardRicetta from "@/components/CardRicetta";
import { getTutteRicette } from "@/lib/ricette-service";
import { Ricetta, REGIONI, RegioneItaliana } from "@/types";

export default function RicettePage() {
  const [ricette, setRicette] = useState<Ricetta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroRegione, setFiltroRegione] = useState<RegioneItaliana | "tutte">("tutte");

  useEffect(() => {
    getTutteRicette()
      .then(setRicette)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ricetteFiltrate =
    filtroRegione === "tutte"
      ? ricette
      : ricette.filter((r) => r.regione === filtroRegione);

  return (
    <div className="container">
      <h1 className="page-titolo">Tutte le Ricette</h1>
      <p className="page-sottotitolo">
        Sfoglia tutte le ricette pubblicate dalla comunità
      </p>

      <div className="filtro-regione">
        <button
          className={`filtro-btn ${filtroRegione === "tutte" ? "attivo" : ""}`}
          onClick={() => setFiltroRegione("tutte")}
        >
          Tutte
        </button>
        {REGIONI.map((r) => (
          <button
            key={r}
            className={`filtro-btn ${filtroRegione === r ? "attivo" : ""}`}
            onClick={() => setFiltroRegione(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : ricetteFiltrate.length > 0 ? (
        <div className="griglia-ricette">
          {ricetteFiltrate.map((r) => (
            <CardRicetta key={r.id} ricetta={r} />
          ))}
        </div>
      ) : (
        <div className="stato-vuoto">
          <div className="stato-vuoto-icona">📭</div>
          <p>
            {filtroRegione === "tutte"
              ? "Nessuna ricetta ancora. Sii il primo a pubblicarne una!"
              : `Nessuna ricetta per ${filtroRegione}. Aggiungine una!`}
          </p>
        </div>
      )}
    </div>
  );
}
