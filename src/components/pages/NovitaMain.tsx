"use client";

import { useCallback, useEffect, useState } from "react";
import { type NewsArticle, type NewsLabel } from "@/lib/news";
import { images } from "@/lib/images";

const TEL_HREF = "tel:+393501096092";

const LABEL_ICONS: Record<string, string> = {
  "Novità": "campaign",
  "Festività": "celebration",
  "Specialità": "local_fire_department",
};
const DEFAULT_ICON = "campaign";

const DATA_FORMAT = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Rome",
});

function formatDate(iso: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return DATA_FORMAT.format(date);
}

function delayClass(index: number): string {
  const step = index % 3;
  return step === 0 ? "delay-100" : step === 1 ? "delay-200" : "delay-300";
}

function ImageBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-sm">
      <span className="material-symbols-outlined text-[14px]">{icon}</span>
      {label}
    </span>
  );
}

function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  const icon = (article.labelNome && LABEL_ICONS[article.labelNome]) || DEFAULT_ICON;
  const data = formatDate(article.publishedAt);

  const isNovita = article.labelNome === "Novità";

  const [imgBroken, setImgBroken] = useState(false);
  const showImage = Boolean(article.imageUrl) && !imgBroken;

  return (

    <div className={`relative reveal reveal-slow reveal-fade ${delayClass(index)}`}>
      {isNovita && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-3 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-sm">
          Novità
        </span>
      )}
      <article
        className={`news-card group bg-surface-container-lowest rounded-2xl hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
          isNovita
            ? "border-2 border-primary hover:border-primary"
            : "border border-surface-container-high hover:border-outline-variant"
        }`}
      >

        <div className="md:w-5/12 h-56 md:h-auto min-h-[220px] relative overflow-hidden shrink-0 bg-surface-container-highest">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={article.titolo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgBroken(true)}
              src={article.imageUrl ?? undefined}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[56px] text-on-surface-variant">
                {icon}
              </span>
            </div>
          )}
          {article.imageLabel && (
            <ImageBadge icon={icon} label={article.imageLabel} />
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
          <div className="space-y-2">

            <div className="flex items-center justify-between gap-3">
              {article.labelNome && (
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  {article.labelNome}
                </span>
              )}
              {data && (
                <span className="text-tertiary font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">
                    calendar_today
                  </span>
                  {data}
                </span>
              )}
            </div>
            <h3 className="font-headline-md text-xl md:text-2xl text-on-surface font-bold group-hover:text-primary transition-colors leading-snug">
              {article.titolo}
            </h3>
            {article.contenuto && (
              // Il contenuto arriva da `news.ts` già convertito
              // (ogni "\n" → <br>): lo inseriamo come HTML.
              <p
                className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.contenuto }}
              />
            )}
          </div>

          {isNovita && (
            <div className="pt-5 mt-4 border-t border-surface-container flex justify-center">
              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:shadow-xl hover:scale-[1.04] hover:bg-primary-container transition-all duration-200 ease-out transform active:scale-95 group/call relative overflow-hidden cursor-pointer"
                href={TEL_HREF}
              >
                <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover/call:rotate-12">
                  phone_in_talk
                </span>
                <span className="relative">
                  Chiama la Pizzeria
                  <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-on-primary transition-all duration-300 ease-out group-hover/call:w-full" />
                </span>
              </a>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default function NovitaMain({
  labels,
  initialArticles,
  initialHasMore,
}: {
  labels: NewsLabel[];
  initialArticles: NewsArticle[];
  initialHasMore: boolean;
}) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dopo ogni aggiornamento dell'elenco i nuovi nodi .reveal vanno
  // registrati dall'observer: RevealOnScroll ascolta questo evento.
  useEffect(() => {
    window.dispatchEvent(new Event("maeli:reveal-refresh"));
  }, [articles]);

  /** Scarica un blocco di articoli (offset = posizione di partenza). */
  const fetchPage = useCallback(
    async (offset: number, labelId: string | null) => {
      const params = new URLSearchParams({ offset: String(offset) });
      if (labelId) params.set("labelId", labelId);
      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error(`GET /api/news → ${res.status}`);
      return (await res.json()) as {
        articles: NewsArticle[];
        hasMore: boolean;
      };
    },
    [],
  );

  /** "Carica altri articoli": appending del blocco successivo. */
  const caricaAltri = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const page = await fetchPage(articles.length, activeLabel);
      setArticles((prev) => [...prev, ...page.articles]);
      setHasMore(page.hasMore);
    } catch (error) {
      console.error("NovitaMain: caricamento articoli fallito.", error);
    } finally {
      setLoading(false);
    }
  }, [loading, articles.length, activeLabel, fetchPage]);

  /** Clic su una pill filtro: ricarica dall'inizio con l'etichetta scelta. */
  const filtra = useCallback(
    async (labelId: string | null) => {
      if (loading) return;
      setActiveLabel(labelId);
      setLoading(true);
      try {
        const page = await fetchPage(0, labelId);
        setArticles(page.articles);
        setHasMore(page.hasMore);
      } catch (error) {
        console.error("NovitaMain: filtro articoli fallito.", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, fetchPage],
  );

  const pillClass = (active: boolean) =>
    `px-4 py-2 rounded-full font-label-md text-label-md font-semibold whitespace-nowrap cursor-pointer transition-all ${
      active
        ? "bg-on-surface text-surface"
        : "text-on-surface-variant bg-surface-container-low hover:text-on-surface"
    }`;

  return (
    <main className="w-full bg-surface min-h-screen relative">

      <section className="sticky top-0 z-0 h-screen w-full overflow-hidden flex items-center justify-center bg-surface">

        <div className="absolute inset-0 z-0 bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Forno a Legna Maeli Pizza Campocroce"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
            src={images.novitaHero}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-margin md:px-margin-desktop w-full flex flex-col justify-center">
          <div className="max-w-3xl space-y-6 sm:space-y-7 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/10 backdrop-blur-md border border-surface/20 text-surface text-label-sm font-label-sm uppercase tracking-widest w-fit reveal reveal-slow reveal-fade delay-100">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
              Comunicazioni Ufficiali
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-surface leading-tight reveal reveal-slow reveal-fade delay-200">
              Tutte le Nostre Novità
            </h1>

            <p className="font-body-lg text-body-lg text-surface-container-high leading-relaxed max-w-2xl reveal reveal-slow reveal-fade delay-300">
              Rimani aggiornato su orari speciali, aperture straordinarie,
              impasti speciali e nuove pizze del mese sfornate ogni sera a
              Campocroce.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col items-start gap-3.5 text-label-md reveal reveal-slow reveal-fade delay-[400ms]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed/20 text-secondary-fixed border border-secondary-fixed/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
                <span>Forno Acceso • Asporto Regolare 18:30 - 21:30</span>
              </div>
              <div className="inline-flex items-center gap-2 text-surface-variant text-label-md pl-1">
                <span className="material-symbols-outlined text-[18px] text-surface-variant">
                  schedule
                </span>
                <span>Ordini telefonici attivi dalle 17:30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-surface shadow-[0_-20px_40px_rgba(0,0,0,0.20)] overflow-hidden">
        <div className="max-w-5xl mx-auto px-margin md:px-margin-desktop py-12 md:py-16 space-y-10">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-highest reveal reveal-slow reveal-fade">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Ultimi Annunci
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Consulta gli avvisi recenti della nostra pizzeria
              </p>
            </div>
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
              id="categoryFilter"
            >
              <button
                aria-pressed={activeLabel === null}
                className={pillClass(activeLabel === null)}
                onClick={() => filtra(null)}
                type="button"
              >
                Tutte
              </button>
              {labels.map((label) => (
                <button
                  aria-pressed={activeLabel === label.id}
                  className={pillClass(activeLabel === label.id)}
                  key={label.id}
                  onClick={() => filtra(label.id)}
                  type="button"
                >
                  {label.nome}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6" id="newsList">
            {articles.map((article, index) => (
              <NewsCard article={article} index={index} key={article.id} />
            ))}
            {articles.length === 0 && !loading && (
              <p className="py-8 text-center font-body-md text-body-md text-on-surface-variant">
                Nessun articolo al momento: torna a trovarci presto!
              </p>
            )}
          </div>

          {hasMore && (
            <div className="flex justify-center reveal reveal-slow reveal-fade">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-semibold cursor-pointer transition-all hover:bg-on-surface hover:text-surface hover:border-on-surface disabled:opacity-60 disabled:cursor-wait"
                disabled={loading}
                onClick={caricaAltri}
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}
                >
                  {loading ? "progress_activity" : "expand_more"}
                </span>
                {loading ? "Caricamento…" : "Carica altri articoli"}
              </button>
            </div>
          )}

          <div className="rounded-2xl bg-surface-container-low border border-surface-container p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm reveal reveal-slow reveal-zoom delay-150">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">
                  info
                </span>
                Consiglio del Fornaio
              </div>
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Vuoi prenotare per stasera o chiedere informazioni?
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Per garantirti l&apos;orario di ritiro ideale nel fine
                settimana consigliamo di chiamare con un po&apos; di anticipo.
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:bg-primary-container transition-all duration-200 ease-out transform active:scale-95 group relative overflow-hidden shrink-0 cursor-pointer"
                href={TEL_HREF}
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
      </div>
    </main>
  );
}
