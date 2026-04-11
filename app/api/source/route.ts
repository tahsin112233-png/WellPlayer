import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: false });
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const $ = cheerio.load(data);

    const sources: any[] = [];

    // 🔥 extract all server links
    $("a").each((_, el) => {
      const link = $(el).attr("href");

      if (
        link &&
        (link.includes("hubcloud") ||
          link.includes("pixeldrain") ||
          link.includes("stream") ||
          link.includes("drive"))
      ) {
        sources.push({
          type: "iframe",
          url: link,
          name: "Server",
        });
      }
    });

    // ✅ remove duplicates
    const unique = Array.from(
      new Map(sources.map((s) => [s.url, s])).values()
    );

    return NextResponse.json({
      success: true,
      sources: unique,
    });
  } catch (e) {
    console.log("SOURCE ERROR:", e);

    return NextResponse.json({
      success: false,
      sources: [],
    });
  }
}
