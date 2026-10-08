import type { ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const MAPS_URL =
  "https://maps.google.com/?q=Maeli+Pizza+Via+del+Molino+6+Campocroce+di+Mogliano+Veneto";

function SezioneFooter({
  icona,
  titolo,
  contenuto,
}: {
  icona: string;
  titolo: string;
  contenuto: ReactNode;
}) {
  const testata = (
    <h3 className="font-title-lg text-title-lg text-on-surface font-semibold flex items-center gap-2">
      <span className="material-symbols-outlined text-secondary text-[20px]">
        {icona}
      </span>
      {titolo}
    </h3>
  );

  return (
    <div className="border-t border-surface-container-high pt-3 md:border-t-0 md:pt-0">
      <div className="hidden md:block space-y-space-sm">
        {testata}
        {contenuto}
      </div>

      <div className="md:hidden">
        <Collapsible>
          <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 py-2 cursor-pointer select-none text-left rounded-lg transition-colors hover:text-primary">
            {testata}
            <span
              aria-hidden
              className="material-symbols-outlined text-secondary text-[22px] transition-transform duration-300 ease-out group-data-[state=open]:rotate-180"
            >
              expand_more
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 pb-1">
            <div className="space-y-space-sm pl-7">{contenuto}</div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-2xl">
      <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-3 md:gap-space-xl">

          <div className="space-y-space-sm">
            <div className="flex items-center gap-space-sm mb-space-sm">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Maeli Pizza
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Pizzeria da asporto con autentico forno a legna. Tradizione,
              lievitazione naturale e ingredienti selezionati.
            </p>
            <div className="pt-space-xs">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary font-label-sm text-label-sm text-on-secondary font-semibold">
                Fondata nel 2003
              </span>
            </div>
          </div>

          <SezioneFooter
            icona="location_on"
            titolo="Dove Trovarci"
            contenuto={
              <a
                className="block font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline underline-offset-4 transition-colors"
                href={MAPS_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                Via del Molino, 6
                <br />
                31021 Campocroce di Mogliano V.to (TV)
              </a>
            }
          />

          <SezioneFooter
            icona="schedule"
            titolo="Orari di Apertura"
            contenuto={
              <>
                <ul className="font-body-md text-body-md text-on-surface-variant space-y-1.5">
                  <li className="flex justify-between">
                    <span>Marcoledì - Domenica:</span>
                    <strong className="text-on-surface">18:30 - 21:30</strong>
                  </li>
                  <li className="flex justify-between text-on-surface-variant">
                    <span>Lunedì - Martedì:</span>
                    <span className="text-primary font-semibold">Chiuso</span>
                  </li>
                </ul>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                  Ordini telefonici aperti dalle 17:30
                </p>
              </>
            }
          />

          <SezioneFooter
            icona="call"
            titolo="Prenotazioni & Asporto"
            contenuto={
              <>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Chiamaci direttamente per prenotare l&apos;orario di ritiro
                  delle tue pizze sfornate al momento.
                </p>
                <a
                  className="group/tel inline-flex items-center gap-2 font-title-lg text-title-lg font-bold text-primary"
                  href="tel:+393501096092"
                >
                  <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover/tel:translate-y-px">
                    phone
                  </span>
                  <span className="relative inline-block">
                    +39 350 109 6092
                    <span
                      aria-hidden
                      className="absolute left-0 bottom-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out group-hover/tel:scale-x-100"
                    />
                  </span>
                </a>
              </>
            }
          />
        </div>

        <div className="mt-space-xl md:mt-space-2xl pt-space-lg border-t border-surface-container-high/80 flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-center md:text-left">
            <span>© 2026 Maeli Pizza di Martino &amp; Elisa S.n.c.</span>
            <span className="hidden md:inline">•</span>
            <span>P.IVA 03489210274</span>
            <span className="hidden md:inline">•</span>
            <span>Tutti i diritti riservati</span>
            <span className="hidden md:inline">•</span>
            <a className="hover:text-primary transition-colors" href="#">
              Informativa e privacy
            </a>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                local_fire_department
              </span>
              Forno a Legna Tradizionale
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
