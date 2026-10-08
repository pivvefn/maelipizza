"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AllergenIcon, AllergeniPizza } from "@/components/AllergenIcon";
import { images } from "@/lib/images";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  formatPrice,
  type Impasto,
  type MenuData,
  type MenuSection,
  type Pizza,
} from "@/lib/menu";

const ACTIVE_CLASSES =
  "bg-on-surface text-surface font-semibold shadow-md cursor-pointer hover:bg-on-surface/90 hover:scale-105 active:scale-95";
const INACTIVE_CLASSES =
  "bg-surface-container text-on-surface-variant font-medium cursor-pointer hover:text-on-surface hover:bg-surface-container-highest hover:shadow-sm hover:scale-105 active:scale-95";

const HEADER_OFFSET = 112;

const NAV_BOTTOM = HEADER_OFFSET + 56;

const NOTE_LISTINO = ["* Prodotto congelato", "° Radicchio di Treviso solo in stagione"];

const ALLERGENI = [
  "In tutte le nostre pizze sono presenti glutine, lupini, latticini e derivati degli arachidi.",
  "In alcune pizze possono essere presenti anche crostacei, uova e frutta a guscio.",
  "Per informazioni chiedere ai titolari o al personale.",
];

const SECTION_SUBTITLE: Record<string, string> = {
  gustose: "Ispirate alle ricette storiche di Martino",
  bianche: "Esaltazione degli impasti e latticini freschi",
  calzoni: "Chiusi a mezzaluna e dorati al forno",
  classiche: "I capisaldi della tradizione italiana",
};

