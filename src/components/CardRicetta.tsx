"use client";

import Link from "next/link";
import { Ricetta } from "@/types";
import { useAuth } from "@/lib/auth-context";
import { togglePreferito } from "@/lib/ricette-service";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useCallback } from "react";

interface CardRicettaProps {
  ricetta: Ricetta;
}

export default function CardRicetta({ ricetta }: CardRicettaProps) {
  const { utente, user } = useAuth();
  const [isPreferito, setIsPreferito] = useState(
    utente?.preferiti?.includes(ricetta.id) || false
  );
  const [likesCount, setLikesCount] = useState(ricetta.likes);
  const [toggling, setToggling] = useState(false);

  const handleTogglePreferito = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!user || toggling) return;

      setToggling(true);
      try {
        await togglePreferito(user.uid, ricetta.id, isPreferito);
        setIsPreferito(!isPreferito);
        setLikesCount((prev) => (isPreferito ? prev - 1 : prev + 1));

        // Refresh utente preferiti from Firestore
        const utenteSnap = await getDoc(doc(db(), "utenti", user.uid));
        if (utenteSnap.exists()) {
          const data = utenteSnap.data();
          if (utente) {
            utente.preferiti = data.preferiti || [];
          }
        }
      } catch (err) {
        console.error("Errore nel toggle preferito:", err);
      } finally {
        setToggling(false);
      }
    },
    [user, utente, ricetta.id, isPreferito, toggling]
  );

  return (
    <Link href={`/ricette/${ricetta.id}`} className="card-ricetta">
      <div className="card-header">
        {ricetta.immagineUrl ? (
          <img
            src={ricetta.immagineUrl}
            alt={ricetta.titolo}
            className="card-image"
          />
        ) : (
          <div className="card-image-placeholder">
            <span>🍽️</span>
          </div>
        )}
        <span className="card-regione">{ricetta.regione}</span>
      </div>

      <div className="card-body">
        <h3 className="card-titolo">{ricetta.titolo}</h3>
        <p className="card-descrizione">{ricetta.descrizione}</p>

        <div className="card-footer">
          <div className="card-autore">
            {ricetta.autoreFoto && (
              <img
                src={ricetta.autoreFoto}
                alt={ricetta.autoreNome}
                className="card-autore-foto"
                referrerPolicy="no-referrer"
              />
            )}
            <span>{ricetta.autoreNome}</span>
          </div>

          <button
            className={`btn-cuore ${isPreferito ? "attivo" : ""}`}
            onClick={handleTogglePreferito}
            disabled={!user}
            title={user ? (isPreferito ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti") : "Accedi per salvare"}
          >
            {isPreferito ? "❤️" : "🤍"} {likesCount}
          </button>
        </div>
      </div>
    </Link>
  );
}
