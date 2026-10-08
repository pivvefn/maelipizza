import { createAdminClient } from "@/lib/supabase/admin";

export type Pizza = {
  nome: string;
  prezzo: number;

  ingredienti: string;
  isFeatured: boolean;
  nota: string | null;

  allergeni: number[];
};

export type MenuSection = {
  slug: string;
  nome: string;
  pizzas: Pizza[];

  isNovita: boolean;

  descrizione: string | null;
};

export type Impasto = { nome: string; prezzo: number };

export type Formato = {

  sigla: string;

  nome: string;

  descrizione: string | null;

  prezzo: number;
};

export type AllergeneLegenda = {
  id: number;
  nome: string;
  descrizione: string | null;
};

export type ExtraVoce = { nome: string; prezzo: number };

export type MenuData = {
  sections: MenuSection[];
  impasti: Impasto[];

  formatoBaby: number | null;

  formati: Formato[];

  legendaAllergeni: AllergeneLegenda[];

  teglie: Teglia[];

  extra: ExtraVoce[];
};

export type TegliaVoce = { nome: string; prezzo: number };

export type Teglia = {
  nome: string;
  badge: string;
  voci: TegliaVoce[];
};

type DbIngredient = {
  nome: string;
  is_allergene: boolean | null;
  allergeni_ids: number[] | null;
};
type DbLink = { ingredients: DbIngredient | null };
type DbItem = {
  nome: string;
  prezzo_base: number;
  is_featured: boolean | null;
  note_extra: string | null;

  image_url?: string | null;
  pizza_ingredients: DbLink[] | null;
};
type DbCategory = {
  nome: string;
  ordine_visualizzazione: number;
  description: string | null;

  is_active?: boolean | null;

  is_new?: boolean | null;
  menu_items: DbItem[] | null;
};
type DbDough = { nome: string; variazione_prezzo: number; is_active: boolean | null };
type DbSize = { nome: string; variazione_prezzo: number; is_active: boolean | null };
type DbAllergene = { id: number; nome: string; descrizione: string | null };
type DbExtra = {
  nome: string;
  prezzo: number;
  ordine_visualizzazione?: number | null;
};

export function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .replace(/^pizze\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isTegliaCategory(nome: string): boolean {
  return nome.toLowerCase().includes("teglie");
}

export function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

function sortIngredients(nomi: string[]): string[] {
  const rank = (n: string) => (n === "salsa" ? 1 : n === "mozzarella" ? 2 : 3);
  return [...nomi].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, "it"));
}

function formatIngredienti(nomi: string[]): string {
  const testo = sortIngredients(nomi).join(", ");
  return testo.charAt(0).toUpperCase() + testo.slice(1);
}

function collectAllergeni(links: DbLink[]): number[] {
  const ids = new Set<number>();
  for (const link of links) {
    const ing = link?.ingredients;
    if (!ing?.is_allergene) continue;
    for (const id of ing.allergeni_ids ?? []) {
      const n = Number(id);
      if (Number.isFinite(n)) ids.add(n);
    }
  }
  return [...ids].sort((a, b) => a - b);
}