function PizzaRow({ pizza, isLastRow }: { pizza: Pizza; isLastRow: boolean }) {
  return (
    <div
      className={`flex items-start justify-between py-2 ${
        isLastRow ? "" : "border-b border-surface-container"
      }`}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-title-lg text-title-lg font-bold text-primary">
            {pizza.nome}
          </span>

          <AllergeniPizza ids={pizza.allergeni} />

        </div>
        <p className="font-body-sm text-body-sm text-on-surface mt-1.5">
          {pizza.ingredienti}
        </p>
        {pizza.nota && (
          <p className="font-label-sm text-label-sm text-tertiary">{pizza.nota}</p>
        )}
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="font-title-lg text-title-lg font-bold text-secondary whitespace-nowrap">
          € {formatPrice(pizza.prezzo)}
        </span>

        <div className="flex items-center gap-1 mt-1.5">
          <button
            type="button"
            title="Aggiungi"
            aria-label={`Aggiungi ${pizza.nome}`}
            className="inline-flex items-center gap-1 px-2 py-1 wide:px-2.5 rounded-full border border-primary/40 text-primary hover:bg-secondary hover:text-on-secondary hover:border-secondary hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-out font-label-sm text-label-sm font-semibold shadow-xs hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[13px]! wide:text-[15px]!">add</span>
            <span className="hidden wide:inline">Aggiungi</span>
          </button>
          <button
            type="button"
            title="Modifica"
            aria-label={`Modifica ${pizza.nome}`}
            className="inline-flex items-center gap-1 px-2 py-1 wide:px-2.5 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface hover:border-outline hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-out font-label-sm text-label-sm font-semibold shadow-xs hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-[13px]! wide:text-[15px]!">edit</span>
            <span className="hidden wide:inline">Modifica</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sezione categoria (titolo + tabellone denso, uguale per tutte le categorie)
// ---------------------------------------------------------------------------

function SectionBlock({
  section,
  capitolo,
}: {
  section: MenuSection;
  /** Numero del "Capitolo NN": le sezioni novità non lo hanno (usano NOVITÀ). */
  capitolo?: number;
}) {
  const subtitle = SECTION_SUBTITLE[section.slug];
  const isNovita = section.isNovita;

  return (
    <section
      className={`menu-section space-y-space-md ${

        isNovita ? "p-space-md md:p-space-xl rounded-xl bg-surface-container-low" : ""
      }`}
      id={`cat-${section.slug}`}
    >
      <div className="flex items-baseline justify-between reveal reveal-slow reveal-fade">
        <div>
          <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-widest">
            {isNovita
              ? "Novità"
              : `Capitolo ${String(capitolo ?? 1).padStart(2, "0")}`}
          </span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            {section.nome}
          </h2>
        </div>
        {subtitle && !isNovita && (
          <span className="font-body-md text-body-md text-on-surface-variant hidden sm:inline">
            {subtitle}
          </span>
        )}
      </div>

      {isNovita && section.descrizione && (
        <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl reveal reveal-slow reveal-fade delay-150">
          {section.descrizione}
        </p>
      )}
      <div
        className={`bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md md:p-space-xl reveal reveal-slow reveal-fade ${
          isNovita ? "delay-300" : "delay-150"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-space-xl gap-y-space-md">
          {section.pizzas.map((pizza, index) => (
            <PizzaRow
              key={pizza.nome}
              pizza={pizza}
              isLastRow={index >= section.pizzas.length - 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Bento divider: impasti speciali (dal DB: dough_types)
// ---------------------------------------------------------------------------

function ImpastiDivider({ impasti }: { impasti: Impasto[] }) {
  if (impasti.length === 0) return null;

  const nomi = impasti.map((i) => i.nome.toLowerCase()).join(" e ");
  const prezzi = impasti.map((i) => i.prezzo);
  const stesso = prezzi.every((p) => p === prezzi[0]);
  const prezzo = stesso
    ? formatPrice(prezzi[0])
    : `${formatPrice(Math.min(...prezzi))} – ${formatPrice(Math.max(...prezzi))}`;

  return (
    <div className="p-space-lg rounded-xl bg-gradient-to-r from-primary-container/10 via-surface-container to-secondary-container/15 flex flex-col md:flex-row items-center justify-between gap-space-md reveal reveal-slow reveal-fade delay-150">
      <div className="flex items-center gap-space-md">
        <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">psychiatry</span>
        </div>
        <div>
          <h4 className="font-title-lg text-title-lg font-bold text-on-surface">
            Impasti Speciali
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Tutte le pizze anche con pasta {nomi} (+€ {prezzo}).
          </p>
        </div>
      </div>
      <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary px-3 py-1 bg-surface-container-lowest rounded-full shadow-sm">
        48h Maturazione Naturale
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pill di filtro categoria.
// Le NOVITÀ hanno una cornice rossa (border-2 primary) con la targhetta
// "NOVITÀ" a centro esattamente sul bordo superiore; le altre restano
// come prima. Altezza totale uguale a quelle ordinarie (32px), così la
// nav sticky non cambia misura.
// ---------------------------------------------------------------------------

function CategoryPill({
  section,
  isActive,
  onSelect,
}: {
  section: MenuSection;
  isActive: boolean;
  onSelect: (slug: string) => void;
}) {
  const classi = `menu-filter-btn px-4 rounded-full font-label-md text-label-md cursor-pointer transition-all duration-200 ease-out transform ${
    isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
  } ${section.isNovita ? "relative pt-2 pb-1 border-2 border-primary" : "py-2"}`;

  return (
    <button
      className={classi}
      data-categoria={section.slug}
      onClick={() => onSelect(section.slug)}
      type="button"
    >
      {section.isNovita && (
        // Targhetta a centro del bordo rosso superiore: esce di 4px dal
        // bottone e rientra per 6px — il contenitore dei filtri ha 4px di
        // padding in alto, quindi non viene mai ritagliata.
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 px-1 leading-none rounded-full bg-primary text-on-primary font-bold text-[10px] uppercase tracking-wider pointer-events-none">
          Novità
        </span>
      )}
      {section.nome}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Pagina
// ---------------------------------------------------------------------------

export default function ListinoMain({ menu }: { menu: MenuData }) {
  const [active, setActive] = useState("all");
  // Legenda allergeni: collassabile solo su mobile (chiusa di default
  // per risparmiare spazio); da md in su è sempre visibile.
  const [legendaAperta, setLegendaAperta] = useState(false);

  // Pausa dello scroll-spike mentre gira lo scroll programmatico di
  // handleFilter: la pill cliccata resta attiva senza "lampeggiare"
  // attraverso le sezioni intermedie durante lo scorrimento.
  const scrollProgrammatico = useRef(false);
  const timerScroll = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll-spike: evidenzia in automatico la pill della sezione in vista.
  // Linea di riferimento: 16px sotto il bordo della nav sticky (la nav finisce
  // a 168px, handleFilter aggancia le sezioni con top a 180px del viewport).
  // Sopra la prima sezione resta "Tutte le Categorie"; sotto l'ultima sezione
  // resta l'ultima pill raggiunta.
  useEffect(() => {
    const ids = [
      ...menu.sections.map((s) => `cat-${s.slug}`),
      ...(menu.formati.length > 0 ? ["cat-baby"] : []),
      ...(menu.teglie.length > 0 ? ["cat-teglie"] : []),
    ];
    const aggiornaAttiva = () => {
      if (scrollProgrammatico.current) return;
      const linea = NAV_BOTTOM + 16;
      let nuova = "all";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linea) {
          nuova = id.slice(4);
        }
      }
      setActive((corrente) => (corrente === nuova ? corrente : nuova));
    };
    aggiornaAttiva();
    window.addEventListener("scroll", aggiornaAttiva, { passive: true });
    window.addEventListener("resize", aggiornaAttiva);
    return () => {
      window.removeEventListener("scroll", aggiornaAttiva);
      window.removeEventListener("resize", aggiornaAttiva);
      if (timerScroll.current) clearTimeout(timerScroll.current);
    };
  }, [menu]);

  // La barra delle pill scorre in orizzontale (specialmente da mobile):
  // quando la pill attiva cambia per scroll-spike, portala in vista così
  // la selezione automatica resta visibile.
  useEffect(() => {
    const nav = document.getElementById("categoryNav");
    const btn = nav?.querySelector<HTMLElement>(
      `[data-categoria="${active}"]`,
    );
    if (!nav || !btn) return;
    const inVista =
      btn.offsetLeft >= nav.scrollLeft &&
      btn.offsetLeft + btn.offsetWidth <= nav.scrollLeft + nav.clientWidth;
    if (!inVista) {
      nav.scrollTo({
        left: Math.max(0, btn.offsetLeft - 16),
        behavior: "smooth",
      });
    }
  }, [active]);

  // Aggiorna lo stato del filtro e scorre in modo morbido alla sezione
  // della categoria con l'offset di -140px (sotto header e nav sticky).
  const handleFilter = (category: string) => {
    setActive(category);

    // Blocca lo scroll-spike per tutta la durata dello scroll morbido:
    // al termine resta attiva la pill cliccata, che coincide con la
    // sezione su cui lo scroll si ferma.
    scrollProgrammatico.current = true;
    if (timerScroll.current) clearTimeout(timerScroll.current);
    timerScroll.current = setTimeout(() => {
      scrollProgrammatico.current = false;
    }, 800);

    if (category === "all") {
      // Torna all'inizio dell'elenco: la nav resta agganciata appena
      // sotto l'header e il tendone compare tutto intero sotto di essa
      const curtain = document.getElementById("menu-curtain");
      if (curtain) {
        const y =
          curtain.getBoundingClientRect().top +
          window.scrollY -
          NAV_BOTTOM;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      return;
    }

    const targetSection = document.getElementById("cat-" + category);
    if (targetSection) {
      // -180: sotto header + nav sticky (168px), così l'occhiello
      // "Capitolo NN" resta visibile e non finisce dietro la nav
      const y =
        targetSection.getBoundingClientRect().top +
        window.pageYOffset -
        180;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Solo categorie con almeno una pizza. L'ordine arriva già dal DB con
  // le novità (is_new) in testa: le pill e le sezioni seguono quell'ordine.
  const sections = menu.sections.filter((s) => s.pizzas.length > 0);
  const sezioniNovita = sections.filter((s) => s.isNovita);
  const sezioniOrdinarie = sections.filter((s) => !s.isNovita);

  // Legenda degli allergeni presenti negli ingredienti: nome + descrizione
  // dalla tabella `allergeni`, divisa in due colonne (meta = ceil(n/2),
  // ordine per id invariato).
  const legenda = menu.legendaAllergeni;
  const meta = Math.ceil(legenda.length / 2);
  const colonneLegenda = [legenda.slice(0, meta), legenda.slice(meta)];
  const legendaHtml = (
    <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {colonneLegenda.map((colonna, i) => (
        <ul key={i} className="space-y-3">
          {colonna.map((a) => (
            <li key={a.id} className="flex items-start gap-2.5">
              <AllergenIcon id={a.id} className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <span className="font-semibold text-on-surface">{a.nome}</span>
                {a.descrizione ? `: ${a.descrizione}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );

  // CTA hero (solo desktop): scorre alla prima sezione con le pizze,
  // riutilizzando la stessa logica del filtro (nav pill compresa).
  const scrollToPrimaSezione = () => {
    if (sections.length > 0) {
      handleFilter(sections[0].slug);
      return;
    }
    const curtain = document.getElementById("menu-curtain");
    if (curtain) {
      const y =
        curtain.getBoundingClientRect().top + window.scrollY - NAV_BOTTOM;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Scostamento formato Baby dal DB (es. -1); fallback dal listino: 1,00
  const babyOff = menu.formatoBaby != null ? Math.abs(menu.formatoBaby) : 1;

  return (
    <main className="w-full bg-surface min-h-screen relative">

      <section className="sticky top-0 z-0 h-screen w-full overflow-hidden flex items-center justify-center bg-surface">

        <div className="absolute inset-0 z-0 bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Pizze sfornate sul bancone della pizzeria Maeli a Campocroce"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
            src={images.listinoHero}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-margin md:px-margin-desktop w-full flex flex-col justify-center">
          <div className="max-w-3xl flex flex-col items-start gap-4 sm:gap-6">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md max-w-full reveal reveal-slow reveal-fade delay-100">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-label-sm text-xs sm:text-label-sm uppercase tracking-wider text-on-surface font-bold flex items-center gap-1.5 shrink-0">
                <span
                  className="material-symbols-outlined text-[14px] sm:text-[15px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>

                <span>LISTINO UFFICIALE</span>
              </span>
              <span className="text-surface-variant font-bold hidden sm:inline">•</span>
              <span className="font-label-sm text-label-sm text-secondary font-bold hidden sm:inline truncate">
                CAMPOCROCE di M.V.TO (TV)
              </span>
            </div>

            <h1 className="font-display text-display-mobile md:text-display text-surface-container-lowest font-bold leading-tight tracking-tight reveal reveal-slow reveal-fade delay-200">
              Il Nostro Listino Prezzi
            </h1>
          </div>

          <div className="flex flex-col items-start gap-4 sm:gap-6 mt-4 sm:mt-6 md:flex-row md:items-center md:justify-between md:gap-space-xl reveal reveal-slow reveal-fade delay-300">

            <p className="font-body-md md:font-body-lg text-body-md md:text-[18px] md:leading-relaxed text-surface-container-high max-w-2xl font-normal leading-relaxed">
              Tutte le nostre pizze sono rigorosamente cotte nel tradizionale
              forno a legna, con farina di grani italiani selezionati e
              lievitazione lenta di 48 ore.
            </p>

            <div className="inline-flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-lowest/15 backdrop-blur-md text-surface-container-lowest max-w-full shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">call</span>
              </div>
              <div>
                <div className="font-label-sm text-label-sm uppercase text-secondary font-bold tracking-wider">
                  Ordini &amp; Asporto
                </div>
                <a
                  className="font-title-lg text-title-lg font-bold text-surface-container-lowest hover:text-primary transition-colors"
                  href="tel:+393501096092"
                >
                  +39 350 109 6092
                </a>
                <div className="font-body-sm text-body-sm text-surface-container-high">
                  Primi ritiri ore 18:30
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block self-start mt-8 reveal reveal-slow reveal-fade delay-[400ms]">
            <button
              type="button"
              onClick={scrollToPrimaSezione}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:bg-primary-container transition-all duration-200 ease-out transform active:scale-95"
            >
              <span className="material-symbols-outlined">restaurant_menu</span>
              Sfoglia le Pizze
            </button>
          </div>
        </div>
      </section>

      <nav className="sticky top-28 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md shadow-sm py-space-sm">
        <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="relative flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-nowrap scroll-smooth" id="categoryNav">
            <button className={`menu-filter-btn px-4 py-2 rounded-full font-label-md text-label-md cursor-pointer transition-all duration-200 ease-out transform ${active === "all" ? ACTIVE_CLASSES : INACTIVE_CLASSES}`} data-categoria="all" onClick={() => handleFilter("all")} type="button">
              Tutte le Categorie
            </button>

            {sections.map((section) => (
              <CategoryPill
                key={section.slug}
                section={section}
                isActive={active === section.slug}
                onSelect={handleFilter}
              />
            ))}
            {menu.formati.length > 0 && (
              <button className={`menu-filter-btn px-4 py-2 rounded-full font-label-md text-label-md cursor-pointer transition-all duration-200 ease-out transform ${active === "baby" ? ACTIVE_CLASSES : INACTIVE_CLASSES}`} data-categoria="baby" onClick={() => handleFilter("baby")} type="button">
                Pizze Baby / Mini
              </button>
            )}
            {menu.teglie.length > 0 && (
              <button className={`menu-filter-btn px-4 py-2 rounded-full font-label-md text-label-md cursor-pointer transition-all duration-200 ease-out transform ${active === "teglie" ? ACTIVE_CLASSES : INACTIVE_CLASSES}`} data-categoria="teglie" onClick={() => handleFilter("teglie")} type="button">
                Le Nostre Teglie
              </button>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary">
            </span>
            <span>Ingredienti Freschi Km0</span>
          </div>
        </div>
      </nav>

      <div
        id="menu-curtain"
        className="relative z-10 bg-surface shadow-[0_-20px_40px_rgba(0,0,0,0.20)] overflow-hidden"
      >

        <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl space-y-space-2xl">

          {sezioniNovita.map((section) => (
            <SectionBlock key={section.slug} section={section} />
          ))}

          {sezioniOrdinarie.map((section, index) => (
            <Fragment key={section.slug}>
              {index === 1 && <ImpastiDivider impasti={menu.impasti} />}
              <SectionBlock section={section} capitolo={index + 1} />
            </Fragment>
          ))}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">

            {menu.formati.length > 0 && (
              <section className="menu-section lg:col-span-5 space-y-space-md" id="cat-baby">
              <div className="reveal reveal-slow reveal-fade">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-widest">Capitolo 05</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Pizze Baby / Mini</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Tutte le pizze del listino possono essere fatte in formato ridotto al prezzo di listino −€ {formatPrice(babyOff)}.
                </p>
              </div>
              <div className="space-y-space-sm">

                {menu.formati.map((formato, index) => (
                  <div
                    key={formato.sigla}
                    className={`p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between reveal reveal-slow reveal-fade ${
                      index % 3 === 0
                        ? "delay-100"
                        : index % 3 === 1
                          ? "delay-200"
                          : "delay-300"
                    }`}
                  >
                    <div>
                      <div className="font-title-md text-title-md font-bold text-on-surface">
                        {formato.nome}
                      </div>
                      {formato.descrizione && (
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {formato.descrizione}
                        </p>
                      )}
                    </div>
                    <span className="font-title-lg text-title-lg font-bold text-primary shrink-0 whitespace-nowrap">
                      {formato.prezzo < 0 ? "−€ " : "€ "}
                      {formatPrice(Math.abs(formato.prezzo))}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            )}

            {menu.teglie.length > 0 && (
              <section className="menu-section lg:col-span-7 space-y-space-md" id="cat-teglie">
                <div className="reveal reveal-slow reveal-fade">
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-widest">Capitolo 06</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Le Nostre Teglie</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Ideali per serate in compagnia, rinfreschi ed eventi.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {menu.teglie.map((teglia, index) => (
                    <div
                      key={teglia.nome}
                      className={`p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between reveal reveal-slow reveal-fade ${
                        index % 2 === 0 ? "delay-150" : "delay-300"
                      }`}
                    >
                      <div className="space-y-space-xs">
                        {teglia.badge && (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                              index === 0
                                ? "bg-primary-container text-on-primary"
                                : "bg-secondary-container text-on-secondary-container"
                            }`}
                          >
                            {teglia.badge}
                          </span>
                        )}
                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface pt-1">{teglia.nome}</h3>
                        <div className="pt-2 space-y-1 font-body-sm text-body-sm">
                          {teglia.voci.map((voce) => (
                            <div className="flex justify-between gap-3" key={voce.nome}>
                              <span>{voce.nome}:</span>
                              <strong className="text-on-surface font-bold shrink-0 whitespace-nowrap">€ {formatPrice(voce.prezzo)}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-surface-container flex items-center gap-1.5 text-secondary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px]">event_available</span> Solo su ordinazione: almeno il giorno prima
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-space-md rounded-xl bg-surface-container flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md reveal reveal-slow reveal-fade delay-300">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0">alarm_on</span>
                  <span>
                    <strong>Solo su ordinazione (almeno il giorno prima).</strong> Si consiglia la prenotazione telefonica allo +39 350 109 6092.</span>
                </div>
              </section>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg pt-space-md">

            <section className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm space-y-space-md reveal reveal-slow reveal-left delay-150">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                </div>
                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Aggiunte &amp; Extra</h3>
              </div>
              {menu.extra.length > 0 && (
                <ul className="space-y-space-sm font-body-md text-body-md text-on-surface-variant">
                  {menu.extra.map((riga, index) => (
                    <li
                      key={riga.nome}
                      className={`flex items-center justify-between py-1.5 ${index < menu.extra.length - 1 ? "border-b border-surface-container" : ""}`}
                    >
                      <span className="pr-3">{riga.nome}</span>
                      <strong className="text-on-surface shrink-0 whitespace-nowrap">
                        +€ {formatPrice(riga.prezzo)}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
              <div className="space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                {NOTE_LISTINO.map((nota) => (
                  <p key={nota}>{nota}</p>
                ))}
              </div>
            </section>

            <section className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm space-y-space-md reveal reveal-slow reveal-right delay-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                </div>
                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Allergeni</h3>
              </div>
              <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                {ALLERGENI.map((frase) => (
                  <p key={frase}>{frase}</p>
                ))}
              </div>

              {legenda.length > 0 && (
                <>
                  <div className="hidden md:block">{legendaHtml}</div>
                  <Collapsible
                    open={legendaAperta}
                    onOpenChange={setLegendaAperta}
                    className="md:hidden"
                  >
                    <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-lg bg-surface-container px-4 py-3 text-left font-body-md text-body-md font-semibold text-on-surface">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">menu_book</span>
                        Legenda degli allergeni ({legenda.length})
                      </span>
                      <span className="material-symbols-outlined text-[22px] text-on-surface-variant transition-transform duration-200 group-data-[state=open]:rotate-180">
                        expand_more
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-space-md">
                      {legendaHtml}
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}
            </section>
          </div>

          <div className="p-space-lg md:p-space-xl rounded-xl bg-on-surface text-surface flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-md reveal reveal-slow reveal-zoom delay-150">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-headline-sm text-headline-sm font-bold text-surface">Hai già scelto la tua pizza preferita?</h4>
              <p className="font-body-md text-body-md text-surface-container-high">Prenota per tempo il tuo orario di ritiro: nei weekend le fascie orarie disponibili si esauriscono in fretta!</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold shadow-xs">Chiuso Lunedì e Martedì</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold shadow-xs">Si consiglia la prenotazione telefonica</span>
              </div>
            </div>
            <a
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:bg-primary-container transition-all duration-200 ease-out transform active:scale-95 group relative overflow-hidden shrink-0 cursor-pointer"
              href="tel:+393501096092"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:rotate-12">
                phone_in_talk
              </span>
              <span className="relative">
                Chiama +39 350 109 6092
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-on-primary transition-all duration-300 ease-out group-hover:w-full" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
