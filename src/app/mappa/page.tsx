"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MappaItalia from "@/components/MappaItalia";
import CardRicetta from "@/components/CardRicetta";
import { getRicettePerRegione, getConteggioPerRegione } from "@/lib/ricette-service";
import { Ricetta, RegioneItaliana } from "@/types";

export default function MappaPage() {
  const router = useRouter();
  const [regioneSelezionata, setRegioneSelezionata] = useState<RegioneItaliana | null>(null);
  const [ricette, setRicette] = useState<Ricetta[]>([]);
  const [conteggio, setConteggio] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getConteggioPerRegione().then(setConteggio).catch(console.error);
  }, []);

  const handleRegioneClick = async (regione: RegioneItaliana) => {
    setRegioneSelezionata(regione);
    setLoading(true);
    try {
      const risultati = await getRicettePerRegione(regione);
      setRicette(risultati);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-titolo">Mappa delle Ricette d&apos;Italia</h1>
      <p className="page-sottotitolo">
        Clicca su una regione per scoprire le ricette tipiche del territorio
      </p>

      <MappaItalia onRegioneClick={handleRegioneClick} conteggio={conteggio} />

      <div className="mappa-legenda">
        <div className="legenda-item">
          <div className="legenda-colore" style={{ background: "#e8e0d4" }} />
          <span>0 ricette</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-colore" style={{ background: "#f0c8a0" }} />
          <span>1-2</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-colore" style={{ background: "#e8a060" }} />
          <span>3-5</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-colore" style={{ background: "#d07030" }} />
          <span>6-10</span>
        </div>
        <div className="legenda-item">
          <div className="legenda-colore" style={{ background: "#b84020" }} />
          <span>10+</span>
        </div>
      </div>

      {regioneSelezionata && (
        <div style={{ marginTop: "2rem" }}>
          <h2 className="page-titolo" style={{ fontSize: "1.5rem" }}>
            Ricette da: {regioneSelezionata}
          </h2>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner" />
            </div>
          ) : ricette.length > 0 ? (
            <div className="griglia-ricette">
              {ricette.map((r) => (
                <CardRicetta key={r.id} ricetta={r} />
              ))}
            </div>
          ) : (
            <div className="stato-vuoto">
              <div className="stato-vuoto-icona">🍽️</div>
              <p>Nessuna ricetta ancora per {regioneSelezionata}.</p>
              <p style={{ marginTop: "0.5rem" }}>Sii il primo a pubblicarne una!</p>
              <button
                onClick={() => router.push("/ricette/nuova")}
                className="btn btn-primary"
                style={{ marginTop: "1rem" }}
              >
                Aggiungi Ricetta
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
