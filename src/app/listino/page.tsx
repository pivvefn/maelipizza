import type { Metadata } from "next";
import ListinoMain from "@/components/pages/ListinoMain";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getMenu } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Listino",
  description:
    "Listino Maeli: Pizze Classiche, Gustose, Bianche e Calzoni con ingredienti e prezzi aggiornati, teglie, formati Baby e extra.",
};

export const revalidate = 600;

export default async function ListinoPage() {
  const menu = await getMenu();
  return (
    <>

      <RevealOnScroll />
      <ListinoMain menu={menu} />
    </>
  );
}
