import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Ricetta, RegioneItaliana } from "@/types";

const RICETTE_COLLECTION = "ricette";
const UTENTI_COLLECTION = "utenti";

export async function creaRicetta(
  ricetta: Omit<Ricetta, "id" | "createdAt" | "likes">
): Promise<string> {
  // Remove undefined fields – Firestore rejects them
  const data: Record<string, unknown> = { ...ricetta, createdAt: Date.now(), likes: 0 };
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });
  const docRef = await addDoc(collection(db(), RICETTE_COLLECTION), data);
  return docRef.id;
}

export async function aggiornaRicetta(
  id: string,
  data: Partial<Omit<Ricetta, "id" | "createdAt" | "likes" | "autoreId" | "autoreNome" | "autoreFoto">>
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanData: Record<string, any> = { ...data };
  Object.keys(cleanData).forEach((key) => {
    if (cleanData[key] === undefined) delete cleanData[key];
  });
  await updateDoc(doc(db(), RICETTE_COLLECTION, id), cleanData);
}

export async function getRicetta(id: string): Promise<Ricetta | null> {
  const docSnap = await getDoc(doc(db(), RICETTE_COLLECTION, id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Ricetta;
}

export async function getRicettePerRegione(
  regione: RegioneItaliana
): Promise<Ricetta[]> {
  // Only filter by regione to avoid needing a composite Firestore index
  const q = query(
    collection(db(), RICETTE_COLLECTION),
    where("regione", "==", regione)
  );
  const snapshot = await getDocs(q);
  const ricette = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Ricetta);
  // Sort client-side by createdAt descending
  return ricette.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function getTutteRicette(): Promise<Ricetta[]> {
  const q = query(
    collection(db(), RICETTE_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Ricetta);
}

export async function togglePreferito(
  userId: string,
  ricettaId: string,
  isPreferito: boolean
): Promise<void> {
  const utenteRef = doc(db(), UTENTI_COLLECTION, userId);
  const ricettaRef = doc(db(), RICETTE_COLLECTION, ricettaId);

  if (isPreferito) {
    await updateDoc(utenteRef, { preferiti: arrayRemove(ricettaId) });
    await updateDoc(ricettaRef, { likes: increment(-1) });
  } else {
    await updateDoc(utenteRef, { preferiti: arrayUnion(ricettaId) });
    await updateDoc(ricettaRef, { likes: increment(1) });
  }
}

export async function getRicettePreferite(
  ricettaIds: string[]
): Promise<Ricetta[]> {
  if (ricettaIds.length === 0) return [];
  const ricette: Ricetta[] = [];
  for (const id of ricettaIds) {
    const ricetta = await getRicetta(id);
    if (ricetta) ricette.push(ricetta);
  }
  return ricette;
}

export async function getConteggioPerRegione(): Promise<
  Record<string, number>
> {
  const snapshot = await getDocs(collection(db(), RICETTE_COLLECTION));
  const conteggio: Record<string, number> = {};
  snapshot.docs.forEach((d) => {
    const regione = d.data().regione;
    conteggio[regione] = (conteggio[regione] || 0) + 1;
  });
  return conteggio;
}
