import { NextRequest, NextResponse } from "next/server";
import { giphyService } from "@/services/giphyService";
import { normalizeGifs } from "@/lib/gifUtils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const data = q 
      ? await giphyService.searchGifs(q, limit, offset)
      : await giphyService.getTrendingGifs(limit, offset);

    // Normalize data for the client
    const gifs = normalizeGifs(data);

    return NextResponse.json(gifs, {
      headers: {
        "Cache-Control": "no-store, max-age=0", // Pagination should not be cached permanently
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch GIFs" }, { status: 500 });
  }
}
