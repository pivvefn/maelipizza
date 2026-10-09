"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PizzaModal from "@/components/PizzaModal";
import {
  useCart,
  type CartItem,
  type DosaggioQuantita,
  type Personalizzazione,
  type PizzaDaAggiungere,
} from "@/lib/cart";
import ToastConferma, { useToastConferma } from "@/components/ToastConferma";
import { appendiNota } from "@/lib/cart";
import { costruisciOpzioniMini, formatPrice, type MenuData, type OpzioneMini, type Pizza } from "@/lib/menu";
import { useWhatsAppAttivo } from "@/lib/opening-hours";

const TELEFONO_DISPLAY = "+39 350 109 6092";
const TELEFONO_HREF = "tel:+393501096092";
const WHATSAPP_NUMERO = "393501096092";
const ORARIO_DEFAULT = "19:00";

const ETICHETTA_DOSAGGIO: Record<DosaggioQuantita, string> = {
  poco: "poco",
  normale: "normale",
  abbondante: "abbondante",
  rimosso: "rimosso",
};

/** Supplementi totali di una riga: formato + impasto + dosaggi/extra. */
function supplementiItem(item: CartItem): number {
  return (
    (item.personalizza?.formato?.prezzo ?? 0) +
    (item.personalizza?.impasto?.prezzo ?? 0) +
    (item.personalizza?.modifiche ?? []).reduce(
      (somma, m) => somma + m.prezzo,
      0,
    )
  );
}

const ORARI_RITIRO: string[] = (() => {
  const lista: string[] = [];
  for (let minuti = 18 * 60 + 30; minuti <= 21 * 60 + 30; minuti += 5) {
    const ore = String(Math.floor(minuti / 60)).padStart(2, "0");
    const minuto = String(minuti % 60).padStart(2, "0");
    lista.push(`${ore}:${minuto}`);
  }
  return lista;
})();

const INFO_RITIRO = [
  {
    icona: "storefront",
    sfondo: "bg-red-50",
    titolo: "Ritiro al Banco",
    testo: "Via del Molino, 6 — 31021 Campocroce di Mogliano V.to (TV). Comodo parcheggio fronte bottega per il carico pizze veloce.",
  },
  {
    icona: "inventory_2",
    sfondo: "bg-amber-50",
    titolo: "Scatole Termiche d'Asporto",
    testo: "Cartoni microondulati certificati per alimenti: preservano calore e fragranza croccante fino al tavolo di casa.",
  },
  {
    icona: "payments",
    sfondo: "bg-emerald-50",
    titolo: "Pagamento al Ritiro",
    testo: "Contanti, Bancomat, Carta o Satispay direttamente in bottega. Nessun anticipo richiesto online.",
  },
];

function SelettoreQuantita({ item }: { item: CartItem }) {
  const { impostaQuantita } = useCart();
  const [testo, setTesto] = useState(String(item.quantita));

  const applica = (valore: number) => {
    const limitato = Math.min(99, Math.max(1, valore));
    setTesto(String(limitato));
    impostaQuantita(item.id, limitato);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-1.5 py-1">
      <button
        type="button"
        aria-label={`Riduci quantità di ${item.nome}`}
        onClick={() => applica(item.quantita - 1)}
        className="w-7 h-7 inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-gray-100 hover:text-on-surface transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={`Quantità di ${item.nome}`}
        value={testo}
        onChange={(event) => {
          const pulito = event.target.value.replace(/[^0-9]/g, "").slice(0, 3);
          setTesto(pulito);
          const numero = parseInt(pulito, 10);
          if (numero >= 1) applica(numero);
        }}
        onBlur={() => {
          const numero = parseInt(testo, 10);
          if (numero >= 1) applica(numero);
          else setTesto(String(item.quantita));
        }}
        className="w-9 text-center text-sm font-bold text-on-surface bg-transparent border-0 p-0 focus:outline-none"
      />
      <button
        type="button"
        aria-label={`Aumenta quantità di ${item.nome}`}
        onClick={() => applica(item.quantita + 1)}
        className="w-7 h-7 inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-gray-100 hover:text-on-surface transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>
    </div>
  );
}