export async function getMenu(): Promise<MenuData> {
  const supabase = createAdminClient();

  const [cats, doughs, sizes, allergeni] = await Promise.all([
    supabase
      .from("menu_categories")
      .select(
        "nome, ordine_visualizzazione, description, is_active, is_new, menu_items(nome, prezzo_base, is_featured, note_extra, pizza_ingredients(ingredients(nome, is_allergene, allergeni_ids)))",
      )
      .order("ordine_visualizzazione"),
    supabase.from("dough_types").select("nome, variazione_prezzo, is_active"),
    supabase.from("pizza_sizes").select("nome, variazione_prezzo, is_active"),
    supabase.from("allergeni").select("id, nome, descrizione").order("id"),
  ]);

  if (cats.error) {
    throw new Error("Impossibile caricare il menu: " + cats.error.message);
  }

  const categories = ((cats.data ?? []) as unknown as DbCategory[]).sort(
    (a, b) =>
      Number(a.ordine_visualizzazione ?? Number.MAX_SAFE_INTEGER) -
      Number(b.ordine_visualizzazione ?? Number.MAX_SAFE_INTEGER),
  );

  const attive = categories.filter((category) => category.is_active !== false);

  const sections: MenuSection[] = attive

    .filter((category) => !isTegliaCategory(category.nome))
    .map((category) => {
    const items = [...(category.menu_items ?? [])].sort((a, b) =>
      a.nome.localeCompare(b.nome, "it"),
    );
    return {
      slug: slugify(category.nome),
      nome: category.nome,
      isNovita: category.is_new === true,
      descrizione: category.description ?? null,
      pizzas: items.map((item) => ({
        nome: item.nome,
        prezzo: Number(item.prezzo_base),
        ingredienti: formatIngredienti(
          (item.pizza_ingredients ?? [])
            .map((link) => link?.ingredients?.nome)
            .filter((nome): nome is string => Boolean(nome)),
        ),
        isFeatured: Boolean(item.is_featured),
        nota: item.note_extra ?? null,
        allergeni: collectAllergeni(item.pizza_ingredients ?? []),
      })),
    };
  });

  const sectionsOrdinate: MenuSection[] = [
    ...sections.filter((s) => s.isNovita),
    ...sections.filter((s) => !s.isNovita),
  ];

  const impasti = ((doughs.data ?? []) as unknown as DbDough[])
    .filter((d) => d.is_active !== false && Number(d.variazione_prezzo) > 0)
    .map((d) => ({ nome: d.nome, prezzo: Number(d.variazione_prezzo) }))
    .sort((a, b) => a.prezzo - b.prezzo || a.nome.localeCompare(b.nome, "it"));

  const sizesList = (sizes.data ?? []) as unknown as DbSize[];
  const baby = sizesList.find(
    (s) => s.is_active !== false && s.nome.toLowerCase() === "baby",
  );

  const formati: Formato[] = [];
  for (const category of attive) {
    if ((category.menu_items ?? []).length > 0) continue;
    const nomeLower = category.nome.toLowerCase();
    const size = sizesList.find(
      (s) => s.is_active !== false && nomeLower.includes(s.nome.toLowerCase()),
    );
    if (!size) continue;
    const prezzo = Number(size.variazione_prezzo);
    if (!Number.isFinite(prezzo)) continue;
    formati.push({
      sigla: size.nome.toLowerCase(),
      nome: category.nome,
      descrizione: category.description ?? null,
      prezzo,
    });
  }

  const idsAllergeniInUso = new Set(
    sections.flatMap((sezione) => sezione.pizzas.flatMap((p) => p.allergeni)),
  );
  let legendaAllergeni: AllergeneLegenda[] = [];
  if (allergeni.error) {
    console.warn("getMenu: legenda allergeni non disponibile:", allergeni.error.message);
  } else {
    legendaAllergeni = ((allergeni.data ?? []) as unknown as DbAllergene[])
      .map((a) => ({ id: Number(a.id), nome: a.nome, descrizione: a.descrizione ?? null }))
      .filter((a) => idsAllergeniInUso.has(a.id))
      .sort((a, b) => a.id - b.id);
  }

  const teglie: Teglia[] = attive
    .filter((category) => isTegliaCategory(category.nome))
    .map((category) => ({
      nome: category.nome,
      badge: category.description ?? "",
      voci: [...(category.menu_items ?? [])]
        .map((item) => ({ nome: item.nome, prezzo: Number(item.prezzo_base) }))
        .sort((a, b) => a.prezzo - b.prezzo),
    }));

  let extraRows: DbExtra[] | null = null;
  const conOrdine = await supabase
    .from("categorie_extra")
    .select("nome, prezzo, ordine_visualizzazione")
    .order("ordine_visualizzazione");
  if (!conOrdine.error) {
    extraRows = conOrdine.data as unknown as DbExtra[];
  } else {
    const senzaOrdine = await supabase.from("categorie_extra").select("nome, prezzo");
    if (!senzaOrdine.error) {
      extraRows = senzaOrdine.data as unknown as DbExtra[];
    } else {
      console.warn("getMenu: aggiunte/extra non disponibili:", senzaOrdine.error.message);
    }
  }
  const extra: ExtraVoce[] = (extraRows ?? [])
    .slice()
    .sort(
      (a, b) =>
        Number(a.ordine_visualizzazione ?? Number.MAX_SAFE_INTEGER) -
        Number(b.ordine_visualizzazione ?? Number.MAX_SAFE_INTEGER),
    )
    .map((e) => ({ nome: e.nome, prezzo: Number(e.prezzo) }));

  return {
    sections: sectionsOrdinate,
    impasti,
    formatoBaby: baby ? Number(baby.variazione_prezzo) : null,
    formati,
    legendaAllergeni,
    teglie,
    extra,
  };
}

export type FeaturedPizza = {
  nome: string;
  prezzo: number;
  ingredienti: string;
  categoria: string;
  nota: string | null;

  imageUrl: string | null;
};

export async function getFeaturedPizzas(): Promise<FeaturedPizza[]> {
  try {
    const supabase = createAdminClient();
    const { data: categories, error } = await supabase
      .from("menu_categories")
      .select(
        "nome, ordine_visualizzazione, menu_items(nome, prezzo_base, is_featured, note_extra, image_url, pizza_ingredients(ingredients(nome)))",
      )
      .order("ordine_visualizzazione", { ascending: true });

    if (!error && categories) {
      const cats = categories as unknown as DbCategory[];
      const featured: FeaturedPizza[] = [];
      for (const cat of cats) {
        const items = (cat.menu_items ?? [])
          .filter((item: DbItem) => Boolean(item.is_featured))
          .sort((a: DbItem, b: DbItem) => a.nome.localeCompare(b.nome, "it"));

        for (const item of items) {
          const ingredientNames = (item.pizza_ingredients ?? [])
            .map((link: DbLink) => link?.ingredients?.nome)
            .filter((n): n is string => Boolean(n));

          featured.push({
            nome: item.nome,
            prezzo: Number(item.prezzo_base),
            ingredienti: formatIngredienti(ingredientNames),
            categoria: cat.nome,
            nota: item.note_extra ?? null,
            imageUrl: item.image_url || null,
          });
        }
      }

      if (featured.length > 0) {
        return featured;
      }
    }
  } catch (error) {
    console.warn("getFeaturedPizzas: caricamento da Supabase fallito o vuoto, uso fallback.", error);
  }

  return [
    {
      nome: "Pippo",
      prezzo: 8.5,
      ingredienti: "Salsa, mozzarella, patatine fritte, wurstel",
      categoria: "Pizze Gustose",
      nota: null,
      imageUrl: null,
    },
    {
      nome: "Biancaneve",
      prezzo: 7.0,
      ingredienti: "Mozzarella, panna, prosciutto cotto",
      categoria: "Pizze Bianche",
      nota: null,
      imageUrl: null,
    },
    {
      nome: "Calzone Vegetariano",
      prezzo: 8.5,
      ingredienti: "Salsa, mozzarella, melanzane, zucchine, peperoni",
      categoria: "Calzoni",
      nota: null,
      imageUrl: null,
    },
    {
      nome: "Formaggi",
      prezzo: 8.0,
      ingredienti: "Salsa, mozzarella, gorgonzola, edamer, grana",
      categoria: "Pizze Classiche",
      nota: null,
      imageUrl: null,
    },
  ];
}

