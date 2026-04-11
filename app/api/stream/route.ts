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

    // 🔥 FIXED: no matchAll
    const regex = /<iframe[^>]+src="([^"]+)"/g;
    const sources: string[] = [];

    let match;

    while ((match = regex.exec(html)) !== null) {
      let link = match[1];

      if (!link.startsWith("http")) {
        link = new URL(link, target).href;
      }

      sources.push(link);
    }

    if (!sources.length) {
      return NextResponse.json({ error: "No iframe found" });
    }

    return NextResponse.json({
      sources,
    });

  } catch (err) {
    return NextResponse.json({ error: "Failed" });
  }
}
