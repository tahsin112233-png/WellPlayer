import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL" });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    const html = await res.text();

    // STEP 1: get ALL iframes
    const iframeMatches = html.match(/<iframe[^>]+src="([^"]+)"/g) || [];

    let realIframe = null;

    for (const tag of iframeMatches) {
      const srcMatch = tag.match(/src="([^"]+)"/);
      const src = srcMatch?.[1];

      if (!src) continue;

      // ❌ skip promo/tutorial
      if (
        src.includes("upload") ||
        src.includes(".mp4") ||
        src.includes("download")
      ) {
        continue;
      }

      // ✅ pick real embed
      realIframe = src;
      break;
    }

    if (!realIframe) {
      return NextResponse.json({ error: "No real iframe found" });
    }

    return NextResponse.json({ iframe: realIframe });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch source" });
  }
}
