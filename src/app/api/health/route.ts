

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return Response.json(
      {
        ok: false,
        step: "env",
        message: "Variabili NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY mancanti in .env",
      },
      { status: 500 },
    );
  }

  try {

    const res = await fetch(`${url}/auth/v1/health`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: "no-store",
    });

    return Response.json(
      res.ok
        ? {
            ok: true,
            step: "supabase",
            message: "Connesso a Supabase ✔ URL e chiave anon validi",
          }
        : {
            ok: false,
            step: "supabase",
            status: res.status,
            message: "Supabase ha risposto con errore: chiave o URL errati",
          },
      { status: res.ok ? 200 : 502 },
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        step: "network",
        message: "Impossibile raggiungere Supabase",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}
