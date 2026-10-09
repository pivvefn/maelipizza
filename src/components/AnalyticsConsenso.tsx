"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsenso } from "@/lib/consent";

/**
 * Vercel Analytics viene montato solo se l'utente ha accettato la categoria
 * "Statistiche" nel consenso cookie.
 */
export default function AnalyticsConsenso() {
  const { preferenze } = useConsenso();
  if (!preferenze?.statistiche) return null;
  return <Analytics />;
}
