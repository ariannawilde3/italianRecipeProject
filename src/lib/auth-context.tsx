"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { Utente } from "@/types";

interface AuthContextType {
  user: User | null;
  utente: Utente | null;
  loading: boolean;
  accediConGoogle: () => Promise<void>;
  esci: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  utente: null,
  loading: true,
  accediConGoogle: async () => {},
  esci: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [utente, setUtente] = useState<Utente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth(), async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const utenteRef = doc(db(), "utenti", firebaseUser.uid);
        const utenteSnap = await getDoc(utenteRef);
        if (utenteSnap.exists()) {
          setUtente(utenteSnap.data() as Utente);
        } else {
          const nuovoUtente: Utente = {
            uid: firebaseUser.uid,
            nome: firebaseUser.displayName || "Utente",
            email: firebaseUser.email || "",
            fotoUrl: firebaseUser.photoURL || undefined,
            preferiti: [],
          };
          await setDoc(utenteRef, nuovoUtente);
          setUtente(nuovoUtente);
        }
      } else {
        setUtente(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const accediConGoogle = async () => {
    await signInWithPopup(auth(), googleProvider());
  };

  const esci = async () => {
    await firebaseSignOut(auth());
    setUtente(null);
  };

  return (
    <AuthContext.Provider value={{ user, utente, loading, accediConGoogle, esci }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
