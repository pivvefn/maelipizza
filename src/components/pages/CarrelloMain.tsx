"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
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
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { useWhatsAppAttivo } from "@/lib/opening-hours";

const TELEFONO_DISPLAY = "+39 350 109 6092";
const TELEFONO_HREF = "tel:+393501096092";
const WHATSAPP_NUMERO = "393501096092";
const ORARIO_DEFAULT = "19:00";

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

export default function CarrelloMain() {
  const { items, nota, totalePezzi, rimuovi, impostaQuantita, impostaNota } =
    useCart();
  const whatsappAttivo = useWhatsAppAttivo();

  const [nome, setNome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [orario, setOrario] = useState(ORARIO_DEFAULT);

  const subtotale = useMemo(
    () => items.reduce((somma, item) => somma + item.prezzo * item.quantita, 0),
    [items],
  );
  const supplementi = 0;
  const totale = subtotale + supplementi;

  const messaggio = useMemo(() => {
    const righePizze = items.map(
      (item) => `  • ${item.quantita}x ${item.nome}`,
    );
    return [
      "Ciao Maeli Pizza! Vorrei richiedere una prenotazione asporto per stasera:",
      `- Nome: ${nome || "-"} (Tel: ${telefono || "-"})`,
      `- Orario richiesto: ${orario || "-"}`,
      "- Pizze:",
      ...(righePizze.length > 0 ? righePizze : ["  • (nessuna pizza selezionata)"]),
      `- Totale stimato: € ${formatPrice(totale)}.`,
      "Attendo vostra conferma con orario preciso di sfornata, grazie!",
    ].join("\n");
  }, [items, nome, telefono, orario, totale]);

  const inviaDisponibile = whatsappAttivo && items.length > 0;

  function inviaWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inviaDisponibile) return;
    window.open(
      `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(messaggio)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main className="w-full pt-28 pb-8 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-10">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
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
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="material-symbols-outlined text-[22px] text-secondary">
                    shopping_bag
                  </span>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-on-surface truncate">
                    Pizze nel Carrello ({totalePezzi})
                  </h2>
                </div>
                <Link
                  href="/listino"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary transition-colors shrink-0"
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
                    href="/listino"
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
                      key={item.nome}
                      className="py-6 flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-title-lg text-title-lg font-bold text-primary">
                              {item.nome}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                            {item.ingredienti}
                          </p>
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
                        <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-1.5 py-1">
                          <button
                            type="button"
                            aria-label={`Riduci quantità di ${item.nome}`}
                            onClick={() =>
                              impostaQuantita(item.nome, item.quantita - 1)
                            }
                            className="w-7 h-7 inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-gray-100 hover:text-on-surface transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              remove
                            </span>
                          </button>
                          <span className="min-w-6 text-center text-sm font-bold text-on-surface">
                            {item.quantita}
                          </span>
                          <button
                            type="button"
                            aria-label={`Aumenta quantità di ${item.nome}`}
                            onClick={() =>
                              impostaQuantita(item.nome, item.quantita + 1)
                            }
                            className="w-7 h-7 inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-gray-100 hover:text-on-surface transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              add
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title="Modifica"
                            aria-label={`Modifica ${item.nome}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface hover:border-outline hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-out font-label-sm text-label-sm font-semibold shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              edit
                            </span>
                            Modifica
                          </button>
                          <button
                            type="button"
                            aria-label={`Rimuovi ${item.nome}`}
                            onClick={() => rimuovi(item.nome)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-out font-label-sm text-label-sm font-semibold shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              delete
                            </span>
                            Rimuovi
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
                  className="min-h-20 text-xs sm:text-sm"
                />
              </div>

              <div className="mt-6 p-5 rounded-xl bg-surface-container-low">
                <div className="space-y-1 text-xs text-on-surface-variant font-medium">
                  <div className="flex items-center justify-between gap-4">
                    <span>Subtotale pizze:</span>
                    <span className="font-semibold text-on-surface">
                      € {formatPrice(subtotale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Supplementi speciali:</span>
                    <span className="font-semibold text-on-surface">
                      € {formatPrice(supplementi)}
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
    </main>
  );
}
