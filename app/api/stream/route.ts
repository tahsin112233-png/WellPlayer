import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const iframe = searchParams.get("iframe");

  if (!iframe) {
    return NextResponse.json({ error: "No iframe" });
  }

  try {
    const res = await fetch(iframe, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": iframe,
      },
    });

    const html = await res.text();

    // 🔥 1. m3u8 (best case)
    const m3u8 = html.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/);
    if (m3u8) {
      return NextResponse.json({
        stream: m3u8[0],
        type: "hls",
      });
    }

    // 🔥 2. mp4 fallback
    const mp4 = html.match(/https?:\/\/[^"' ]+\.mp4[^"' ]*/);
    if (mp4) {
      return NextResponse.json({
        stream: mp4[0],
        type: "mp4",
      });
    }

    // 🔥 3. file:"..." pattern (common in players)
    const fileMatch = html.match(/file:\s*["']([^"']+)["']/);
    if (fileMatch) {
      return NextResponse.json({
        stream: fileMatch[1],
        type: "hls",
      });
    }

    // 🔥 4. source src="..."
    const sourceMatch = html.match(/<source[^>]+src=["']([^"']+)["']/);
    if (sourceMatch) {
      return NextResponse.json({
        stream: sourceMatch[1],
        type: "mp4",
      });
    }

    // ❌ nothing found
    return NextResponse.json({
      error: "No stream found",
      debug: html.slice(0, 500), // helps debugging
    });

  } catch (err) {
    return NextResponse.json({ error: "Failed to extract" });
  }
}
