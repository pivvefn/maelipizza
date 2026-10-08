"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartItem = {
  nome: string;
  prezzo: number;
  ingredienti: string;
  quantita: number;
};

export type PizzaDaAggiungere = {
  nome: string;
  prezzo: number;
  ingredienti: string;
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
  rimuovi: (nome: string) => void;
  impostaQuantita: (nome: string, quantita: number) => void;
  pulisci: () => void;
  impostaNota: (nota: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "maeli-carrello-v1";

const STATO_VUOTO: CartState = { items: [], nota: "" };

let cache: CartState | null = null;
const listeners = new Set<() => void>();

function validaStato(value: unknown): CartState {
  const parsed = value as { items?: CartItem[]; nota?: string } | null;
  const items = Array.isArray(parsed?.items)
    ? parsed.items.filter(
        (item) =>
          item &&
          typeof item.nome === "string" &&
          typeof item.prezzo === "number" &&
          typeof item.quantita === "number",
      )
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
    const esistente = corrente.items.some((item) => item.nome === pizza.nome);
    const items = esistente
      ? corrente.items.map((item) =>
          item.nome === pizza.nome
            ? { ...item, quantita: item.quantita + 1 }
            : item,
        )
      : [...corrente.items, { ...pizza, quantita: 1 }];
    scriviStato({ ...corrente, items });
  }, []);

  const rimuovi = useCallback((nome: string) => {
    const corrente = leggiStato();
    scriviStato({
      ...corrente,
      items: corrente.items.filter((item) => item.nome !== nome),
    });
  }, []);

  const impostaQuantita = useCallback((nome: string, quantita: number) => {
    const corrente = leggiStato();
    scriviStato({
      ...corrente,
      items:
        quantita <= 0
          ? corrente.items.filter((item) => item.nome !== nome)
          : corrente.items.map((item) =>
              item.nome === nome ? { ...item, quantita } : item,
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
