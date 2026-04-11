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

    // Try m3u8
    const m3u8 = html.match(/https?:\/\/[^"]+\.m3u8/);

    if (m3u8) {
      return NextResponse.json({
        stream: m3u8[0],
        type: "hls",
      });
    }

    // Try mp4
    const mp4 = html.match(/https?:\/\/[^"]+\.mp4/);

    if (mp4) {
      return NextResponse.json({
        stream: mp4[0],
        type: "mp4",
      });
    }

    return NextResponse.json({ error: "No stream found" });

  } catch (err) {
    return NextResponse.json({ error: "Failed to extract" });
  }
}
