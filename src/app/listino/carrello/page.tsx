import type { Metadata } from "next";
import CarrelloMain from "@/components/pages/CarrelloMain";

export const metadata: Metadata = {
  title: "Carrello",
  description:
    "Il tuo carrello Maeli Pizza: controlla le pizze, le quantità e scegli come ordinare per stasera, con prenotazione rapida via WhatsApp o chiamata diretta.",
};

export default function CarrelloPage() {
  return <CarrelloMain />;
}
