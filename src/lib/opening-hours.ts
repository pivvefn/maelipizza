import { useEffect, useState } from "react";

export interface OpeningStatus {

  isOpen: boolean;

  isOpenToday: boolean;

  badgeText: "APERTO" | "CHIUSO";

  headline: string | null;

  subline: string;
}

export function getOpeningStatus(targetDate: Date = new Date()): OpeningStatus {
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

  const openDays = ["Wed", "Thu", "Fri", "Sat", "Sun"];
  const isOpenToday = openDays.includes(weekday);

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
