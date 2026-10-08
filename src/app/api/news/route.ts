import { NextRequest, NextResponse } from "next/server";
import { getNewsPage, NEWS_PAGE_SIZE } from "@/lib/news";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const rawOffset = Number.parseInt(params.get("offset") ?? "0", 10);
  const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;
  const labelId = params.get("labelId");

  const page = await getNewsPage(offset, labelId);

  return NextResponse.json(page, {
    headers: {
      "Cache-Control": "no-store",
      "X-Page-Size": String(NEWS_PAGE_SIZE),
    },
  });
}
