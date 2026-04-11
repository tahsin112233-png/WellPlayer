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

    // 🔥 Try multiple extraction patterns

    // 1. iframe
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/);
    if (iframeMatch) {
      return NextResponse.json({
        type: "iframe",
        source: iframeMatch[1],
      });
    }

    // 2. m3u8
    const m3u8Match = html.match(/https?:\/\/[^"]+\.m3u8/);
    if (m3u8Match) {
      return NextResponse.json({
        type: "video",
        source: m3u8Match[0],
      });
    }

    // 3. mp4
    const mp4Match = html.match(/https?:\/\/[^"]+\.mp4/);
    if (mp4Match) {
      return NextResponse.json({
        type: "video",
        source: mp4Match[0],
      });
    }

    return NextResponse.json({ error: "No source found" });

  } catch (e) {
    console.log("STREAM ERROR:", e);
    return NextResponse.json({ error: "Failed" });
  }
}
