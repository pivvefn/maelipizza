"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type DosaggioQuantita =
  | "poco"
  | "normale"
  | "abbondante"
  | "rimosso";

export type ModificaIngredienti = {
  nome: string;
  stato: DosaggioQuantita;
  prezzo: number;
  isExtra: boolean;
};

export type Personalizzazione = {
  formato: { nome: string; prezzo: number } | null;
  impasto: { nome: string; prezzo: number } | null;
  modifiche: ModificaIngredienti[];
  nota: string;
};

export type CartItem = {
  id: string;
  nome: string;
  prezzo: number;
  ingredienti: string;
  quantita: number;
  personalizza?: Personalizzazione;
  /** Nome della pizza scelta, se si tratta di una "Pizza Mini + Mini Bibita". */
  mini?: string;
};

export type PizzaDaAggiungere = {
  nome: string;
  prezzo: number;
  ingredienti: string;
  /** Nome della pizza mini scelta (solo per il menu Mini). */
  mini?: string;
};

export type CartState = {
  items: CartItem[];
  nota: string;
};

export type CartContextValue = {
  items: CartItem[];
  nota: string;
  totalePezzi: number;
  aggiungi: (pizza: PizzaDaAggiungere) => void;
  aggiungiPersonalizzata: (
    pizza: PizzaDaAggiungere,
    prezzo: number,
    personalizza: Personalizzazione | undefined,
  ) => void;
  aggiornaPersonalizzazione: (
    id: string,
    prezzo: number,
    personalizza: Personalizzazione | undefined,
  ) => void;
  rimuovi: (id: string) => void;
  impostaQuantita: (id: string, quantita: number) => void;
  pulisci: () => void;
  impostaNota: (nota: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Aggiunge un messaggio standard alle note esistenti, concatenandolo senza
 * cancellare il contenuto già presente.
 */
export function appendiNota(attuale: string, testo: string): string {
  if (attuale.trim() === "") return testo;
  return `${attuale}${attuale.endsWith(" ") ? "" : " "}${testo}`;
}

const STORAGE_KEY = "maeli-carrello-v1";

const STATO_VUOTO: CartState = { items: [], nota: "" };

function uuid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

let cache: CartState | null = null;
const listeners = new Set<() => void>();

function validaStato(value: unknown): CartState {
  const parsed = value as
    | { items?: CartItem[]; nota?: string }
    | null;
  const items = Array.isArray(parsed?.items)
    ? parsed.items
        .filter(
          (item) =>
            item &&
            typeof item.nome === "string" &&
            typeof item.prezzo === "number" &&
            typeof item.quantita === "number",
        )
        .map((item) => ({
          ...item,
          id: typeof item.id === "string" && item.id ? item.id : item.nome,
        }))
    : [];
  const nota = typeof parsed?.nota === "string" ? parsed.nota : "";
  return { items, nota };
}

function leggiStato(): CartState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? validaStato(JSON.parse(raw)) : STATO_VUOTO;
  } catch {
    cache = STATO_VUOTO;
  }
  return cache;
}

function persistiStato(stato: CartState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stato));
    return true;
  } catch {
    return false;
  }
}

function scriviStato(nuovo: CartState) {
  cache = nuovo;
  persistiStato(nuovo);
  listeners.forEach((listener) => listener());
}

function getSnapshot(): CartState {
  return leggiStato();
}

function getServerSnapshot(): CartState {
  return STATO_VUOTO;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const stato = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const aggiungi = useCallback((pizza: PizzaDaAggiungere) => {
    const corrente = leggiStato();
    // Merge SOLO con un'identica versione "pulita" (senza personalizzazione):
    // una pizza modificata non deve assorbire aggiunte non modificate.
    const esistente = corrente.items.find(
      (item) => item.nome === pizza.nome && !item.personalizza,
    );
    const items = esistente
      ? corrente.items.map((item) =>
          item.id === esistente.id
            ? { ...item, quantita: item.quantita + 1 }
            : item,
        )
      : [
          ...corrente.items,
          {
            id: uuid(),
            nome: pizza.nome,
            prezzo: pizza.prezzo,
            ingredienti: pizza.ingredienti,
            quantita: 1,
            ...(pizza.mini ? { mini: pizza.mini } : {}),
          },
        ];
    scriviStato({ ...corrente, items });
  }, []);

  const aggiungiPersonalizzata = useCallback(
    (
      pizza: PizzaDaAggiungere,
      prezzo: number,
      personalizza: Personalizzazione | undefined,
    ) => {
      const corrente = leggiStato();
      const id = uuid();
      scriviStato({
        ...corrente,
        items: [
          ...corrente.items,
          {
            id,
            nome: pizza.nome,
            prezzo,
            ingredienti: pizza.ingredienti,
            quantita: 1,
            ...(pizza.mini ? { mini: pizza.mini } : {}),
            ...(personalizza ? { personalizza } : {}),
          },
        ],
      });
    },
    [],
  );

  const aggiornaPersonalizzazione = useCallback(
    (
      id: string,
      prezzo: number,
      personalizza: Personalizzazione | undefined,
    ) => {
      const corrente = leggiStato();
      scriviStato({
        ...corrente,
        items: corrente.items.map((item) => {
          if (item.id !== id) return item;
          const aggiornato: CartItem = { ...item, prezzo };
          if (personalizza) aggiornato.personalizza = personalizza;
          else delete aggiornato.personalizza;
          return aggiornato;
        }),
      });
    },
    [],
  );

  const rimuovi = useCallback((id: string) => {
    const corrente = leggiStato();
    scriviStato({
      ...corrente,
      items: corrente.items.filter((item) => item.id !== id),
    });
  }, []);

  const impostaQuantita = useCallback((id: string, quantita: number) => {
    const corrente = leggiStato();
    scriviStato({
      ...corrente,
      items:
        quantita <= 0
          ? corrente.items.filter((item) => item.id !== id)
          : corrente.items.map((item) =>
              item.id === id ? { ...item, quantita } : item,
            ),
    });
  }, []);

  const pulisci = useCallback(() => {
    scriviStato(STATO_VUOTO);
  }, []);

  const impostaNota = useCallback((nuova: string) => {
    scriviStato({ ...leggiStato(), nota: nuova });
  }, []);

  const totalePezzi = useMemo(
    () => stato.items.reduce((somma, item) => somma + item.quantita, 0),
    [stato.items],
  );

  const value = useMemo(
    () => ({
      items: stato.items,
      nota: stato.nota,
      totalePezzi,
      aggiungi,
      aggiungiPersonalizzata,
      aggiornaPersonalizzazione,
      rimuovi,
      impostaQuantita,
      pulisci,
      impostaNota,
    }),
    [
      stato.items,
      stato.nota,
      totalePezzi,
      aggiungi,
      aggiungiPersonalizzata,
      aggiornaPersonalizzazione,
      rimuovi,
      impostaQuantita,
      pulisci,
      impostaNota,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart deve essere utilizzato all'interno di CartProvider",
    );
  }
  return context;
}
