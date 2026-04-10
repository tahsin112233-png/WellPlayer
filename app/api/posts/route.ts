import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get("https://myflixbd.to/");

    const $ = cheerio.load(data);
    const posts: any[] = [];

    $(".movie").each((_, el) => {
      const title = $(el).find("img").attr("alt");
      const link = $(el).find("a").attr("href");
      const image = $(el).find("img").attr("src");

      if (title && link) {
        posts.push({ title, link, image });
      }
    });

    return NextResponse.json({ success: true, posts });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}
