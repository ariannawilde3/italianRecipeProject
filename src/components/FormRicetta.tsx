"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { creaRicetta, aggiornaRicetta } from "@/lib/ricette-service";
import { REGIONI, RegioneItaliana, Ricetta } from "@/types";

interface FormRicettaProps {
  ricettaEsistente?: Ricetta;
}

export default function FormRicetta({ ricettaEsistente }: FormRicettaProps) {
  const isModifica = !!ricettaEsistente;
  const { user, utente } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState("");

  const [titolo, setTitolo] = useState(ricettaEsistente?.titolo ?? "");
  const [descrizione, setDescrizione] = useState(ricettaEsistente?.descrizione ?? "");
  const [ingredienti, setIngredienti] = useState(
    ricettaEsistente?.ingredienti.join("\n") ?? ""
  );
  const [istruzioni, setIstruzioni] = useState(ricettaEsistente?.istruzioni ?? "");
  const [regione, setRegione] = useState<RegioneItaliana>(
    ricettaEsistente?.regione ?? "Lazio"
  );
  const [immagineUrl, setImmagineUrl] = useState(ricettaEsistente?.immagineUrl ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !utente) {
      setErrore("Devi accedere per pubblicare una ricetta.");
      return;
    }

    if (!titolo.trim() || !descrizione.trim() || !ingredienti.trim() || !istruzioni.trim()) {
      setErrore("Compila tutti i campi obbligatori.");
      return;
    }

    setLoading(true);
    setErrore("");

    try {
      const listaIngredienti = ingredienti
        .split("\n")
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      if (isModifica) {
        await aggiornaRicetta(ricettaEsistente.id, {
          titolo: titolo.trim(),
          descrizione: descrizione.trim(),
          ingredienti: listaIngredienti,
          istruzioni: istruzioni.trim(),
          regione,
          immagineUrl: immagineUrl.trim() || undefined,
        });
        router.push(`/ricette/${ricettaEsistente.id}`);
      } else {
        const id = await creaRicetta({
          titolo: titolo.trim(),
          descrizione: descrizione.trim(),
          ingredienti: listaIngredienti,
          istruzioni: istruzioni.trim(),
          regione,
          immagineUrl: immagineUrl.trim() || undefined,
          autoreId: user.uid,
          autoreNome: utente.nome,
          autoreFoto: utente.fotoUrl,
        });
        router.push(`/ricette/${id}`);
      }
    } catch (err) {
      console.error(isModifica ? "Errore nella modifica:" : "Errore nella creazione:", err);
      setErrore("Si è verificato un errore. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="form-login-prompt">
        <h2>Accedi per condividere la tua ricetta</h2>
        <p>Devi effettuare l&apos;accesso con Google per pubblicare una nuova ricetta.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-ricetta">
      <h2>{isModifica ? "Modifica Ricetta" : "Pubblica una Nuova Ricetta"}</h2>

      {errore && <div className="form-errore">{errore}</div>}

      <div className="form-gruppo">
        <label htmlFor="titolo">Titolo della ricetta *</label>
        <input
          id="titolo"
          type="text"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
          placeholder="Es. Pasta alla Carbonara"
          required
        />
      </div>

      <div className="form-gruppo">
        <label htmlFor="descrizione">Descrizione breve *</label>
        <input
          id="descrizione"
          type="text"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          placeholder="Una breve descrizione del piatto"
          required
        />
      </div>

      <div className="form-gruppo">
        <label htmlFor="regione">Regione *</label>
        <select
          id="regione"
          value={regione}
          onChange={(e) => setRegione(e.target.value as RegioneItaliana)}
          required
        >
          {REGIONI.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="form-gruppo">
        <label htmlFor="ingredienti">Ingredienti * (uno per riga)</label>
        <textarea
          id="ingredienti"
          value={ingredienti}
          onChange={(e) => setIngredienti(e.target.value)}
          placeholder={"200g di spaghetti\n100g di guanciale\n4 uova\nPecorino Romano\nPepe nero"}
          rows={6}
          required
        />
      </div>

      <div className="form-gruppo">
        <label htmlFor="istruzioni">Istruzioni *</label>
        <textarea
          id="istruzioni"
          value={istruzioni}
          onChange={(e) => setIstruzioni(e.target.value)}
          placeholder="Descrivi passo dopo passo come preparare il piatto..."
          rows={8}
          required
        />
      </div>

      <div className="form-gruppo">
        <label htmlFor="immagineUrl">URL dell&apos;immagine (opzionale)</label>
        <input
          id="immagineUrl"
          type="url"
          value={immagineUrl}
          onChange={(e) => setImmagineUrl(e.target.value)}
          placeholder="https://esempio.com/foto-piatto.jpg"
        />
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading
          ? isModifica
            ? "Salvataggio..."
            : "Pubblicazione..."
          : isModifica
            ? "Salva Modifiche"
            : "Pubblica Ricetta"}
      </button>
    </form>
  );
}
