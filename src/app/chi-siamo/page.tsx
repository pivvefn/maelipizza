import type { Metadata } from "next";
import Link from "next/link";

import RevealOnScroll from "@/components/RevealOnScroll";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Chi Siamo",
  description:
    "Maeli Pizza S.n.c. di Martino Pivato e Elisa Nicorelli: oltre vent'anni di forno a legna a Campocroce di Mogliano Veneto (TV). La nostra storia, i valori, gli ingredienti e i 3 pilastri di un asporto artigianale dal 2003.",
};

export default function ChiSiamoPage() {
  return (
    <main className="w-full pt-28 bg-surface min-h-screen">

      <RevealOnScroll />
      <div className="flex flex-col w-full">

        <section className="relative w-full min-h-[560px] md:min-h-[640px] flex items-center justify-center overflow-hidden bg-on-surface py-space-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center transform duration-700"
            style={{
              backgroundImage: `url("${images.chiSiamoForno}")`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/95 via-on-surface/75 to-on-surface/70"></div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-8 flex flex-col gap-space-md text-surface reveal reveal-left">
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-surface-container-lowest/15 backdrop-blur-md border border-surface/20 text-surface">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-surface">
                    Maeli Pizza S.n.c. • Martino Pivato & Elisa Nicorelli
                  </span>
                </div>
                <h1 className="font-display text-display-mobile md:text-display text-surface tracking-tight leading-tight max-w-3xl font-bold">
                  Una storia di passione, legna ardente e tradizione a
                  Campocroce.
                </h1>
                <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl leading-relaxed">
                  Dal 2003 accendiamo la fiamma del nostro forno ogni sera per
                  servire il nostro paese con impasti lievitati con calma,
                  condimenti selezionati con scrupolo e il calore autentico di
                  una famiglia unita dal mestiere bianco dell&apos;arte bianca.
                </p>
                <div className="flex flex-wrap items-center gap-space-sm pt-space-sm">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-lowest/15 backdrop-blur-md border border-surface/20 text-surface">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      local_fire_department
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-surface">
                        Cottura viva
                      </span>
                      <span className="font-body-sm text-body-sm text-surface-container-high">
                        Legna di faggio e rovere veneto stagionato
                      </span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-lowest/15 backdrop-blur-md border border-surface/20 text-surface">
                    <span className="material-symbols-outlined text-secondary-container text-[20px]">
                      timelapse
                    </span>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-surface">
                        Lunga maturazione
                      </span>
                      <span className="font-body-sm text-body-sm text-surface-container-high">
                        Alta digeribilità naturale
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 reveal reveal-right delay-200">
                <div className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl p-space-lg md:p-space-xl shadow-md border border-surface-container-high/40 text-on-surface relative overflow-hidden">
                  <div className="space-y-space-md">
                    <span className="material-symbols-outlined text-primary text-[36px]">
                      format_quote
                    </span>
                    <p className="font-headline-sm text-headline-sm text-on-surface font-semibold leading-snug">
                      &ldquo;La pizza non è solo un pasto, è un rito di famiglia
                      che portiamo sulle vostre tavole da oltre 20 anni.&rdquo;
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Ci siamo sempre detti che una pizza buona nasce molto prima
                      del forno: nasce dalla scelta della materia prima, dal
                      rispetto per l&apos;acqua e il lievito, e dal sorriso
                      quando passate a ritirare la vostra scatola calda.
                    </p>
                  </div>
                  <div className="pt-space-md mt-space-md border-t border-outline-variant/30 flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-headline-sm font-bold shrink-0">
                      M&amp;E
                    </div>
                    <div>
                      <h4 className="font-title-md text-title-md font-bold text-on-surface">
                        Martino & Elisa
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Fondatori e Maestri Pizzaioli
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-surface-container py-space-2xl">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">

              <div className="lg:col-span-7 space-y-space-md reveal reveal-left">
                <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  La Nostra Scelta Consapevole
                </span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold leading-tight">
                  Perché abbiamo scelto solo l&apos;asporto?
                </h2>
                <div className="space-y-space-md text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
                  <p>
                    Abbiamo scelto con convinzione di concentrare tutta la nostra
                    energia e cura su una sola cosa:{" "}
                    <strong className="text-on-surface">
                      sfornare pizze perfette da gustare calde e fragranti a casa
                      vostra.
                    </strong>
                  </p>
                  <p>
                    Niente intermediari frettolosi, niente cartoni dimenticati
                    sui motorini o ritardi che bagnano il cornicione:{" "}
                    <strong className="text-on-surface">
                      venite a ritirare la vostra pizza appena tolta dal forno,
                      calda e fumante
                    </strong>
                    , programmando insieme al minuto esatto il vostro passaggio.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-sm">
                  <div className="p-space-md rounded-lg bg-surface-container-lowest flex items-start gap-3 shadow-sm">
                    <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="font-title-md text-title-md font-bold text-on-surface">
                        Fragranza Intatta
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Dalla pala al cartone forato traspirante, zero condensa
                        sul fondo.
                      </p>
                    </div>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-lowest flex items-start gap-3 shadow-sm">
                    <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
                      timer
                    </span>
                    <div>
                      <p className="font-title-md text-title-md font-bold text-on-surface">
                        Precisione nei Tempi
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Orari concordati al telefono con scaglioni di 5 minuti
                        per non attendere.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative reveal reveal-right delay-200">
                <div className="relative rounded-xl overflow-hidden shadow-md aspect-[4/5] bg-surface-container-highest">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    data-alt="Hands of Italian baker stretching freshly leavened sourdough pizza on a floured marble table, surrounded by rustic glass bottles of green extra virgin olive oil and wooden boxes filled with ripe red plum tomatoes"
                    style={{
                      backgroundImage:
                        `url("${images.chiSiamoStesa}")`,
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 p-space-md rounded-xl bg-surface-container-lowest/95 backdrop-blur-md text-on-surface shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                        <span className="material-symbols-outlined text-[20px]">
                          storefront
                        </span>
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg font-bold">
                          Ritiro Diretto a Campocroce di M. V.to (TV)
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Via del Molino 6 • Parcheggio fronte bottega
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-2xl">
          <div className="text-center max-w-2xl mx-auto mb-space-xl reveal reveal-fade">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-space-xs">
              I Nostri Valori Quotidiani
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
              I 3 Pilastri di Maeli Pizza
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              La semplicità è la cosa più difficile da ottenere: richiede regole
              ferree e una devozione assoluta per la materia prima.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">

            <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md group reveal reveal-fade delay-100">
              <div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[30px]">
                    local_fire_department
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                  Pilastro 01
                </span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1 mb-space-sm">
                  Il Forno a Legna
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Solo legna di faggio certificata e rovere stagionato. La fiamma
                  viva conferisce quella leggera tostatura profumata, croccante
                  fuori e soffice nel cuore della pasta, impossibile da
                  replicare nei forni elettrici moderni.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Temperatura costante</span>
                <span className="font-bold text-on-surface">430° - 470°C</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md group reveal reveal-fade delay-200">
              <div>
                <div className="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-space-md group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined text-[30px]">eco</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                  Pilastro 02
                </span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1 mb-space-sm">
                  Ingredienti del Territorio
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Fior di latte di latteria italiana, polpa di pomodoro 100%
                  italiano senza addensanti, farine poco raffinate di tipo 1 e
                  macinate a pietra. Rispettiamo una maturazione lunga a
                  temperatura controllata per un&apos;alta digeribilità.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Lievitazione naturale</span>
                <span className="font-bold text-on-surface">Minimo 48 Ore</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md group reveal reveal-fade delay-300">
              <div>
                <div className="w-14 h-14 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center mb-space-md group-hover:bg-on-surface group-hover:text-surface transition-colors">
                  <span className="material-symbols-outlined text-[30px]">schedule</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                  Pilastro 03
                </span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1 mb-space-sm">
                  Puntualità e Cortesia
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Non prendiamo più ordini di quanti il forno possa accoglierne
                  in qualità. Un&apos;organizzazione al minuto degli orari di
                  sfornata permette a ciascun cliente di ritirare la pizza senza
                  lunghe attese, con la calda accoglienza di un vicino di casa.
                </p>
              </div>
              <div className="mt-space-lg pt-space-sm border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Scaglioni di sfornata</span>
                <span className="font-bold text-on-surface">Ogni 5 Minuti</span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-surface-container-low py-space-xl">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-4 reveal reveal-fade">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                  Scorci di Bottega
                </span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
                  La nostra quotidianità a Campocroce
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Ogni dettaglio, dalla pala in legno alla farina sparsa sul banco
                di granito, racconta la passione di 21 anni di attività.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">

              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group shadow-sm bg-surface-container-highest reveal reveal-zoom delay-100">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Close up shot of smooth spherical sourdough pizza dough balls proofing gracefully in pale wooden bakery crates, dusted with fine rustic wheat flour in an Italian artisanal pizzeria"
                  style={{
                    backgroundImage:
                      `url("${images.chiSiamoCassette}")`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent flex items-end p-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm text-secondary-container uppercase font-bold">
                      Lievitazione Lenta
                    </span>
                    <p className="font-title-md text-title-md font-semibold text-surface">
                      Panetti a riposo
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group shadow-sm bg-surface-container-highest reveal reveal-zoom delay-200">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Freshly chopped whole milk Italian fior di latte mozzarella cheese alongside fragrant fresh green sweet basil leaves and rich crushed red tomato sauce on a white Italian marble counter"
                  style={{
                    backgroundImage:
                      `url("${images.chiSiamoIngredienti}")`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent flex items-end p-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm text-primary-fixed uppercase font-bold">
                      Materia Prima
                    </span>
                    <p className="font-title-md text-title-md font-semibold text-surface">
                      Ingredienti di prima scelta
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group shadow-sm bg-surface-container-highest reveal reveal-zoom delay-300">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  data-alt="Pizzaiolo carefully boxing a piping hot steaming Margherita pizza with charred leopard spots crust into an eco friendly takeaway box on the order pick-up counter"
                  style={{
                    backgroundImage:
                      `url("${images.chiSiamoConsegna}")`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent flex items-end p-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm text-secondary-container uppercase font-bold">
                      Asporto Perfetto
                    </span>
                    <p className="font-title-md text-title-md font-semibold text-surface">
                      Sfornata e subito pronta al banco
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-2xl">
          <div className="max-w-3xl mb-space-xl reveal reveal-fade">
            <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
              Il Nostro Cammino
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mt-1">
              Oltre vent&apos;anni di forno e farina
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-2 reveal reveal-fade delay-100">
              <span className="font-headline-lg text-headline-lg font-bold text-primary">
                2003
              </span>
              <h4 className="font-title-md text-title-md font-bold text-on-surface">
                Apertura della Pizzeria
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Viene inaugurata l&apos;attività e il forno a legna nel cuore di
                Campocroce, con la passione per la pizza artigianale come una
                volta.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-2 reveal reveal-fade delay-200">
              <span className="font-headline-lg text-headline-lg font-bold text-secondary">
                2015
              </span>
              <h4 className="font-title-md text-title-md font-bold text-on-surface">
                Nasce Maeli Pizza
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Cambio gestione e nuova identità con il nome Maeli Pizza: si
                rinnova il nome del locale mantenendo immutata la stessa
                proprietà e maestria di famiglia.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-2 reveal reveal-fade delay-300">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Oggi
              </span>
              <h4 className="font-title-md text-title-md font-bold text-on-surface">
                La Vostra Certezza
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                La stessa dedizione artigianale, unita alla cura per ogni
                singolo ordine da asporto nel nostro amato paese.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop pb-space-2xl">
          <div className="bg-surface-container-highest rounded-2xl p-space-lg md:p-space-2xl shadow-sm overflow-hidden relative reveal reveal-fade">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">

              <div className="lg:col-span-7 space-y-space-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">
                    phone_in_talk
                  </span>
                  Prenotazione Telefonica
                </div>
                <h3 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
                  Stasera pizza cotta a legna?
                </h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Consigliamo sempre di chiamare con anticipo, a partire dalle
                  ore 17:30, per concordare l&apos;orario migliore per il vostro
                  ritiro in pizzeria.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                  <a
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:bg-primary-container transition-all duration-200 ease-out transform active:scale-95 group relative overflow-hidden shrink-0 cursor-pointer"
                    href="tel:+393501096092"
                  >
                    <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:rotate-12">
                      phone_in_talk
                    </span>
                    <span className="relative">
                      Chiama: +39 350 109 6092
                      <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-on-primary transition-all duration-300 ease-out group-hover:w-full" />
                    </span>
                  </a>
                  <Link
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold shadow-md hover:shadow-2xl hover:scale-[1.04] hover:bg-surface-container transition-all duration-200 ease-out transform active:scale-95 group relative overflow-hidden shrink-0 cursor-pointer"
                    href="/listino"
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary transition-transform duration-200 group-hover:rotate-12">
                      restaurant_menu
                    </span>
                    <span className="relative">
                      Sfoglia il Listino
                      <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg">
                <a
                  href="https://maps.google.com/?q=Maeli+Pizza+Via+del+Molino+6+Campocroce+di+Mogliano+Veneto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group/map transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-secondary group-hover/map:text-primary transition-colors duration-200 text-[26px] shrink-0 mt-0.5">
                    location_on
                  </span>
                  <div className="space-y-1.5 leading-relaxed">
                    <h5 className="font-title-md text-title-md font-bold text-on-surface group-hover/map:text-primary transition-colors duration-200">
                      Bottega di Campocroce
                    </h5>
                    <p className="font-body-sm text-body-sm text-on-surface-variant group-hover/map:text-primary transition-colors duration-200 flex items-center gap-1.5 leading-relaxed">
                      Via del Molino, 6 • 31021 Campocroce di Mogliano V.to (TV)
                      <span className="material-symbols-outlined text-[15px]">
                        open_in_new
                      </span>
                    </p>
                    <p className="font-label-sm text-label-sm text-secondary font-semibold pt-0.5">
                      Parcheggio auto disponibile
                    </p>
                  </div>
                </a>
                <div className="border-t border-surface-container-high pt-space-md flex items-start gap-3.5">
                  <span className="material-symbols-outlined text-secondary text-[26px] shrink-0 mt-0.5">
                    schedule
                  </span>
                  <div className="w-full">
                    <h5 className="font-title-md text-title-md font-bold text-on-surface mb-2.5">
                      Orari di Servizio Asporto
                    </h5>
                    <div className="space-y-2.5 font-body-sm text-body-sm leading-relaxed">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-on-surface-variant">
                          Mercoledì – Domenica:
                        </span>
                        <span className="font-bold text-on-surface">
                          18:30 – 21:30
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-on-surface-variant">
                          Lunedì - Martedì:
                        </span>
                        <span className="font-semibold text-primary">
                          Chiuso per riposo
                        </span>
                      </div>
                    </div>
                    <div className="mt-space-md p-2.5 rounded-lg bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                        info
                      </span>
                      <span>Linea telefonica attiva dalle 17:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
