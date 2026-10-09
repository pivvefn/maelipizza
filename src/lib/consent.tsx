"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * Gestione del consenso cookie.
 *
 * Le preferenze sono salvate in un cookie tecnico `maeli-consent` (12 mesi,
 * SameSite=Lax) letto e scritto solo dal browser. Il cookie è uno "store"
 * esterno a React: viene esposto con useSyncExternalStore e le modifiche
 * notificate con un evento dedicato.
 *
 * Categorie:
 * - necessari: sempre attivi (preferenze di consenso + carrello locale);
 * - statistiche: Vercel Analytics (misurazione anonima);
 * - mappa: iframe Google Maps della home.
 */
const COOKIE_NAME = "maeli-consent";
const SCADENZA_SECONDI = 365 * 24 * 60 * 60;
const EVENTO_CAMBIO = "maeli:consenso-change";

export type PreferenzeConsensi = {
  statistiche: boolean;
  mappa: boolean;
};

const SOLO_NECESSARI: PreferenzeConsensi = { statistiche: false, mappa: false };
const TUTTI: PreferenzeConsensi = { statistiche: true, mappa: true };

type ConsensoContext = {
  /** Preferenze salvate; `null` finché l'utente non ha scelto. */
  preferenze: PreferenzeConsensi | null;
  /** `true` dopo l'idratazione: evita che il banner flickeri a chi ha già scelto. */
  pronta: boolean;
  /** La modale di gestione preferenze è aperta (dalla pagina o dal footer). */
  aperta: boolean;
  apriPreferenze: () => void;
  chiudiPreferenze: () => void;
  /** Salva le preferenze e chiude la modale. */
  salva: (p: PreferenzeConsensi) => void;
  accettaTutto: () => void;
  rifiutaTutto: () => void;
};

const Contesto = createContext<ConsensoContext | null>(null);

function leggiCookieRaw(): string {
  if (typeof document === "undefined") return "";
  return document.cookie;
}

function parseCookie(raw: string): PreferenzeConsensi | null {
  const riga = raw
    .split("; ")
    .find((r) => r.startsWith(`${COOKIE_NAME}=`));
  if (!riga) return null;
  try {
    const valore = JSON.parse(
      decodeURIComponent(riga.slice(COOKIE_NAME.length + 1)),
    ) as Partial<PreferenzeConsensi>;
    if (
      typeof valore.statistiche !== "boolean" ||
      typeof valore.mappa !== "boolean"
    ) {
      return null;
    }
    return { statistiche: valore.statistiche, mappa: valore.mappa };
  } catch {
    return null;
  }
}

function subscribe(onCambio: () => void) {
  window.addEventListener(EVENTO_CAMBIO, onCambio);
  return () => window.removeEventListener(EVENTO_CAMBIO, onCambio);
}

function scriviCookie(p: PreferenzeConsensi) {
  const payload = encodeURIComponent(JSON.stringify(p));
  document.cookie =
    `${COOKIE_NAME}=${payload}; Max-Age=${SCADENZA_SECONDI}; ` +
    "Path=/; SameSite=Lax";
  window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, leggiCookieRaw, () => "");
  const preferenze = useMemo(() => parseCookie(raw), [raw]);
  const [pronta, setPronta] = useState(false);
  const [aperta, setAperta] = useState(false);

  // Dopo l'idratazione (fuori dal primo paint): evita che il banner appaia
  // per un solo frame a chi il consenso l'ha già dato.
  useEffect(() => {
    const id = requestAnimationFrame(() => setPronta(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const salva = useCallback((p: PreferenzeConsensi) => {
    scriviCookie(p);
    setAperta(false);
  }, []);

  const valore = useMemo<ConsensoContext>(
    () => ({
      preferenze,
      pronta,
      aperta,
      apriPreferenze: () => setAperta(true),
      chiudiPreferenze: () => setAperta(false),
      salva,
      accettaTutto: () => salva(TUTTI),
      rifiutaTutto: () => salva(SOLO_NECESSARI),
    }),
    [preferenze, pronta, aperta, salva],
  );

  return <Contesto.Provider value={valore}>{children}</Contesto.Provider>;
}

export function useConsenso(): ConsensoContext {
  const ctx = useContext(Contesto);
  if (!ctx) {
    throw new Error("useConsenso deve essere usato dentro ConsentProvider");
  }
  return ctx;
}
