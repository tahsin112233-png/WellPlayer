import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "No URL" });
  }

  try {
    const res = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();

    // 🔥 get ALL iframes
    const matches = [...html.matchAll(/<iframe[^>]+src="([^"]+)"/g)];

    if (!matches.length) {
      return NextResponse.json({ error: "No iframe found" });
    }

    const sources = matches.map(m => {
      let link = m[1];
      if (!link.startsWith("http")) {
        link = new URL(link, target).href;
      }
      return link;
    });

    return NextResponse.json({
      sources, // multiple servers
    });

  } catch {
    return NextResponse.json({ error: "Failed" });
  }
}
