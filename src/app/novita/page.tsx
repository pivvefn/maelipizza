import type { Metadata } from "next";
import NovitaMain from "@/components/pages/NovitaMain";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getNewsLabels, getNewsPage } from "@/lib/news";

export const metadata: Metadata = {
  title: "Novità di Bottega",
  description:
    "Tutte le novità di Maeli Pizza: orari speciali, aperture straordinarie, festività, impasti e nuove pizze del mese sfornate ogni sera a Campocroce.",
};

export const revalidate = 60;

export default async function NovitaPage() {
  const [labels, firstPage] = await Promise.all([
    getNewsLabels(),
    getNewsPage(0),
  ]);

  return (
    <>

      <RevealOnScroll />
      <NovitaMain
        labels={labels}
        initialArticles={firstPage.articles}
        initialHasMore={firstPage.hasMore}
      />
    </>
  );
}
