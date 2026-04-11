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

    // Find iframe
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+)"/);

    if (!iframeMatch) {
      return NextResponse.json({ error: "No iframe found" });
    }

    let iframe = iframeMatch[1];

    if (!iframe.startsWith("http")) {
      iframe = new URL(iframe, target).href;
    }

    return NextResponse.json({
      source: iframe,
    });

  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" });
  }
}