export default function CarrelloMain({ menu }: { menu: MenuData }) {
  const { items, nota, totalePezzi, rimuovi, pulisci, impostaNota, aggiornaPersonalizzazione } =
    useCart();
  const whatsappAttivo = useWhatsAppAttivo();
  const { toast, mostraToast, chiudiToast } = useToastConferma();

  const [nome, setNome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [orario, setOrario] = useState(ORARIO_DEFAULT);
  const [conferma, setConferma] = useState<
    { azione: "rimuovi"; id: string; nome: string } | { azione: "svuota" } | null
  >(null);

  // Modale di personalizzazione (bottone "Modifica" di ogni riga).
  const [modifica, setModifica] = useState<{
    id: string;
    pizza: Pizza;
    personalizza?: Personalizzazione;
    /** Se presente, la modale apre in modalità Mini con queste opzioni. */
    mini?: { opzioni: OpzioneMini[]; scelta: string };
  } | null>(null);
  const chiudiModale = useCallback(() => setModifica(null), []);

  const apriModaleModifica = (item: CartItem) => {
    // Il prezzo salvato è il totale personalizzato: per aprire la modale con
    // il prezzo BASE serve sottrarre i supplementi già applicati.
    const supplementi = supplementiItem(item);
    const prezzoBase = Math.round((item.prezzo - supplementi) * 100) / 100;
    setModifica({
      id: item.id,
      pizza: {
        nome: item.nome,
        prezzo: prezzoBase,
        ingredienti: item.ingredienti,
        // lowercase: stessa forma dei nomi del listino, così le chiavi dei
        // dosaggi coincidono tra apertura da listino e da carrello.
        ingredientiNomi: item.ingredienti
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
        isFeatured: false,
        nota: null,
        allergeni: [],
      },
      ...(item.personalizza ? { personalizza: item.personalizza } : {}),
      ...(item.mini
        ? {
            mini: {
              opzioni: costruisciOpzioniMini(menu),
              scelta: item.mini,
            },
          }
        : {}),
    });
  };

  const confermaModifiche = (
    pizza: PizzaDaAggiungere,
    prezzo: number,
    personalizza: Personalizzazione | undefined,
  ) => {
    if (!modifica) return;
    aggiornaPersonalizzazione(modifica.id, prezzo, personalizza);
    setModifica(null);
    mostraToast("Modifiche aggiornate", "verde");
  };

  // Totale pizze = prezzi BASE del listino; Supplementi speciali = costo di
  // tutte le modifiche (possono anche essere sconti, quindi negativi).
  const { prezzoPizze, supplementi } = useMemo(() => {
    const arrotonda = (n: number) => Math.round(n * 100) / 100;
    let basi = 0;
    let extra = 0;
    for (const item of items) {
      const s = supplementiItem(item);
      basi += (item.prezzo - s) * item.quantita;
      extra += s * item.quantita;
    }
    return { prezzoPizze: arrotonda(basi), supplementi: arrotonda(extra) };
  }, [items]);
  const totale = Math.round((prezzoPizze + supplementi) * 100) / 100;

  const messaggio = useMemo(() => {
    const righePizze = items.map((item) => {
      // Mini: "Pizza Mini + Mini Bibita: Margherita" → "2x Margherita mini".
      const riga = item.mini
        ? `  • ${item.quantita}x ${item.mini} mini`
        : `  • ${item.quantita}x ${item.nome}`;
      const p = item.personalizza;
      if (!p) return riga;
      const dettagli: string[] = [];
      if (p.formato && p.formato.prezzo !== 0) {
        dettagli.push(
          `      - Formato: ${p.formato.nome} (${p.formato.prezzo < 0 ? "−" : "+"}€ ${formatPrice(Math.abs(p.formato.prezzo))})`,
        );
      }
      if (p.impasto && p.impasto.prezzo !== 0) {
        dettagli.push(
          `      - Impasto: ${p.impasto.nome} (+€ ${formatPrice(p.impasto.prezzo)})`,
        );
      }
      for (const m of p.modifiche) {
        const etichetta = m.isExtra ? `${m.nome} (extra)` : m.nome;
        const prezzo =
          m.prezzo === 0
            ? ""
            : m.prezzo > 0
              ? ` (+€ ${formatPrice(m.prezzo)})`
              : ` (−€ ${formatPrice(Math.abs(m.prezzo))})`;
        dettagli.push(
          `      - ${etichetta}: ${ETICHETTA_DOSAGGIO[m.stato]}${prezzo}`,
        );
      }
      if (p.nota.trim()) {
        dettagli.push(`      - Note: ${p.nota.trim()}`);
      }
      return [riga, ...dettagli].join("\n");
    });
    return [
      `Nome: ${nome || "-"}`,
      `Tel: ${telefono || "-"}`,
      `Orario richiesto: ${orario || "-"}`,
      `Pizze (${totalePezzi}): `,
      ...(righePizze.length > 0 ? righePizze : ["  • (nessuna pizza selezionata)"]),
      ...(nota.trim()
        ? [`Note per il fornaio: ${nota.trim()}`]
        : []),
      `Totale stimato: € ${formatPrice(totale)}.`,
    ].join("\n");
  }, [items, nome, telefono, orario, nota, totale, totalePezzi]);

  const inviaDisponibile = whatsappAttivo && items.length > 0;

  // I link al listino portano alla prima categoria disponibile (la prima
  // sezione con almeno una pizza, novità incluse: è la prima renderizzata).
  const primaCategoria = menu.sections.find((s) => s.pizzas.length > 0)?.slug;
  const hrefListino = primaCategoria
    ? `/listino#cat-${primaCategoria}`
    : "/listino";

  function inviaWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inviaDisponibile) return;
    window.open(
      `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(messaggio)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function eseguiConferma() {
    if (!conferma) return;
    if (conferma.azione === "svuota") {
      pulisci();
      mostraToast("Carrello svuotato", "rosso");
    } else {
      rimuovi(conferma.id);
      mostraToast("Pizza rimossa", "rosso");
    }
  }

  return (
    <main className="w-full pt-36 pb-8 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-10">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:content-[''] after:bg-current after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
                >
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:content-[''] after:bg-current after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100"
                >
                  <Link href="/listino">Menu &amp; Listino</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Il Tuo Carrello</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-on-surface">
                Il Tuo Ordine da Asporto
              </h1>
              <p className="text-on-surface-variant text-sm sm:text-base mt-2">
                Controlla le tue pizze, le personalizzazioni e scegli come
                ordinare per stasera.
              </p>
            </div>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-xs self-start md:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="material-symbols-outlined text-[18px] text-neutral-500">
                schedule
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                Orari di sfornatura:{" "}
                <strong className="text-neutral-900">~ 5 min</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col items-start gap-3 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="material-symbols-outlined text-[22px] text-secondary">
                    shopping_bag
                  </span>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-on-surface truncate">
                    Pizze nel Carrello ({totalePezzi})
                  </h2>
                </div>
                <Link
                  href={hrefListino}
                  className="-ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary hover:text-secondary hover:bg-neutral-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add_circle
                  </span>
                  Aggiungi altre pizze
                </Link>
              </div>

              {items.length === 0 ? (
                <div className="py-12 flex flex-col items-center text-center gap-3">
                  <span className="material-symbols-outlined text-[40px] text-neutral-300">
                    shopping_cart
                  </span>
                  <p className="font-semibold text-on-surface">
                    Il carrello è vuoto
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Sfoglia il listino e aggiungi le tue pizze preferite.
                  </p>
                  <Link
                    href={hrefListino}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-on-secondary text-sm font-semibold hover:scale-105 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      local_pizza
                    </span>
                    Vai al Listino
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-6 flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-title-lg text-title-lg font-bold text-primary">
                              {item.nome}
                            </span>
                          </div>
                          {item.ingredienti.trim() !== "" && (
                            <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                              {item.ingredienti}
                            </p>
                          )}
                          {item.personalizza && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.personalizza.formato &&
                                item.personalizza.formato.prezzo !== 0 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                                    Formato: {item.personalizza.formato.nome}
                                  </span>
                                )}
                              {item.personalizza.impasto &&
                                item.personalizza.impasto.prezzo !== 0 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                                    Impasto: {item.personalizza.impasto.nome}
                                  </span>
                                )}
                              {item.personalizza.modifiche.map((m) => (
                                <span
                                  key={`${m.isExtra ? "e" : "s"}-${m.nome}`}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant"
                                >
                                  {m.isExtra ? `+ ${m.nome}` : m.nome}:{" "}
                                  {ETICHETTA_DOSAGGIO[m.stato]}
                                  {m.prezzo === 0
                                    ? ""
                                    : m.prezzo > 0
                                      ? ` (+€ ${formatPrice(m.prezzo)})`
                                      : ` (−€ ${formatPrice(Math.abs(m.prezzo))})`}
                                </span>
                              ))}
                              {item.personalizza.nota.trim() && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-[11px] italic text-on-surface">
                                  {item.personalizza.nota.trim()}
                                </span>
                              )}
                            </div>
                          )}
                          {item.quantita > 1 && (
                            <p className="text-xs text-neutral-500 mt-1">
                              (€ {formatPrice(item.prezzo)} cad.)
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-title-lg text-title-lg font-bold text-secondary whitespace-nowrap">
                            € {formatPrice(item.prezzo * item.quantita)}
                          </div>
                          {item.quantita > 1 && (
                            <div className="text-xs text-neutral-500 mt-0.5">
                              per {item.quantita} pizze
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <SelettoreQuantita item={item} />

                        <div className="flex items-center gap-2">
                          {/* Voci extra (es. porzione di patate fritte): senza
                              ingredienti non c'è nulla da personalizzare. */}
                          {item.ingredienti.trim() !== "" && (
                            <button
                              type="button"
                              title="Modifica"
                              aria-label={`Modifica ${item.nome}`}
                              onClick={() => apriModaleModifica(item)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 wide:px-3 rounded-full border border-outline-variant text-on-surface-variant hover:bg-outline hover:text-white hover:border-outline hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-out font-label-sm text-label-sm font-semibold shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                edit
                              </span>
                              <span className="hidden wide:inline">Modifica</span>
                            </button>
                          )}
                          <button
                            type="button"
                            aria-label={`Rimuovi ${item.nome}`}
                            onClick={() =>
                              setConferma({
                                azione: "rimuovi",
                                id: item.id,
                                nome: item.nome,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 wide:px-3 rounded-full border border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-out font-label-sm text-label-sm font-semibold shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              delete
                            </span>
                            <span className="hidden wide:inline">Rimuovi</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Label
                  htmlFor="note-fornaio"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit_note
                  </span>
                  Note per il fornaio
                </Label>
                <Textarea
                  id="note-fornaio"
                  value={nota}
                  onChange={(event) => impostaNota(event.target.value)}
                  placeholder="Es.: ben cucinate, tagliate a metà, senza basilico…"
                  className="min-h-20 text-xs sm:text-sm placeholder:opacity-40"
                />
                {menu.noteStandard.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {menu.noteStandard.map((notaStandard) => (
                      <button
                        key={notaStandard}
                        type="button"
                        onClick={() => impostaNota(appendiNota(nota, notaStandard))}
                        title={`Aggiungi alle note: ${notaStandard}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-outline-variant bg-surface-container/50 text-on-surface-variant text-[11px] font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        <span className="material-symbols-outlined text-[14px]">message</span>
                        <span className="max-w-40 truncate">{notaStandard}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 p-5 rounded-xl bg-surface-container-low">
                <div className="space-y-1 text-xs text-on-surface-variant font-medium">
                  <div className="flex items-center justify-between gap-4">
                    <span>Totale pizze:</span>
                    <span className="font-semibold text-on-surface">
                      € {formatPrice(prezzoPizze)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Supplementi speciali:</span>
                    <span className="font-semibold text-on-surface">
                      {supplementi < 0 ? "−€ " : "€ "}
                      {formatPrice(Math.abs(supplementi))}
                    </span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-2 mt-3 pt-3 border-t border-gray-200/70">
                  <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                    Totale complessivo
                  </span>
                  <span className="font-display text-2xl font-extrabold text-secondary whitespace-nowrap">
                    € {formatPrice(totale)}
                  </span>
                </div>
              </div>

              {items.length > 0 && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setConferma({ azione: "svuota" })}
                    className="text-sm font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Svuota carrello
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display font-bold text-xl text-on-surface">
                Come vuoi ordinare stasera?
              </h2>
              <span className="text-xs font-medium text-neutral-500 shrink-0">
                2 opzioni disponibili
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-neutral-800 truncate">
                    Opzione 1: Chiamata rapida
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700 uppercase shrink-0"
                >
                  Consigliata
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                Tieni a portata di mano questa lista e chiamaci al banco. Ti
                confermeremo all&apos;istante l&apos;orario esatto di sfornata.
              </p>
              <a
                href={TELEFONO_HREF}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-secondary text-on-secondary text-sm font-bold hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md transition-all duration-200 ease-out"
              >
                <span className="material-symbols-outlined text-[20px]">
                  call
                </span>
                Chiama la Pizzeria ({TELEFONO_DISPLAY})
              </a>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-neutral-500">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>
                <span>
                  Linee attive per l&apos;asporto:{" "}
                  <strong className="text-neutral-800">18:30 - 21:30</strong>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-neutral-800 truncate">
                    Opzione 2: Prenota via WhatsApp
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-neutral-500 shrink-0">
                  Pre-ordine
                </span>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    warning
                  </span>
                  IMPORTANTE: Richiesta di Prenotazione
                </div>
                <p className="text-[11px] text-amber-900/90 mb-1.5">
                  Questo invio è solo una RICHIESTA DI PRENOTAZIONE.
                </p>
                <div className="text-[11px] leading-relaxed space-y-1.5">
                  <p>
                    L&apos;ordine sarà valido esclusivamente previa nostra
                    conferma scritta con orario di sfornata.
                  </p>
                  <p>
                    Servizio attivo solo nei giorni di apertura fino alle ore
                    17:30.
                  </p>
                </div>
              </div>

              <form onSubmit={inviaWhatsApp} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="ritiro-nome"
                    className="text-xs font-semibold text-neutral-700"
                  >
                    Nome e Cognome per il ritiro *
                  </Label>
                  <Input
                    id="ritiro-nome"
                    required
                    autoComplete="name"
                    placeholder="Es. Marco Rossi"
                    className="placeholder:opacity-40"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="ritiro-orario"
                      className="text-xs font-semibold text-neutral-700"
                    >
                      Orario desiderato *
                    </Label>
                    <Select
                      value={orario}
                      onValueChange={setOrario}
                    >
                      <SelectTrigger id="ritiro-orario" className="w-full">
                        <SelectValue placeholder="Scegli l'orario" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORARI_RITIRO.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="ritiro-cellulare"
                      className="text-xs font-semibold text-neutral-700"
                    >
                      Numero di cellulare *
                    </Label>
                    <Input
                      id="ritiro-cellulare"
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Es. 340 123 4567"
                      className="placeholder:opacity-40"
                      value={telefono}
                      onChange={(event) => setTelefono(event.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-neutral-500 mb-2">
                      <span className="material-symbols-outlined text-[15px]">
                        preview
                      </span>
                      Anteprima messaggio
                    </div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-[11px] sm:text-xs leading-relaxed text-neutral-700">
                      {messaggio}
                    </pre>
                  </div>
                </div>

                {!whatsappAttivo && (
                  <p className="flex items-start gap-1.5 text-[11px] font-medium text-amber-700 leading-relaxed">
                    <span className="material-symbols-outlined text-[15px] shrink-0 mt-px">
                      schedule
                    </span>
                    Il servizio WhatsApp è attivo nei giorni di apertura fino
                    alle ore 17:30.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!inviaDisponibile}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#25d366] text-white text-sm font-bold shadow-sm hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 ease-out"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    chat
                  </span>
                  Invia Richiesta su WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>

        <section className="mt-14 pt-10 border-t border-gray-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INFO_RITIRO.map((info) => (
              <div
                key={info.titolo}
                className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-xs"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${info.sfondo} flex items-center justify-center mb-3`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {info.icona}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm sm:text-base text-on-surface mb-1.5">
                  {info.titolo}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {info.testo}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ToastConferma toast={toast} onChiudi={chiudiToast} />

      {modifica && (
        <PizzaModal
          key={modifica.id}
          pizza={modifica.pizza}
          isNovita={false}
          modo="modifica"
          personalizzaIniziale={modifica.personalizza}
          modalitaMini={modifica.mini}
          dimensioni={menu.dimensioni}
          impasti={menu.impastiCompleti}
          ingredientiExtra={menu.ingredientiExtra}
          extraGenerali={menu.extra}
          noteStandard={menu.noteStandard}
          onChiudi={chiudiModale}
          onConferma={confermaModifiche}
        />
      )}

      <AlertDialog
        open={conferma !== null}
        onOpenChange={(aperto) => {
          if (!aperto) setConferma(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {conferma?.azione === "svuota"
                ? "Svuotare il carrello?"
                : "Rimuovere la pizza?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {conferma?.azione === "svuota"
                ? "Verranno rimossi tutti gli articoli dal carrello. Questa azione non può essere annullata."
                : `Stai per rimuovere «${conferma?.nome ?? ""}» dal carrello. Vuoi procedere?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={eseguiConferma}>
              {conferma?.azione === "svuota" ? "Svuota" : "Rimuovi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
