"use client";

import { useState } from "react";
import Link from "next/link";
import { useConsenso, type PreferenzeConsensi } from "@/lib/consent";

type Categoria = {
  chiave: keyof PreferenzeConsensi | "necessari";
  titolo: string;
  descrizione: string;
  icona: string;
};

const CATEGORIE: Categoria[] = [
  {
    chiave: "necessari",
    titolo: "Necessari",
    descrizione:
      "Sempre attivi: salvano le tue preferenze sui cookie e il carrello del listino sul tuo dispositivo.",
    icona: "verified_user",
  },
  {
    chiave: "statistiche",
    titolo: "Statistiche",
    descrizione:
      "Misurazione anonima delle visite (Vercel Analytics), senza cookie di profilazione.",
    icona: "query_stats",
  },
  {
    chiave: "mappa",
    titolo: "Mappa Google",
    descrizione:
      "Carica la mappa interattiva di Google Maps. Se la rifiuti, la mappa non viene visualizzata.",
    icona: "map",
  },
];

function Toggle({
  attivo,
  disabilitato,
  etichetta,
  onCambio,
}: {
  attivo: boolean;
  disabilitato?: boolean;
  etichetta: string;
  onCambio?: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={attivo}
      aria-label={etichetta}
      disabled={disabilitato}
      onClick={() => onCambio?.(!attivo)}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 ${
        attivo ? "bg-secondary" : "bg-surface-container-highest"
      } ${disabilitato ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        aria-hidden
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
          attivo ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/**
 * Modale del consenso: appare alla prima visita (scelta obbligatoria) e si
 * riapre dalla pagina informativa o dal footer per modificare le preferenze.
 */
export default function CookieConsent() {
  const {
    preferenze,
    pronta,
    aperta,
    chiudiPreferenze,
    salva,
    accettaTutto,
    rifiutaTutto,
  } = useConsenso();
  const [personalizza, setPersonalizza] = useState(false);

  const primaVisita = pronta && preferenze === null;
  const gestione = pronta && aperta && preferenze !== null;
  const visibile = primaVisita || gestione;
  const mostraToggle = personalizza || gestione;

  // Stato provvisorio dei toggle durante la personalizzazione.
  const [bozza, setBozza] = useState<PreferenzeConsensi>({
    statistiche: false,
    mappa: false,
  });
  const [bozzaPrecedente, setBozzaPrecedente] =
    useState<PreferenzeConsensi | null>(null);
  // Alla riapertura in modalità gestione si riparte dalle preferenze salvate.
  if (gestione && preferenze && bozzaPrecedente !== preferenze) {
    setBozzaPrecedente(preferenze);
    setBozza(preferenze);
  }

  // Alla chiusura si riparte dalla vista di sintesi (toggle nascosti).
  const [eraVisibile, setEraVisibile] = useState(false);
  if (visibile !== eraVisibile) {
    setEraVisibile(visibile);
    if (!visibile) setPersonalizza(false);
  }

  if (!visibile) return null;

  // Nella prima visita la scelta è obbligatoria: l'overlay non chiude.
  const sovrapposizioneChiusa = primaVisita;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titolo-consent"
      onClick={() => {
        if (!sovrapposizioneChiusa) chiudiPreferenze();
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div
        className="modal-in relative w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl border border-surface-container p-space-md sm:p-space-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="w-11 h-11 shrink-0 rounded-full bg-primary-container/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">
              cookie
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="titolo-consent"
              className="font-headline-sm text-headline-sm font-bold text-on-surface"
            >
              Cookie e privacy
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Usiamo cookie tecnici e, con il tuo consenso, servizi terzi come
              le statistiche e la mappa Google. Scegli tu: la navigazione resta
              comunque pienamente utilizzabile.
            </p>
          </div>
          {!primaVisita && (
            <button
              type="button"
              onClick={chiudiPreferenze}
              aria-label="Chiudi"
              className="shrink-0 w-8 h-8 rounded-full text-on-surface-variant hover:text-primary hover:bg-neutral-100 transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          )}
        </div>

        {mostraToggle && (
          <div className="mt-space-md space-y-space-sm">
            {CATEGORIE.map((cat) => {
              const necessari = cat.chiave === "necessari";
              const attivo = necessari
                ? true
                : bozza[cat.chiave as "statistiche" | "mappa"];
              return (
                <div
                  key={cat.chiave}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container"
                >
                  <span className="w-9 h-9 shrink-0 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center border border-surface-container">
                    <span className="material-symbols-outlined text-[20px]">
                      {cat.icona}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md font-bold text-on-surface">
                        {cat.titolo}
                      </span>
                      {necessari && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wide">
                          Sempre attivi
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {cat.descrizione}
                    </p>
                  </div>
                  <Toggle
                    attivo={attivo}
                    disabilitato={necessari}
                    etichetta={cat.titolo}
                    onCambio={(val) =>
                      setBozza((b) => ({
                        ...b,
                        [cat.chiave as "statistiche" | "mappa"]: val,
                      }))
                    }
                  />
                </div>
              );
            })}
            <p className="font-body-sm text-body-sm text-on-surface-variant px-1">
              <span className="material-symbols-outlined align-[-4px] text-[15px] text-secondary">
                info
              </span>{" "}
              WhatsApp non usa cookie su questo sito: il messaggio parte
              aprendo l&apos;app sul tuo dispositivo.
            </p>
          </div>
        )}

        <div className="mt-space-md flex flex-col sm:flex-row gap-2">
          {mostraToggle ? (
            <>
              <button
                type="button"
                onClick={() => salva(bozza)}
                className="flex-1 px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors active:scale-95"
              >
                Salva preferenze
              </button>
              <button
                type="button"
                onClick={accettaTutto}
                className="flex-1 px-5 py-3 rounded-full border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:bg-neutral-100 transition-colors active:scale-95"
              >
                Accetta tutti
              </button>
              <button
                type="button"
                onClick={rifiutaTutto}
                className="flex-1 px-5 py-3 rounded-full border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:bg-neutral-100 transition-colors active:scale-95"
              >
                Solo necessari
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={accettaTutto}
                className="flex-1 px-5 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors active:scale-95"
              >
                Accetta tutti
              </button>
              <button
                type="button"
                onClick={rifiutaTutto}
                className="flex-1 px-5 py-3 rounded-full border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:bg-neutral-100 transition-colors active:scale-95"
              >
                Solo necessari
              </button>
              <button
                type="button"
                onClick={() => setPersonalizza(true)}
                className="flex-1 px-5 py-3 rounded-full text-on-surface-variant font-label-md text-label-md font-semibold hover:text-primary hover:bg-neutral-100 transition-colors active:scale-95"
              >
                Personalizza
              </button>
            </>
          )}
        </div>

        <p className="mt-3 text-center font-body-sm text-body-sm text-on-surface-variant">
          Puoi cambiare idea in qualsiasi momento:{" "}
          <Link
            href="/informativa-privacy"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Informativa e privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
