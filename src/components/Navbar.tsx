"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function Navbar() {
  const { user, utente, accediConGoogle, esci } = useAuth();
  const [menuAperto, setMenuAperto] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">🍝</span>
          <span className="logo-text">Ricette d&apos;Italia</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuAperto(!menuAperto)}
          aria-label="Menu"
        >
          <span className={`hamburger ${menuAperto ? "open" : ""}`} />
        </button>

        <div className={`navbar-links ${menuAperto ? "open" : ""}`}>
          <Link href="/mappa" onClick={() => setMenuAperto(false)}>
            Mappa
          </Link>
          <Link href="/ricette" onClick={() => setMenuAperto(false)}>
            Tutte le Ricette
          </Link>
          {user && (
            <>
              <Link href="/ricette/nuova" onClick={() => setMenuAperto(false)}>
                Nuova Ricetta
              </Link>
              <Link href="/preferiti" onClick={() => setMenuAperto(false)}>
                Preferiti
              </Link>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              {utente?.fotoUrl && (
                <img
                  src={utente.fotoUrl}
                  alt={utente.nome}
                  className="user-avatar"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="user-name">{utente?.nome}</span>
              <button onClick={esci} className="btn btn-outline btn-sm">
                Esci
              </button>
            </div>
          ) : (
            <button onClick={accediConGoogle} className="btn btn-primary btn-sm">
              Accedi con Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
