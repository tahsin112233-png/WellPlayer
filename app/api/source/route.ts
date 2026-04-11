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
    });

    const html = await res.text();

    // ❌ REMOVE promo video (ignore direct mp4)
    if (html.includes("lv_0_")) {
      console.log("Skipping promo video");
    }

    // ✅ STEP 1: get iframe (real player)
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/);

    if (!iframeMatch) {
      return NextResponse.json({ error: "No player iframe found" });
    }

    let iframeUrl = iframeMatch[1];

    if (iframeUrl.startsWith("//")) {
      iframeUrl = "https:" + iframeUrl;
    }

    // ✅ STEP 2: fetch iframe page
    const iframeRes = await fetch(iframeUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: url,
      },
    });

    const iframeHtml = await iframeRes.text();

    // ✅ STEP 3: find real stream (m3u8 or mp4)
    const streamMatch =
      iframeHtml.match(/(https?:\/\/[^"]+\.m3u8)/) ||
      iframeHtml.match(/(https?:\/\/[^"]+\.mp4)/);

    if (!streamMatch) {
      return NextResponse.json({ error: "No stream found" });
    }

    return NextResponse.json({
      stream: streamMatch[1],
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to extract source" });
  }
}
