import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get("https://myflixbd.to/", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const results: any[] = [];

    // 🔥 MULTI SELECTOR (IMPORTANT)
    $("article, .item, .movie, .ml-item").each((_, el) => {
      const title =
        $(el).find("h2").text() ||
        $(el).find("img").attr("alt") ||
        "No title";

      const link = $(el).find("a").attr("href");

      const image =
        $(el).find("img").attr("data-src") ||
        $(el).find("img").attr("src");

      if (title && link) {
        results.push({
          title: title.trim(),
          link,
          image,
        });
      }
    });

    // ✅ limit
    const posts = results.slice(0, 20);

    if (posts.length > 0) {
      return NextResponse.json({
        success: true,
        posts,
      });
    }

    throw new Error("Empty scrape");
  } catch (err) {
    console.log("MYFLIX SCRAPE FAILED");

    // 🔥 fallback
    return NextResponse.json({
      success: true,
      posts: [
        {
          title: "Latest Movie",
          link: "https://myflixbd.to/",
          image: "https://via.placeholder.com/300x450",
        },
      ],
    });
  }
}
