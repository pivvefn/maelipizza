<div align="center">

<img src="https://wvcdapuyhqrrymxckchf.supabase.co/storage/v1/object/public/pages_images/logo-maeli-pizza.png" width="140" alt="Logo Maeli Pizza">

# Maeli Pizza — Sito Ufficiale

**Sito vetrina della pizzeria Maeli** — Campocroce di Mogliano Veneto (TV)

Listino dinamico aggiornato dal database, novità e promozioni, allergeni,
chi siamo e contatti sempre a portata di click.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

</div>

---

## Panoramica

Il sito è composto da quattro pagine:

| Pagina | Descrizione |
|---|---|
| **Home** (`/`) | Hero, slider delle pizze in evidenza, mappa interattiva, orari e contatti |
| **Listino** (`/listino`) | Tutte le pizze divise per categoria, con prezzi, ingredienti, simboli degli allergeni e legenda — **interamente generato dal database** |
| **Novità** (`/novita`) | Articoli, promozioni e ricorrenze, con filtri per argomento |
| **Chi Siamo** (`/chi-siamo`) | La storia della pizzeria, gli impasti artigianali e la lavorazione a forno a legna |

## Caratteristiche

- 🍕 **Listino dinamico** — categorie, pizze, ingredienti, allergeni, teglie e formati arrivano da Supabase: per aggiornare il listino si interviene sul database, non sul codice
- 🏷️ **Sezioni Novità** — le categorie e gli articoli contrassegnati come novità vengono evidenziati automaticamente
- 🚩 **Simboli allergeni** — per ogni pizza vengono mostrati solo gli allergeni presenti nei suoi ingredienti, con legenda completa
- 📱 **Design responsive** — navigazione con menu a scomparsa, layout ottimizzato per mobile e desktop
- ⚡ **Prestazioni** — pagine statiche con revalidazione automatica (ISR) e animazioni di ingresso leggere
- ♿ **Accessibilità** — markup semantico, ARIA e navigazione da tastiera

## Stack tecnologico

| Tecnologia | Ruolo |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | Framework, pagine, API route, ISR |
| [React 19](https://react.dev) | Interfacce a componenti |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling e design system (tema M3) |
| [TypeScript](https://www.typescriptlang.org) | Tipizzazione statica |
| [Supabase](https://supabase.com) | Database PostgreSQL (solo lato server) |
| [shadcn/ui](https://ui.shadcn.com) + Radix | Componenti UI (pulsanti, menu, collassabili) |

Il design visivo nasce da un progetto [Google Stitch](https://stitch.withgoogle.com) e viene mantenuto fedelmente nel codice.

## Struttura del progetto

```
maeli-snc/
├── src/
│   ├── app/                 Pagine e rotte (App Router)
│   │   ├── layout.tsx       Layout radice, metadata e favicon
│   │   ├── page.tsx         Homepage (/)
│   │   ├── globals.css      Tema globale e stili (Tailwind v4)
│   │   ├── listino/         Listino pizze
│   │   ├── novita/          Articoli e novità
│   │   ├── chi-siamo/       Chi siamo
│   │   └── api/             API (health, news)
│   │
│   ├── components/
│   │   ├── ui/              Componenti base (shadcn/ui)
│   │   ├── layout/          Header e footer
│   │   ├── pages/           Componenti delle pagine (listino, novità)
│   │   ├── home/            Slider pizze e mappa della homepage
│   │   ├── AllergenIcon.tsx Simboli degli allergeni
│   │   └── RevealOnScroll.tsx Animazioni allo scroll
│   │
│   └── lib/
│       ├── supabase/        Client Supabase (admin/client/server)
│       ├── menu.ts          Lettura del listino dal database
│       ├── news.ts          Lettura degli articoli
│       ├── images.ts        URL delle immagini (bucket Supabase Storage)
│       └── opening-hours.ts Orari di apertura
│
├── .env.example             Modello delle variabili d'ambiente
├── next.config.ts           Configurazione Next.js
├── tsconfig.json            Configurazione TypeScript
└── package.json             Script e dipendenze
```

## Avvio rapido

**Prerequisiti:** [Node.js](https://nodejs.org) ≥ 20 e un progetto [Supabase](https://supabase.com).

```bash
# 1. Installa le dipendenze
npm install

# 2. Crea il file delle variabili d'ambiente
cp .env.example .env
#    ...e inserisci le tue chiavi Supabase

# 3. Avvia il server di sviluppo
npm run dev
```

Il sito è disponibile su <http://localhost:3000>.

## Variabili d'ambiente

Le chiave vivono nel file `.env` (**mai committato**, è nel `.gitignore`):

| Variabile | Utilizzo |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del progetto Supabase (non segreto) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chiave anonima (protetta da RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo lato server**, ignora la RLS: non esporla mai |

## Script utili

| Comando | Descrizione |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Build di produzione |
| `npm run start` | Avvia la build di produzione |
| `npm run typecheck` | Controllo tipi TypeScript |
| `npm run lint` | Controlli ESLint |

Il endpoint <http://localhost:3000/api/health> verifica il collegamento al database.

## Manutenzione dei contenuti

- **Foto delle pagine**: vivono nel bucket Supabase Storage **`pages_images`** — con una cartella per pagina (`home/`, `listino/`, `novita/`, `chi-siamo/`) e il logo nella root. Per sostituire una foto basta caricarne una nuova **con lo stesso nome**: nessuna modifica al codice.
- **Foto di articoli e categorie**: bucket `news_images` e `menu_categories`, collegate dal database (`news.image_url`, `menu_items.image_url`).
- **Listino e novità**: si gestiscono dal database Supabase (`menu_categories`, `menu_items`, `ingredients`, `news`, `allergeni`), da cui il sito legge tutto automaticamente.
