import { useEffect, useState } from "react";

export interface OpeningStatus {

  isOpen: boolean;

  isOpenToday: boolean;

  badgeText: "APERTO" | "CHIUSO";

  headline: string | null;

  subline: string;
}

const GIORNI_APERTURA = ["Wed", "Thu", "Fri", "Sat", "Sun"];

const ORA_TAGLIO_WHATSAPP = 17 * 60 + 30;

function getDateInfo(targetDate: Date): {
  weekday: string;
  hour: number;
  minute: number;
} {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(targetDate);
  let weekday = "";
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === "weekday") weekday = part.value;
    if (part.type === "hour") hour = parseInt(part.value, 10);
    if (part.type === "minute") minute = parseInt(part.value, 10);
  }

  return { weekday, hour, minute };
}

export function getOpeningStatus(targetDate: Date = new Date()): OpeningStatus {
  const { weekday, hour, minute } = getDateInfo(targetDate);

  const isOpenToday = GIORNI_APERTURA.includes(weekday);

  const currentMinutes = hour * 60 + minute;
  const openMinutes = 18 * 60 + 30; 
  const closeMinutes = 21 * 60 + 30; 

  const isOpen = isOpenToday && currentMinutes >= openMinutes && currentMinutes <= closeMinutes;

  if (isOpen) {
    return {
      isOpen: true,
      isOpenToday: true,
      badgeText: "APERTO",
      headline: null,
      subline: "• Solo asporto, consigliata la prenotazione telefonica",
    };
  }

  return {
    isOpen: false,
    isOpenToday,
    badgeText: "CHIUSO",
    headline: isOpenToday ? "OGGI APERTI 18:30 - 21:30" : "OGGI CHIUSO",
    subline: "• Solo asporto, consigliata la prenotazione telefonica",
  };
}

export function useOpeningStatus(): OpeningStatus {
  const [status, setStatus] = useState<OpeningStatus>(getOpeningStatus);

  useEffect(() => {
    const update = () => setStatus(getOpeningStatus());
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

export function isWhatsAppAttivo(targetDate: Date = new Date()): boolean {
  const { weekday, hour, minute } = getDateInfo(targetDate);
  if (!GIORNI_APERTURA.includes(weekday)) return false;
  return hour * 60 + minute < ORA_TAGLIO_WHATSAPP;
}

export function useWhatsAppAttivo(): boolean {
  const [attivo, setAttivo] = useState<boolean>(() => isWhatsAppAttivo());

  useEffect(() => {
    const update = () => setAttivo(isWhatsAppAttivo());
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return attivo;
}
