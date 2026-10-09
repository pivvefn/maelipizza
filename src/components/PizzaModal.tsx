"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  appendiNota,
  type DosaggioQuantita,
  type ModificaIngredienti,
  type Personalizzazione,
  type PizzaDaAggiungere,
} from "@/lib/cart";
import {
  formatPrice,
  type Dimensione,
  type ExtraVoce,
  type Impasto,
  type IngredienteExtra,
  type OpzioneMini,
  type Pizza,
} from "@/lib/menu";
import { isWeekend } from "@/lib/opening-hours";

type OpzioneFormato = {
  nome: string;
  prezzo: number;
  nota: string | null;
  eBattuta: boolean;
};

type PizzaModalProps = {
  pizza: Pizza;
  isNovita: boolean;
  /**
   * "aggiungi": CTA verde "Aggiungi al Carrello" (listino).
   * "modifica": CTA "Conferma Modifiche" (carrello), con lo stato
   * pre-popolato da `personalizzaIniziale`.
   */
  modo: "aggiungi" | "modifica";
  personalizzaIniziale?: Personalizzazione;
  /**
   * Modalità Mini: se presente, la modale mostra solo la scelta della mini e
   * il dosaggio/rimozione degli ingredienti (nessun formato/impasto/extra).
   */
  modalitaMini?: {
    opzioni: OpzioneMini[];
    /** Pre-selezione (apertura dal carrello su una mini già aggiunta). */
    scelta: string | null;
  };
  dimensioni: Dimensione[];
  impasti: Impasto[];
  ingredientiExtra: IngredienteExtra[];
  extraGenerali: ExtraVoce[];
  /** Messaggi standard cliccabili sotto il campo note (tabella pizza_note). */
  noteStandard: string[];
  onChiudi: () => void;
  onConferma: (
    pizza: PizzaDaAggiungere,
    prezzo: number,
    personalizza: Personalizzazione | undefined,
  ) => void;
};

/** "Battute (no sabato e domenica)" -> nome "Battuta", nota "no sabato e domenica". */
function dividiNomeNota(testo: string): { nome: string; nota: string | null } {
  const corrisponde = /^(.*?)\s*\((.+)\)\s*$/.exec(testo);
  if (corrisponde) {
    const nome = corrisponde[1].trim();
    const nota = corrisponde[2].trim();
    if (nome && nota) return { nome, nota };
  }
  return { nome: testo.trim(), nota: null };
}

/**
 * Costo/sconto di un dosaggio (può essere negativo).
 * - Extra (aggiunto): normale = prezzo, poco = prezzo − 0,50, abbondante =
 *   doppia dose (seconda aggiunta).
 * - Di serie: normale = 0, poco = −0,50, abbondante = dose in più a prezzo,
 *   rimosso = sconto del prezzo dell'ingrediente.
 * - Mini: "poco" non applica riduzioni (nessuno sconto).
 */
function costoDosaggio(
  stato: DosaggioQuantita,
  prezzoUnitario: number,
  isExtra: boolean,
  mini = false,
): number {
  const arrotonda = (n: number) => Math.round(n * 100) / 100;
  if (isExtra) {
    if (stato === "poco") return arrotonda(prezzoUnitario - 0.5);
    if (stato === "abbondante") return arrotonda(prezzoUnitario * 2);
    return arrotonda(prezzoUnitario);
  }
  if (stato === "rimosso") return arrotonda(-prezzoUnitario);
  if (stato === "poco") return mini ? 0 : -0.5;
  if (stato === "abbondante") return arrotonda(prezzoUnitario);
  return 0;
}

