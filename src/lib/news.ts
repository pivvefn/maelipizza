import { createAdminClient } from "@/lib/supabase/admin";

export const NEWS_PAGE_SIZE = 10;

export type NewsLabel = { id: string; nome: string };

export type NewsArticle = {
  id: string;
  titolo: string;

  contenuto: string | null;

  imageUrl: string | null;

  imageLabel: string | null;
  isFeatured: boolean;

  publishedAt: string;
  labelId: string | null;

  labelNome: string | null;
};

export type NewsPage = {
  articles: NewsArticle[];
  hasMore: boolean;
};

async function getNewsLabelsMap(): Promise<Map<string, string>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("news_labels")
    .select("id, nome");
  if (error) throw new Error(error.message);
  return new Map((data ?? []).map((l) => [l.id, l.nome]));
}

export async function getNewsLabels(): Promise<NewsLabel[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("news_labels")
      .select("id, nome")
      .order("nome", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as NewsLabel[];
  } catch (error) {
    console.warn("getNewsLabels: caricamento da Supabase fallito.", error);
    return [];
  }
}

function formattaContenuto(testo: string | null): string | null {
  if (!testo) return testo;
  return testo.replace(/\r\n?|\\n|\n/g, "<br>");
}

export async function getNewsPage(
  offset = 0,
  labelId?: string | null,
): Promise<NewsPage> {
  const safeOffset = Number.isFinite(offset)
    ? Math.max(0, Math.floor(offset))
    : 0;

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("news")
      .select(
        "id, titolo, contenuto, image_url, image_label, is_featured, published_at, label_id",
      )
      .eq("is_active", true)

      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false })

      .range(safeOffset, safeOffset + NEWS_PAGE_SIZE);

    if (labelId) {
      query = query.eq("label_id", labelId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const hasMore = rows.length > NEWS_PAGE_SIZE;

    const labels = await getNewsLabelsMap();
    const articles: NewsArticle[] = rows.slice(0, NEWS_PAGE_SIZE).map((row) => ({
      id: row.id,
      titolo: row.titolo,
      contenuto: formattaContenuto(row.contenuto),
      imageUrl: row.image_url ?? null,
      imageLabel: row.image_label ?? null,
      isFeatured: Boolean(row.is_featured),
      publishedAt: row.published_at ?? "",
      labelId: row.label_id ?? null,
      labelNome: row.label_id ? labels.get(row.label_id) ?? null : null,
    }));

    return { articles, hasMore };
  } catch (error) {
    console.warn("getNewsPage: caricamento da Supabase fallito.", error);
    return { articles: [], hasMore: false };
  }
}
