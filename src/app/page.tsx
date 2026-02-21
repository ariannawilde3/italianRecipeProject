"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, accediConGoogle } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="hero-bandiera">🇮🇹</div>
        <h1>Ricette d&apos;Italia</h1>
        <p>
          Scopri le ricette tradizionali di ogni regione italiana. Condividi i
          tuoi piatti preferiti e esplora la mappa gastronomica d&apos;Italia.
        </p>
        <div className="hero-actions">
          <Link href="/mappa" className="btn btn-primary">
            Esplora la Mappa
          </Link>
          <Link href="/ricette" className="btn btn-secondary">
            Tutte le Ricette
          </Link>
          {!user && (
            <button onClick={accediConGoogle} className="btn btn-outline">
              Accedi con Google
            </button>
          )}
        </div>
      </section>

      <div className="sezioni-home">
        <Link href="/mappa" className="sezione-card">
          <div className="sezione-card-icona">🗺️</div>
          <h3>Mappa Interattiva</h3>
          <p>
            Clicca su ogni regione della mappa d&apos;Italia per scoprire le
            ricette tipiche del territorio.
          </p>
          <span className="btn btn-outline btn-sm">Vai alla Mappa</span>
        </Link>

        <Link href="/ricette" className="sezione-card">
          <div className="sezione-card-icona">📖</div>
          <h3>Tutte le Ricette</h3>
          <p>
            Sfoglia tutte le ricette pubblicate dagli studenti, filtra per
            regione e trova ispirazione.
          </p>
          <span className="btn btn-outline btn-sm">Sfoglia Ricette</span>
        </Link>

        <Link href={user ? "/ricette/nuova" : "#"} className="sezione-card" onClick={!user ? (e) => { e.preventDefault(); accediConGoogle(); } : undefined}>
          <div className="sezione-card-icona">👨‍🍳</div>
          <h3>Condividi una Ricetta</h3>
          <p>
            Hai una ricetta della tradizione? Pubblicala e condividila con gli
            altri studenti.
          </p>
          <span className="btn btn-outline btn-sm">
            {user ? "Pubblica Ricetta" : "Accedi per Pubblicare"}
          </span>
        </Link>

        <Link href={user ? "/preferiti" : "#"} className="sezione-card" onClick={!user ? (e) => { e.preventDefault(); accediConGoogle(); } : undefined}>
          <div className="sezione-card-icona">❤️</div>
          <h3>I Tuoi Preferiti</h3>
          <p>
            Salva le ricette che ti piacciono di più e ritrovale facilmente
            nella tua collezione personale.
          </p>
          <span className="btn btn-outline btn-sm">
            {user ? "Vai ai Preferiti" : "Accedi per Salvare"}
          </span>
        </Link>
      </div>
    </>
  );
}
