import FeaturedPizzasSlider from "@/components/home/FeaturedPizzasSlider";
import InteractiveMap from "@/components/home/InteractiveMap";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getFeaturedPizzas } from "@/lib/menu";
import { images } from "@/lib/images";

export const revalidate = 60;

export default async function HomePage() {
  const featuredPizzas = await getFeaturedPizzas();

  return (
    <main className="w-full bg-surface relative">

      <RevealOnScroll />

      <section className="sticky top-0 z-0 h-screen w-full overflow-hidden flex items-center justify-center bg-surface">

        <div className="absolute inset-0 z-0 bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Forno a Legna Maeli Pizza Campocroce"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
            src={images.homeHero}
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
                <span className="sm:hidden">FORNO A LEGNA</span>
                <span className="hidden sm:inline">FORNO A LEGNA DAL 2003</span>
              </span>
              <span className="text-surface-variant font-bold hidden sm:inline">•</span>
              <span className="font-label-sm text-label-sm text-secondary font-bold hidden sm:inline truncate">
                CAMPOCROCE di M.V.TO (TV)
              </span>
            </div>

            <h1 className="font-display text-display-mobile md:text-display text-surface-container-lowest font-bold leading-tight tracking-tight reveal reveal-slow reveal-fade delay-200">
              L&apos;autentica pizza da asporto cotta nel forno a legna a
              Campocroce.
            </h1>

            <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-surface-container-high max-w-2xl font-normal leading-relaxed reveal reveal-slow reveal-fade delay-300">
              Impasto a lenta lievitazione, ingredienti selezionati di
              stagione e la passione inalterata di Martino &amp; Elisa nel
              cuore del paese.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2 reveal reveal-slow reveal-fade delay-[400ms]">

              <a
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:bg-primary-container transition-all duration-200 ease-out transform active:scale-95 group relative overflow-hidden"
                href="/listino"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:rotate-12">
                  restaurant_menu
                </span>
                <span className="relative">
                  Sfoglia il Listino
                  <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-on-primary transition-all duration-300 ease-out group-hover:w-full" />
                </span>
              </a>

              <a
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:bg-surface-container transition-all duration-200 ease-out transform active:scale-95 group relative overflow-hidden"
                href="tel:+393501096092"
              >
                <span className="material-symbols-outlined text-[20px] text-primary transition-transform duration-200 group-hover:rotate-12">
                  phone_in_talk
                </span>
                <span className="relative">
                  Chiama e Prenota al +39 350 109 6092
                  <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
                </span>
              </a>
            </div>

            <div className="hidden sm:inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md text-surface-container-lowest reveal reveal-slow reveal-fade delay-[500ms]">
              <span className="material-symbols-outlined text-[20px] text-secondary-container">
                touch_app
              </span>
              <span className="font-label-sm text-label-sm tracking-wide">
                <strong>Ordina in 2 clic:</strong> Scegli la pizza e chiama
                subito per concordare l'orario esatto di sfornata.
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-surface shadow-[0_-20px_40px_rgba(0,0,0,0.20)] rounded-t-[32px] md:rounded-t-[48px] overflow-hidden">

        <section
          className="w-full flex flex-col justify-center py-12 md:py-20 bg-surface"
          id="listino-rapido"
        >
          <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop w-full flex flex-col gap-8 md:gap-10">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 reveal reveal-slow reveal-fade">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                    Le Più Amate dai Nostri Clienti
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Pizze in Evidenza
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Sfornate ad altissima temperatura sul piano refrattario di
                  rovere. Crosta dorata e friabile, centro morbido e profumato.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Tutte disponibili stasera
                </span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              </div>
            </div>

            <div className="reveal reveal-slow reveal-fade delay-200">
              <FeaturedPizzasSlider pizzas={featuredPizzas} />
            </div>
          </div>
        </section>

        <section className="w-full min-h-screen flex flex-col justify-center py-16 md:py-24 bg-surface-container-low relative overflow-hidden">

          <div className="absolute top-1/4 -right-16 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -left-16 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6 reveal reveal-slow reveal-left">
                <div className="inline-flex items-center gap-2">
                  <span className="w-8 h-1 rounded-full bg-primary" />
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
                    Segreti della Nostra Pala
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Il calore della legna vera, la leggerezza della lenta
                  lievitazione.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Ogni mattina ci dedichiamo alla preparazione dell'impasto. La
                  cottura nel forno a legna circolare dona alla pizza una
                  friabilità inconfondibile, digeribile e mai gommosa anche
                  gustata a casa.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

                  <div className="reveal reveal-slow reveal-fade delay-100">
                    <div className="h-full p-4 rounded-xl bg-surface-container-lowest border-l-4 border-secondary shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                          <span className="material-symbols-outlined text-[20px]">
                            eco
                          </span>
                        </span>
                        <span className="font-headline-sm text-headline-sm font-bold text-secondary">
                          0% Chimica
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Solo farina, acqua viva filtrata, sale marino e lievito
                        naturale.
                      </span>
                    </div>
                  </div>

                  <div className="reveal reveal-slow reveal-fade delay-200">
                    <div className="h-full p-4 rounded-xl bg-surface-container-lowest border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-700">
                          <span className="material-symbols-outlined text-[20px]">
                            grain
                          </span>
                        </span>
                        <span className="font-headline-sm text-headline-sm font-bold text-amber-700">
                          Farine Venete
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Grani certificati dal nostro mulino di fiducia a km
                        ridotto.
                      </span>
                    </div>
                  </div>

                  <div className="reveal reveal-slow reveal-fade delay-300">
                    <div className="h-full p-4 rounded-xl bg-surface-container-lowest border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">
                            local_fire_department
                          </span>
                        </span>
                        <span className="font-headline-sm text-headline-sm font-bold text-primary">
                          Termiche
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Cartoni traspiranti che mantengono il fondo asciutto e
                        croccante.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative reveal reveal-slow reveal-right delay-200">
                <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3] ring-1 ring-outline-variant/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Martino ed Elisa al lavoro nella pizzeria Maeli a Campocroce"
                    className="w-full h-full object-cover"
                    src={images.homeMartinoElisa}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-md shadow-lg border border-surface-container-high/40">
                    <p className="font-title-md text-title-md font-bold text-on-surface">
                      Martino &amp; Elisa
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Al vostro servizio a Campocroce dal 2003
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full min-h-screen flex flex-col justify-center py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop w-full">
            <div className="rounded-3xl bg-surface-container-lowest shadow-xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

              <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between gap-8 reveal reveal-slow reveal-left">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold uppercase tracking-wider">
                      Ritiro in Sede
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      • Campocroce di Mogliano V.to
                    </span>
                  </div>

                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    Info Rapide &amp; Ordini
                  </h2>

                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Esclusivamente pizza da asporto con ritiro puntuale in
                    sede. Consigliamo di chiamare con anticipo durante i fine
                    settimana per scegliere l'orario preferito.
                  </p>

                  <div className="p-4 sm:p-6 rounded-2xl bg-primary-fixed/30 border border-primary-fixed flex flex-col gap-2 transition-all duration-300 hover:shadow-md hover:border-primary/50">
                    <span className="font-label-sm text-label-sm uppercase font-bold text-primary tracking-wider">
                      Telefono Prenotazioni &amp; Asporto
                    </span>
                    <div className="py-1">
                      <a
                        className="text-xl sm:text-2xl md:text-headline-lg font-bold text-primary inline-flex items-center gap-2 sm:gap-2.5 group/phone relative whitespace-nowrap tracking-tight transition-transform duration-200 ease-out hover:scale-105 origin-left"
                        href="tel:+393501096092"
                      >
                        <span className="material-symbols-outlined text-[20px] sm:text-[24px] group-hover/phone:rotate-12 transition-transform duration-200 shrink-0">
                          call
                        </span>
                        <span className="relative">
                          +39 350 109 6092
                          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover/phone:w-full" />
                        </span>
                      </a>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Linee telefoniche attive tutti i giorni dalle ore 17:30
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-surface-container">
                      <span className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">
                          calendar_today
                        </span>
                        Mercoledì – Domenica
                      </span>
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        18:30 – 21:30
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-primary text-on-primary shadow-sm">
                      <span className="font-title-md text-title-md font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">
                          block
                        </span>
                        Lunedì - Martedì
                      </span>
                      <span className="font-label-lg text-label-lg font-bold uppercase tracking-wider bg-surface-container-lowest text-primary px-3 py-1 rounded-full shadow-xs">
                        CHIUSO
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Maeli+Pizza+Via+del+Molino+6+Campocroce+di+Mogliano+Veneto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 pt-2 group/map"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary/10 group-hover/map:bg-primary/10 text-secondary group-hover/map:text-primary flex items-center justify-center shrink-0 transition-colors duration-200">
                      <span className="material-symbols-outlined text-[22px]">
                        location_on
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md font-bold text-on-surface group-hover/map:text-primary transition-colors duration-200">
                        Via del Molino, 6, Campocroce di M.V.to (TV)
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 group-hover/map:text-primary transition-colors duration-200">
                        Apri su Google Maps
                        <span className="material-symbols-outlined text-[14px]">
                          open_in_new
                        </span>
                      </span>
                    </div>
                  </a>
                </div>

                <div className="pt-4 hidden sm:block">
                  <a
                    className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-2xl hover:scale-[1.03] hover:bg-primary-container transition-all duration-200 ease-out active:scale-95 group relative overflow-hidden"
                    href="tel:+393501096092"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform duration-200">
                      phone_in_talk
                    </span>
                    <span className="relative">
                      Chiama Ora: +39 350 109 6092
                      <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-on-primary transition-all duration-200 ease-out group-hover:w-full" />
                    </span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 min-h-[380px] lg:min-h-full relative reveal reveal-slow reveal-right delay-200">
                <InteractiveMap />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden pb-[env(safe-area-inset-bottom,0px)] pointer-events-none">
        <a
          className="w-full flex items-center justify-between px-6 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-2xl active:scale-95 transition-transform pointer-events-auto"
          href="tel:+393501096092"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              phone_in_talk
            </span>
            <span>Ordina per Telefono</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-bold text-body-sm">
            +39 350 109 6092
          </span>
        </a>
      </div>
    </main>
  );
}
