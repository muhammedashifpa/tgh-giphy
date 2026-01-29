import { NextRequest, NextResponse } from "next/server";
import { giphyService } from "@/services/giphyService";
import { normalizeGif } from "@/lib/gifUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const gif = await giphyService.getGifById(id);

    // Normalize data for the client
    const normalizedGif = normalizeGif(gif);

    return NextResponse.json(normalizedGif, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error(`API Error for GIF ${id}:`, error);
    return NextResponse.json({ error: "Failed to fetch GIF" }, { status: 500 });
  }
}