function TestoSezione({
  numero,
  titolo,
  sottotitolo,
  tag,
}: {
  numero: number;
  titolo: string;
  sottotitolo?: string;
  tag?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="w-7 h-7 shrink-0 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
        {numero}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
            {titolo}
          </h3>
          {tag && (
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              {tag}
            </span>
          )}
        </div>
        {sottotitolo && (
          <p className="text-xs text-on-surface-variant mt-0.5">
            {sottotitolo}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Selettore Poco / Normale / Abbondante a stile "glass" (segmented control
 * alla Apple): pill chiara fluttuante su contenitore sfocato. Premendo e
 * trascinando con mouse o dito la pill segue il movimento ("liquid glass") e
 * al rilascio si aggancia al segmento sotto il dito.
 */
function DosaggioControl({
  valore,
  onChange,
  costoAbbondante,
}: {
  valore: DosaggioQuantita;
  onChange: (stato: DosaggioQuantita) => void;
  costoAbbondante: number;
}) {
  const opzioni: { valore: DosaggioQuantita; testo: string }[] = [
    { valore: "poco", testo: "Poco" },
    { valore: "normale", testo: "Normale" },
    {
      valore: "abbondante",
      testo:
        costoAbbondante > 0
          ? `Abbondante +€${formatPrice(costoAbbondante)}`
          : "Abbondante",
    },
  ];

  const rif = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; mosso: boolean } | null>(null);
  const ignoraClickRef = useRef(false);
  const [drag, setDrag] = useState<{ pct: number; idx: number } | null>(null);

  const indiceBase = opzioni.findIndex((o) => o.valore === valore);
  const indiceEvidenziato = drag ? drag.idx : indiceBase;

  /** Posizione (in % della pill) e indice del segmento sotto clientX. */
  const posizione = (clientX: number) => {
    const el = rif.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const segW = (rect.width - 8) / 3;
    if (segW <= 0) return null;
    const x = Math.min(
      Math.max(clientX - rect.left - 4 - segW / 2, 0),
      segW * 2,
    );
    return { pct: (x / segW) * 100, idx: Math.round(x / segW) };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    try {
      rif.current?.setPointerCapture(event.pointerId);
    } catch {
      /* puntatore non catturabile (eventi sintetici): il drag funziona comunque */
    }
    pointerRef.current = { x: event.clientX, mosso: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const p = pointerRef.current;
    if (!p) return;
    if (!p.mosso && Math.abs(event.clientX - p.x) < 6) return;
    p.mosso = true;
    const pos = posizione(event.clientX);
    if (pos) setDrag(pos);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current) return;
    pointerRef.current = null;
    try {
      rif.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* puntatore già rilasciato */
    }
    const pos = posizione(event.clientX);
    if (pos && opzioni[pos.idx]) {
      // Il click sintetico successivo non deve riselzionare.
      ignoraClickRef.current = true;
      window.setTimeout(() => {
        ignoraClickRef.current = false;
      }, 400);
      if (opzioni[pos.idx].valore !== valore) onChange(opzioni[pos.idx].valore);
    }
    setDrag(null);
  };

  const onPointerCancel = () => {
    pointerRef.current = null;
    setDrag(null);
  };

  return (
    <div
      ref={rif}
      role="group"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className="relative grid grid-cols-3 p-1 rounded-full bg-on-surface/[0.06] backdrop-blur-md border border-on-surface/10 shadow-inner touch-none select-none"
    >
      {/* Pill liquida sotto i testi */}
      <div
        aria-hidden="true"
        className={`absolute top-1 bottom-1 left-1 rounded-full bg-surface/90 backdrop-blur-md pointer-events-none ${
          drag
            ? "ring-2 ring-primary/60 shadow-lg scale-y-110 transition-transform duration-100 ease-out"
            : "ring-1 ring-on-surface/10 shadow-md transition-transform duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
        }`}
        style={{
          width: "calc((100% - 8px) / 3)",
          transform: `translateX(${drag ? drag.pct : indiceBase * 100}%)`,
          opacity: indiceBase < 0 ? 0 : 1,
        }}
      />
      {opzioni.map((opzione, idx) => {
        const attivo = indiceEvidenziato === idx;
        return (
          <button
            key={opzione.valore}
            type="button"
            aria-pressed={indiceBase === idx}
            onClick={() => {
              if (ignoraClickRef.current) return;
              onChange(opzione.valore);
            }}
            className={`relative py-1.5 px-1 rounded-full text-[11px] sm:text-xs leading-tight text-center transition-all duration-150 cursor-pointer ${
              attivo
                ? drag
                  ? "text-primary font-black scale-105"
                  : "text-on-surface font-bold"
                : drag
                  ? "text-on-surface-variant/60 font-semibold"
                  : "text-on-surface-variant font-semibold hover:text-on-surface"
            }`}
          >
            {opzione.testo}
          </button>
        );
      })}
    </div>
  );
}

function OpzioneRadio({
  nome,
  nota,
  prezzo,
  attivo,
  disabilitato,
  onClick,
}: {
  nome: string;
  nota: string | null;
  prezzo: number;
  attivo: boolean;
  disabilitato?: boolean;
  onClick: () => void;
}) {
  const etichettaPrezzo =
    prezzo === 0
      ? "Incluso"
      : prezzo < 0
        ? `−€ ${formatPrice(Math.abs(prezzo))}`
        : `+€ ${formatPrice(prezzo)}`;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={attivo}
      disabled={disabilitato}
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
        attivo
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-surface-container hover:border-outline-variant"
      } ${
        disabilitato
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
      }`}
    >
      <span className="min-w-0">
        <span className="block font-title-md text-title-md font-bold text-on-surface capitalize">
          {nome}
        </span>
        {nota && (
          <span
            className={`block text-[11px] mt-0.5 ${
              /sabato|domenica/i.test(nota)
                ? "text-primary font-semibold"
                : "text-on-surface-variant"
            }`}
          >
            {nota}
          </span>
        )}
      </span>
      <span
        className={`text-sm font-bold shrink-0 whitespace-nowrap ${
          attivo ? "text-primary" : "text-secondary"
        }`}
      >
        {etichettaPrezzo}
      </span>
    </button>
  );
}

export default function PizzaModal({
  pizza,
  isNovita,
  modo,
  personalizzaIniziale,
  modalitaMini,
  dimensioni,
  impasti,
  ingredientiExtra,
  extraGenerali,
  noteStandard,
  onChiudi,
  onConferma,
}: PizzaModalProps) {
  const panello = useRef<HTMLDivElement>(null);

  // Blocca lo scroll di fondo ed Escape per chiudere.
  useEffect(() => {
    const overflowPrecedente = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onTastiera = (event: KeyboardEvent) => {
      if (event.key === "Escape") onChiudi();
    };
    window.addEventListener("keydown", onTastiera);
    panello.current?.focus();
    return () => {
      document.body.style.overflow = overflowPrecedente;
      window.removeEventListener("keydown", onTastiera);
    };
  }, [onChiudi]);

  const weekend = isWeekend();

  // --- Modalità Mini: si sceglie solo la mini e si regolano gli ingredienti
  // di serie (nessun formato, impasto, extra o note).
  const inModoMini = !!modalitaMini;
  const [miniScelta, setMiniScelta] = useState<string | null>(
    modalitaMini?.scelta ?? null,
  );
  const opzioneMini =
    modalitaMini?.opzioni.find((o) => o.nome === miniScelta) ?? null;

  // --- Formato & Dimensione: pizza_sizes (+ Normale virtuale) + battuta da
  // categorie_extra ("Battute (no sabato e domenica)").
  const opzioniFormato: OpzioneFormato[] = (() => {
    if (inModoMini) return [];
    const righe: OpzioneFormato[] = [];
    if (!dimensioni.some((d) => d.prezzo === 0 && !/mini/i.test(d.nome))) {
      righe.push({ nome: "Normale", prezzo: 0, nota: "Standard", eBattuta: false });
    }
    for (const d of dimensioni) {
      if (/battut/i.test(d.nome)) continue;
      // Formato Mini: fuori dal modale, si gestirà in seguito.
      if (/mini/i.test(d.nome)) continue;
      const { nome, nota } = dividiNomeNota(d.nome);
      righe.push({ nome, prezzo: d.prezzo, nota, eBattuta: false });
    }
    const sorgenteBattuta =
      dimensioni.find((d) => /battut/i.test(d.nome)) ??
      extraGenerali.find((e) => /battut/i.test(e.nome));
    if (sorgenteBattuta) {
      const { nome, nota } = dividiNomeNota(sorgenteBattuta.nome);
      righe.push({
        nome,
        prezzo: sorgenteBattuta.prezzo,
        nota: nota ?? "No di Sabato e Domenica",
        eBattuta: true,
      });
    }
    return righe.sort(
      (a, b) => a.prezzo - b.prezzo || a.nome.localeCompare(b.nome, "it"),
    );
  })();

  const formatoDefault =
    opzioniFormato.find((o) => o.prezzo === 0)?.nome ??
    opzioniFormato[0]?.nome ??
    "";
  const [formato, setFormato] = useState(
    personalizzaIniziale?.formato?.nome ?? formatoDefault,
  );

  // Sabato/domenica la battuta non è selezionabile: se fosse attiva, si
  // torna all'opzione di default.
  const formatoScelto = (() => {
    const scelto =
      opzioniFormato.find((o) => o.nome === formato) ??
      opzioniFormato.find((o) => o.nome === formatoDefault) ??
      null;
    if (scelto?.eBattuta && weekend) {
      return (
        opzioniFormato.find((o) => !o.eBattuta && o.prezzo === 0) ??
        opzioniFormato.find((o) => !o.eBattuta) ??
        null
      );
    }
    return scelto;
  })();

  // --- Impasto (dough_types, tutti gli attivi)
  const impastoDefault =
    impasti.find((i) => i.prezzo === 0)?.nome ?? impasti[0]?.nome ?? "";
  const [impasto, setImpasto] = useState(
    personalizzaIniziale?.impasto?.nome ?? impastoDefault,
  );
  const impastoScelto =
    impasti.find((i) => i.nome === impasto) ??
    impasti.find((i) => i.nome === impastoDefault) ??
    impasti[0] ??
    null;

  // --- Dosaggi ingredienti di serie + extra aggiunti + nota, pre-popolati
  // dalla personalizzazione salvata (modo "modifica").
  const [dosaggi, setDosaggi] = useState<Record<string, DosaggioQuantita>>(
    () => {
      const base: Record<string, DosaggioQuantita> = {};
      for (const m of personalizzaIniziale?.modifiche ?? []) {
        if (!m.isExtra) base[m.nome] = m.stato;
      }
      return base;
    },
  );
  const [extras, setExtras] = useState<Record<string, DosaggioQuantita>>(() => {
    const base: Record<string, DosaggioQuantita> = {};
    for (const m of personalizzaIniziale?.modifiche ?? []) {
      if (m.isExtra) base[m.nome] = m.stato;
    }
    return base;
  });
  const [nota, setNota] = useState(personalizzaIniziale?.nota ?? "");
  const [ricerca, setRicerca] = useState("");

  const prezzoIngrediente = (nome: string) =>
    ingredientiExtra.find(
      (i) => i.nome.trim().toLowerCase() === nome.trim().toLowerCase(),
    )?.prezzo ?? 0;

  // Ingredienti visibili nella sezione dosaggi: quelli della pizza oppure
  // della mini selezionata (modalità Mini).
  const ingredientiAttuali = inModoMini
    ? (opzioneMini?.ingredientiNomi ?? [])
    : pizza.ingredientiNomi;
  const setIngredientiAttuali = new Set(
    ingredientiAttuali.map((n) => n.trim().toLowerCase()),
  );

  const presenti = new Set(
    pizza.ingredientiNomi.map((n) => n.trim().toLowerCase()),
  );
  const disponibili = ingredientiExtra.filter(
    (i) => i.prezzo > 0 && !presenti.has(i.nome.trim().toLowerCase()),
  );

  // Extra: quelli già aggiunti per primi, poi ricerca per nome.
  const query = ricerca.trim().toLowerCase();
  const extraDaMostrare = disponibili
    .filter((i) => i.nome.toLowerCase().includes(query))
    .sort(
      (a, b) =>
        (extras[a.nome] !== undefined ? 0 : 1) -
        (extras[b.nome] !== undefined ? 0 : 1),
    );

  // --- TOTALE live + riepilogo (i supplementi possono essere negativi: sconti)
  let totale = pizza.prezzo;
  const parti: { testo: string; neg: boolean }[] = [
    { testo: `Base € ${formatPrice(pizza.prezzo)}`, neg: false },
  ];
  if (formatoScelto && formatoScelto.prezzo !== 0) {
    totale += formatoScelto.prezzo;
    parti.push({
      testo: `Formato ${formatoScelto.nome} € ${formatPrice(Math.abs(formatoScelto.prezzo))}`,
      neg: formatoScelto.prezzo < 0,
    });
  }
  if (impastoScelto && impastoScelto.prezzo !== 0) {
    totale += impastoScelto.prezzo;
    parti.push({
      testo: `Impasto ${impastoScelto.nome} € ${formatPrice(impastoScelto.prezzo)}`,
      neg: impastoScelto.prezzo < 0,
    });
  }
  for (const [nome, stato] of Object.entries(dosaggi)) {
    if (!setIngredientiAttuali.has(nome.trim().toLowerCase())) continue;
    const costo = costoDosaggio(
      stato,
      prezzoIngrediente(nome),
      false,
      inModoMini,
    );
    if (costo !== 0) {
      totale += costo;
      parti.push({
        testo: `${nome} € ${formatPrice(Math.abs(costo))}`,
        neg: costo < 0,
      });
    }
  }
  if (!inModoMini) {
    for (const [nome, stato] of Object.entries(extras)) {
      const costo = costoDosaggio(stato, prezzoIngrediente(nome), true);
      totale += costo;
      parti.push({
        testo: `${nome} € ${formatPrice(Math.abs(costo))}`,
        neg: costo < 0,
      });
    }
  }
  totale = Math.round(totale * 100) / 100;
  const testoRiepilogo = parti.reduce(
    (acc, p, i) =>
      acc + (i === 0 ? p.testo : p.neg ? ` − ${p.testo}` : ` + ${p.testo}`),
    "",
  );

  const conferma = () => {
    if (inModoMini && !opzioneMini) return;
    const modifiche: ModificaIngredienti[] = [];
    for (const [nome, stato] of Object.entries(dosaggi)) {
      if (!setIngredientiAttuali.has(nome.trim().toLowerCase())) continue;
      if (stato === "normale") continue;
      modifiche.push({
        nome,
        stato,
        prezzo: costoDosaggio(
          stato,
          prezzoIngrediente(nome),
          false,
          inModoMini,
        ),
        isExtra: false,
      });
    }
    if (!inModoMini) {
      for (const [nome, stato] of Object.entries(extras)) {
        modifiche.push({
          nome,
          stato,
          prezzo: costoDosaggio(stato, prezzoIngrediente(nome), true),
          isExtra: true,
        });
      }
    }
    const formatoVoce =
      !inModoMini && formatoScelto && formatoScelto.prezzo !== 0
        ? { nome: formatoScelto.nome, prezzo: formatoScelto.prezzo }
        : null;
    const impastoVoce =
      !inModoMini && impastoScelto && impastoScelto.prezzo !== 0
        ? { nome: impastoScelto.nome, prezzo: impastoScelto.prezzo }
        : null;
    const notaPulita = inModoMini ? "" : nota.trim();
    const personalizza: Personalizzazione | undefined =
      modifiche.length > 0 || formatoVoce || impastoVoce || notaPulita
        ? { formato: formatoVoce, impasto: impastoVoce, modifiche, nota: notaPulita }
        : undefined;
    const pizzaFinale: PizzaDaAggiungere =
      inModoMini && opzioneMini
        ? {
            ...pizza,
            nome: `Pizza Mini + Mini Bibita: ${opzioneMini.nome}`,
            ingredienti: opzioneMini.ingredienti,
            mini: opzioneMini.nome,
          }
        : pizza;
    onConferma(pizzaFinale, totale, personalizza);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onChiudi}
        aria-hidden="true"
      />
      <div
        ref={panello}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pizza-modal-titolo"
        tabIndex={-1}
        className="modal-in relative w-full sm:max-w-2xl max-h-[92dvh] flex flex-col overflow-hidden bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl focus:outline-none"
      >
        {/* Intestazione */}
        <header className="shrink-0 border-b border-surface-container px-4 sm:px-6 pt-4 sm:pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className="material-symbols-outlined text-primary text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                  Personalizza
                </span>
                {isNovita && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider">
                    Novità
                  </span>
                )}
              </div>
              <h2
                id="pizza-modal-titolo"
                className="font-title-lg text-title-lg font-bold text-primary leading-tight"
              >
                {inModoMini ? "Pizza Mini + Mini Bibita" : `Personalizza: ${pizza.nome}`}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1 capitalize leading-relaxed">
                {inModoMini
                  ? "Scegli una delle nostre mini e regola gli ingredienti."
                  : pizza.ingredienti}
              </p>
            </div>
            <button
              type="button"
              aria-label="Chiudi modale"
              onClick={onChiudi}
              className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between px-3.5 py-2 rounded-lg bg-surface-container">
            <span className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
              Base
            </span>
            <span className="font-title-lg text-title-lg font-bold text-secondary">
              € {formatPrice(pizza.prezzo)}
            </span>
          </div>
        </header>

        {/* Corpo scorrevole */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-5 space-y-7">
          {/* 1 — Scegli la mini (modalità Mini) oppure Formato & Dimensione */}
          {inModoMini ? (
            <section>
              <TestoSezione
                numero={1}
                titolo="Scegli la Pizza Mini"
                sottotitolo="Seleziona una delle mini disponibili"
                tag="Obbligatorio"
              />
              <div
                role="radiogroup"
                aria-label="Pizza Mini"
                className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              >
                {(modalitaMini?.opzioni ?? []).map((opzione) => {
                  const attivo = miniScelta === opzione.nome;
                  return (
                    <button
                      key={opzione.nome}
                      type="button"
                      role="radio"
                      aria-checked={attivo}
                      onClick={() => {
                        if (miniScelta === opzione.nome) return;
                        // Cambio di mini: i dosaggi non devono portarsi dietro
                        // le modifiche della precedente.
                        setMiniScelta(opzione.nome);
                        setDosaggi({});
                      }}
                      className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        attivo
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-surface-container hover:border-outline-variant hover:scale-[1.01]"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                          attivo ? "border-primary" : "border-outline-variant"
                        }`}
                      >
                        {attivo && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </span>
                      <span className="font-title-md text-title-md font-bold text-on-surface capitalize min-w-0">
                        {opzione.nome}
                      </span>
                    </button>
                  );
                })}
              </div>
              {!opzioneMini && (
                <p className="text-xs text-primary font-semibold mt-2">
                  Seleziona una pizza mini per continuare.
                </p>
              )}
            </section>
          ) : (
            <section>
              <TestoSezione
                numero={1}
                titolo="Formato & Dimensione"
                tag="Obbligatorio"
              />
              <div
                role="radiogroup"
                aria-label="Formato e dimensione"
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              >
                {opzioniFormato.map((opzione) => (
                  <OpzioneRadio
                    key={opzione.nome}
                    nome={opzione.nome}
                    nota={opzione.nota}
                    prezzo={opzione.prezzo}
                    attivo={formatoScelto?.nome === opzione.nome}
                    disabilitato={opzione.eBattuta && weekend}
                    onClick={() => setFormato(opzione.nome)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 2 — Impasto */}
          {!inModoMini && impasti.length > 0 && (
            <section>
              <TestoSezione
                numero={2}
                titolo="Impasto a Lunga Lievitazione"
                sottotitolo="Seleziona 1 impasto"
              />
              <div
                role="radiogroup"
                aria-label="Impasto"
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              >
                {impasti.map((voce) => (
                  <OpzioneRadio
                    key={voce.nome}
                    nome={voce.nome}
                    nota={null}
                    prezzo={voce.prezzo}
                    attivo={impastoScelto?.nome === voce.nome}
                    onClick={() => setImpasto(voce.nome)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 3 — Ingredienti di serie & dosaggio */}
          <section>
            <TestoSezione
              numero={inModoMini ? 2 : 3}
              titolo="Ingredienti di Serie & Dosaggio"
              sottotitolo="Modifica le quantità o rimuovi un ingrediente"
            />
            <div className="space-y-2.5">
              {ingredientiAttuali.map((nome) => {
                const stato = dosaggi[nome] ?? "normale";
                const rimosso = stato === "rimosso";
                return (
                  <div
                    key={nome}
                    className={`rounded-xl border p-3 transition-all ${
                      rimosso
                        ? "border-dashed border-surface-container bg-surface-container/60"
                        : "border-surface-container bg-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span
                        className={`font-title-md text-title-md font-bold text-on-surface capitalize min-w-0 truncate ${
                          rimosso ? "line-through opacity-60" : ""
                        }`}
                      >
                        {nome}
                      </span>
                      <button
                        type="button"
                        aria-label={
                          rimosso
                            ? `Ripristina ${nome}`
                            : `Rimuovi ${nome} dalla pizza`
                        }
                        onClick={() =>
                          setDosaggi((corrente) => ({
                            ...corrente,
                            [nome]: rimosso ? "normale" : "rimosso",
                          }))
                        }
                        className={`shrink-0 inline-flex items-center gap-1 px-2.5 h-7 rounded-full border text-[11px] font-bold transition-all cursor-pointer ${
                          rimosso
                            ? "border-secondary text-secondary hover:bg-secondary hover:text-on-secondary"
                            : "border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {rimosso ? "refresh" : "delete"}
                        </span>
                        {rimosso ? "Ripristina" : "Rimuovi"}
                      </button>
                    </div>
                    <div
                      className={
                        rimosso ? "pointer-events-none opacity-40" : undefined
                      }
                    >
                      <DosaggioControl
                        valore={stato}
                        costoAbbondante={prezzoIngrediente(nome)}
                        onChange={(nuovo) =>
                          setDosaggi((corrente) => ({ ...corrente, [nome]: nuovo }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4 — Aggiungi ingredienti extra */}
          {!inModoMini && (
          <section>
            <TestoSezione
              numero={4}
              titolo="Aggiungi Ingredienti Extra"
              sottotitolo="Supplementi a piacere"
            />
            {disponibili.length === 0 ? (
              <p className="text-sm text-on-surface-variant rounded-xl bg-surface-container px-4 py-3">
                Nessun ingrediente extra disponibile per questa pizza.
              </p>
            ) : (
              <>
                <div className="relative mb-3">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">
                    search
                  </span>
                  <Input
                    type="search"
                    value={ricerca}
                    onChange={(event) => setRicerca(event.target.value)}
                    placeholder="Cerca un ingrediente extra…"
                    aria-label="Cerca un ingrediente extra"
                    className="pl-9 pr-4 rounded-full bg-surface-container/70 border-transparent focus:border-primary focus:bg-surface placeholder:opacity-50"
                  />
                </div>
                {extraDaMostrare.length === 0 ? (
                  <p className="text-sm text-on-surface-variant rounded-xl bg-surface-container px-4 py-3">
                    Nessun ingrediente trovato per «{ricerca.trim()}».
                  </p>
                ) : (
                  <div className="max-h-72 overflow-y-auto overscroll-contain pr-1 space-y-2.5">
                    {extraDaMostrare.map((ingrediente) => {
                      const aggiunto =
                        extras[ingrediente.nome] !== undefined;
                      return (
                        <div
                          key={ingrediente.nome}
                          className="rounded-xl border border-surface-container bg-surface p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <span
                                className={`block text-sm font-semibold capitalize truncate ${
                                  aggiunto
                                    ? "text-secondary font-bold"
                                    : "text-on-surface"
                                }`}
                              >
                                {ingrediente.nome}
                              </span>
                              <span className="block text-xs font-bold text-secondary">
                                + € {formatPrice(ingrediente.prezzo)}
                              </span>
                            </div>
                            {aggiunto ? (
                              <button
                                type="button"
                                aria-label={`Rimuovi ${ingrediente.nome}`}
                                onClick={() =>
                                  setExtras((corrente) => {
                                    const nuovo = { ...corrente };
                                    delete nuovo[ingrediente.nome];
                                    return nuovo;
                                  })
                                }
                                className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  remove
                                </span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                aria-label={`Aggiungi ${ingrediente.nome}`}
                                onClick={() =>
                                  setExtras((corrente) => ({
                                    ...corrente,
                                    [ingrediente.nome]: "normale",
                                  }))
                                }
                                className="inline-flex items-center gap-1 px-3 h-9 shrink-0 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer text-xs font-bold"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  add
                                </span>
                                Aggiungi
                              </button>
                            )}
                          </div>
                          {aggiunto && (
                            <div className="mt-2.5">
                              <DosaggioControl
                                valore={extras[ingrediente.nome]}
                                costoAbbondante={ingrediente.prezzo}
                                onChange={(nuovo) =>
                                  setExtras((corrente) => ({
                                    ...corrente,
                                    [ingrediente.nome]: nuovo,
                                  }))
                                }
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
          )}

          {/* 5 — Note */}
          {!inModoMini && (
          <section>
            <TestoSezione
              numero={5}
              titolo="Note Speciali per il Fornaio"
              sottotitolo="Specifiche di cottura, intolleranze o indicazioni di taglio."
            />
            <Textarea
              value={nota}
              onChange={(event) => setNota(event.target.value.slice(0, 120))}
              maxLength={120}
              rows={3}
              placeholder="Es.: ben cotta, tagliate a metà, senza basilico…"
              className="min-h-20 text-sm resize-none placeholder:opacity-40"
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {noteStandard.map((notaStandard) => (
                <button
                  key={notaStandard}
                  type="button"
                  onClick={() => setNota((corrente) => appendiNota(corrente, notaStandard))}
                  title={`Aggiungi alle note: ${notaStandard}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-outline-variant bg-surface-container/50 text-on-surface-variant text-[11px] font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span className="material-symbols-outlined text-[14px]">message</span>
                  <span className="max-w-40 truncate">{notaStandard}</span>
                </button>
              ))}
            </div>
            <div className="text-right text-[11px] text-on-surface-variant mt-1">
              {nota.length}/120 car.
            </div>
          </section>
          )}
        </div>

        {/* Piè fisso: totale + azioni */}
        <footer className="shrink-0 border-t border-surface-container bg-surface px-4 sm:px-6 py-4">
          <div className="flex items-end justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
              Totale
            </span>
            <span className="font-display text-2xl font-extrabold text-secondary whitespace-nowrap">
              € {formatPrice(totale)}
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5 mb-3">
            {testoRiepilogo}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onChiudi}
              className="shrink-0 px-4 sm:px-5 py-3 rounded-full border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={conferma}
              disabled={inModoMini && !opzioneMini}
              className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-secondary text-on-secondary font-bold text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">
                {modo === "modifica" ? "check" : "shopping_bag"}
              </span>
              <span className="truncate">
                {inModoMini && !opzioneMini
                  ? "Scegli una pizza mini"
                  : `${modo === "modifica" ? "Conferma Modifiche" : "Aggiungi al Carrello"} (€ ${formatPrice(totale)})`}
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
