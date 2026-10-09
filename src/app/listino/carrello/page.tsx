import type { Metadata } from "next";
import CarrelloMain from "@/components/pages/CarrelloMain";
import { getMenu } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Carrello",
  description:
    "Il tuo carrello Maeli Pizza: controlla le pizze, le quantità e scegli come ordinare per stasera, con prenotazione rapida via WhatsApp o chiamata diretta.",
};

export const revalidate = 60;

export default async function CarrelloPage() {
  const menu = await getMenu();
  return <CarrelloMain menu={menu} />;
}
