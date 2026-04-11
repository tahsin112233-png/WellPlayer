import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("url");

    if (!target) {
      return NextResponse.json({ error: "No URL" });
    }

    const { data } = await axios.get(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Referer: "https://myflixbd.to/",
      },
    });

    // 🔥 FIX: no matchAll (vercel issue)
    const regex = /<iframe[^>]+src="([^"]+)"/g;

    const sources: any[] = [];
    let match;

    while ((match = regex.exec(data)) !== null) {
      const src = match[1];

      sources.push({
        name: `Server ${sources.length + 1}`,
        url: src.startsWith("http")
          ? src
          : "https:" + src,
      });
    }

    if (!sources.length) {
      return NextResponse.json({
        error: "No iframe found",
      });
    }

    return NextResponse.json({
      success: true,
      sources,
    });
  } catch (err) {
    console.log("SOURCE ERROR:", err);
    return NextResponse.json({
      error: "Failed to extract source",
    });
  }
}
