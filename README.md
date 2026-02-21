# Ricette d'Italia

Un'applicazione web per studenti dove è possibile condividere, esplorare e salvare ricette tradizionali italiane, organizzate per regione su una mappa interattiva.

## Funzionalità

- **Mappa Interattiva** - Clicca sulle regioni d'Italia per scoprire le ricette di ogni territorio
- **Pubblica Ricette** - Carica le tue ricette con ingredienti, istruzioni e immagini
- **Esplora Ricette** - Sfoglia tutte le ricette con filtri per regione
- **Preferiti** - Salva le tue ricette preferite nella tua collezione personale
- **Autenticazione Google** - Accedi con il tuo account Google

## Tecnologie

- **Next.js 15** con App Router e TypeScript
- **Firebase** (Authentication + Firestore)
- **Tailwind CSS** + CSS personalizzato
- SVG mappa d'Italia interattiva

## Configurazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Crea un file `.env.local` basandoti su `.env.example` con le tue credenziali Firebase:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
4. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

## Configurazione Firebase

1. Crea un progetto su [Firebase Console](https://console.firebase.google.com)
2. Attiva **Authentication** con provider Google
3. Attiva **Cloud Firestore** e crea le seguenti regole di sicurezza:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /ricette/{ricettaId} {
         allow read: if true;
         allow create: if request.auth != null;
         allow update: if request.auth != null;
       }
       match /utenti/{userId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
