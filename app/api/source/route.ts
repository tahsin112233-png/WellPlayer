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
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const sources: any[] = [];

    $("a").each((_, el) => {
      const text = $(el).text();
      const href = $(el).attr("href");

      if (
        href &&
        (text.includes("1080") ||
          text.includes("720") ||
          text.includes("480"))
      ) {
        sources.push({
          quality: text,
          url: href,
        });
      }
    });

    return NextResponse.json({ success: true, sources });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}
