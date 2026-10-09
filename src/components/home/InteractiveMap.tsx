"use client";

import { useState } from "react";
import { useConsenso } from "@/lib/consent";

export default function InteractiveMap() {
  const { preferenze, salva } = useConsenso();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Il consenso esplicito per la categoria "mappa": senza, l'iframe di
  // Google Maps non viene nemmeno renderizzato.
  const consensoMappa = preferenze?.mappa === true;

  const handleReveal = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsFading(false);
    }, 300);
  };

  const handleRestore = () => {
    setIsRevealed(false);
    setIsFading(false);
  };

  const consentiEMostra = () => {
    salva({ statistiche: preferenze?.statistiche ?? false, mappa: true });
    setIsRevealed(true);
  };

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-full rounded-3xl overflow-hidden shadow-inner">

      {consensoMappa && (
        <iframe
          title="Mappa Google Maps - Maeli Pizza"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2595.9771772644644!2d12.2152278!3d45.584280699999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47794a84a622d949%3A0x70808584f5a3e97a!2sMaeli%20Pizza!5e1!3m2!1sit!2sit!4v1790719486948!5m2!1sit!2sit"
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}

      {!consensoMappa && (
        <div className="absolute inset-0 bg-surface-container-low flex flex-col items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-surface-container flex flex-col items-center text-center max-w-xs w-full">
            <div className="w-14 h-14 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shadow-md mb-3">
              <span className="material-symbols-outlined text-[30px]">
                map_off
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Mappa non visualizzata
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-5">
              Per rispettare le tue preferenze la mappa di Google Maps non
              viene caricata.
            </p>
            <button
              type="button"
              onClick={consentiEMostra}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center gap-2 shadow-md hover:bg-primary-container transition-colors duration-200 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">
                place
              </span>
              Consenti e visualizza
            </button>
          </div>
        </div>
      )}

      {consensoMappa && !isRevealed && (
        <div
          className={`absolute inset-0 bg-black/35 flex flex-col items-center justify-center p-4 transition-all duration-300 ease-out ${
            isFading
              ? "opacity-0 pointer-events-none scale-95"
              : "opacity-100 pointer-events-auto scale-100"
          }`}
        >

          <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/40 flex flex-col items-center text-center max-w-xs w-full transition-transform transform hover:scale-[1.02] duration-300">

            <div className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg mb-3 animate-[bounce_2s_infinite]">
              <span className="material-symbols-outlined text-[30px]">
                local_pizza
              </span>
            </div>

            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Maeli Pizza
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 mb-5">
              Via del Molino, 6 • Campocroce
            </p>

            <button
              type="button"
              onClick={handleReveal}
              style={{ backgroundColor: "#1c1b1b", color: "#ffffff" }}
              className="px-6 py-2.5 rounded-full !bg-[#1c1b1b] hover:!bg-primary !text-white font-label-md text-label-md font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-colors duration-200 active:scale-95 group appearance-none"
            >
              <span className="material-symbols-outlined text-[18px] text-white transition-transform group-hover:rotate-45">
                explore
              </span>
              <span className="text-white !text-white font-bold">Visualizza mappa</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-auto bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-xs flex items-center justify-center gap-1.5 border border-surface-container-high/40 text-on-surface">
            <strong className="text-secondary font-bold text-sm">P</strong>
            <span className="font-medium">Parcheggio facile per carico asporto</span>
          </div>
        </div>
      )}

      {consensoMappa && isRevealed && (
        <button
          type="button"
          onClick={handleRestore}
          className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface hover:text-primary font-label-sm text-label-sm font-bold shadow-md hover:shadow-lg border border-outline-variant/30 flex items-center gap-1.5 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-[16px]">
            close
          </span>
          <span>Info sede</span>
        </button>
      )}
    </div>
  );
}
