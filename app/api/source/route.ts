import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL" }, { status: 400 });
  }

  try {
    // Step 1: fetch watch page
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    });

    const html = await res.text();

    // Step 2: extract play.movielinkbd.mom link
    const match = html.match(
      /https:\/\/play\.movielinkbd\.mom\/watch\/[^\s"'<>]+/
    );

    if (!match) {
      return NextResponse.json({ error: "No stream found" });
    }

    const streamUrl = match[0];

    return NextResponse.json({
      sources: [
        {
          url: streamUrl,
          type: "mp4",
        },
      ],
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed" });
  }
}
