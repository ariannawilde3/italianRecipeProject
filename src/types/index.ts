export interface Ricetta {
  id: string;
  titolo: string;
  descrizione: string;
  ingredienti: string[];
  istruzioni: string;
  regione: RegioneItaliana;
  immagineUrl?: string;
  autoreId: string;
  autoreNome: string;
  autoreFoto?: string;
  createdAt: number;
  likes: number;
}

export interface Utente {
  uid: string;
  nome: string;
  email: string;
  fotoUrl?: string;
  preferiti: string[];
}

export type RegioneItaliana =
  | "Valle d'Aosta"
  | "Piemonte"
  | "Lombardia"
  | "Trentino-Alto Adige"
  | "Veneto"
  | "Friuli Venezia Giulia"
  | "Liguria"
  | "Emilia-Romagna"
  | "Toscana"
  | "Umbria"
  | "Marche"
  | "Lazio"
  | "Abruzzo"
  | "Molise"
  | "Campania"
  | "Puglia"
  | "Basilicata"
  | "Calabria"
  | "Sicilia"
  | "Sardegna";

export const REGIONI: RegioneItaliana[] = [
  "Valle d'Aosta",
  "Piemonte",
  "Lombardia",
  "Trentino-Alto Adige",
  "Veneto",
  "Friuli Venezia Giulia",
  "Liguria",
  "Emilia-Romagna",
  "Toscana",
  "Umbria",
  "Marche",
  "Lazio",
  "Abruzzo",
  "Molise",
  "Campania",
  "Puglia",
  "Basilicata",
  "Calabria",
  "Sicilia",
  "Sardegna",
];
