import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();

    // ✅ Extract iframe ONLY (ignore promo video)
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/i);

    if (!iframeMatch) {
      return NextResponse.json({ error: "No iframe found" });
    }

    let iframeUrl = iframeMatch[1];

    // Fix protocol
    if (iframeUrl.startsWith("//")) {
      iframeUrl = "https:" + iframeUrl;
    }

    return NextResponse.json({
      iframe: iframeUrl,
    });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch source" });
  }
}
