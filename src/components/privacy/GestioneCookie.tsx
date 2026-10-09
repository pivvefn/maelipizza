"use client";

import { useConsenso } from "@/lib/consent";

function StatoBadge({ attivo }: { attivo: boolean | null }) {
  if (attivo === null) {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold uppercase tracking-wide">
        Non scelto
      </span>
    );
  }
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wide ${
        attivo ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
      }`}
    >
      {attivo ? "Attivo" : "Disattivo"}
    </span>
  );
}

/**
 * Sezione della pagina informativa (anchor #cookie): mostra lo stato attuale
 * delle preferenze e riapre la modale per modificarle.
 */
export default function GestioneCookie() {
  const { preferenze, pronta, apriPreferenze } = useConsenso();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
        <div className="flex sm:flex-col items-center sm:items-start justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <span className="font-title-md text-title-md font-bold text-on-surface">
            Necessari
          </span>
          <StatoBadge attivo={true} />
        </div>
        <div className="flex sm:flex-col items-center sm:items-start justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <span className="font-title-md text-title-md font-bold text-on-surface">
            Statistiche
          </span>
          <StatoBadge
            attivo={pronta ? (preferenze?.statistiche ?? null) : null}
          />
        </div>
        <div className="flex sm:flex-col items-center sm:items-start justify-between gap-2 p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <span className="font-title-md text-title-md font-bold text-on-surface">
            Mappa Google
          </span>
          <StatoBadge attivo={pronta ? (preferenze?.mappa ?? null) : null} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={apriPreferenze}
          className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors active:scale-95"
        >
          Modifica le preferenze
        </button>
        <a
          href="/informativa-privacy"
          className="px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:bg-neutral-100 transition-colors text-center active:scale-95"
        >
          Leggi l&apos;informativa
        </a>
      </div>
    </div>
  );
}
