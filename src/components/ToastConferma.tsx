"use client";

import { useEffect, useState } from "react";

export type TonalitaToast = "verde" | "rosso";

export type ToastState = {
  id: number;
  messaggio: string;
  tonalita: TonalitaToast;
};

const DURATA_MS = 4000;

export function useToastConferma() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (toast === null) return;
    const timer = setTimeout(() => setToast(null), DURATA_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const mostraToast = (messaggio: string, tonalita: TonalitaToast) => {
    setToast({ id: Date.now(), messaggio, tonalita });
  };

  const chiudiToast = () => setToast(null);

  return { toast, mostraToast, chiudiToast };
}

export default function ToastConferma({
  toast,
  onChiudi,
}: {
  toast: ToastState | null;
  onChiudi: () => void;
}) {
  if (toast === null) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 py-3 pl-4 pr-2 rounded-full shadow-lg ${
        toast.tonalita === "verde"
          ? "bg-secondary text-on-secondary"
          : "bg-primary text-on-primary"
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        check_circle
      </span>
      <span className="text-sm font-semibold">{toast.messaggio}</span>
      <button
        type="button"
        aria-label="Chiudi notifica"
        onClick={onChiudi}
        className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
