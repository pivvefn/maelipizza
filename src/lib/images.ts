const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pages_images`;

export const images = {
  logo: `${BASE}/logo-maeli-pizza.png`,
  homeHero: `${BASE}/home/home-hero.jpg`,
  homeMartinoElisa: `${BASE}/home/home-martino-elisa.jpg`,
  sliderFallback: `${BASE}/home/novita-nuova-pizza.jpg`,
  novitaHero: `${BASE}/novita/home-hero.jpg`,
  listinoHero: `${BASE}/listino/listino-hero-banco.jpg`,
  chiSiamoForno: `${BASE}/chi-siamo/chi-siamo-forno-a-legna.jpg`,
  chiSiamoStesa: `${BASE}/chi-siamo/chi-siamo-stesa-impasto.jpg`,
  chiSiamoCassette: `${BASE}/chi-siamo/chi-siamo-cassette-impasto.jpg`,
  chiSiamoIngredienti: `${BASE}/chi-siamo/chi-siamo-ingredienti.jpg`,
  chiSiamoConsegna: `${BASE}/chi-siamo/chi-siamo-consegna-asporto.jpg`,
};
