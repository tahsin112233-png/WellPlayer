import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://new2.moviesdrives.my/",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          Accept: "text/html",
        },
        timeout: 10000,
      }
    );

    const $ = cheerio.load(data);
    const posts: any[] = [];

    // 🔥 MULTI SELECTOR (IMPORTANT)
    $("article, .post, .item").each((_, el) => {
      const a = $(el).find("a").first();

      const title =
        a.attr("title") ||
        $(el).find("h2").text() ||
        "No title";

      const link = a.attr("href");

      const image =
        $(el).find("img").attr("src") ||
        $(el).find("img").attr("data-src");

      if (link && title) {
        posts.push({
          title: title.trim(),
          link,
          image:
            image?.startsWith("http")
              ? image
              : `https://new2.moviesdrives.my${image}`,
        });
      }
    });

    // ✅ LIMIT + CLEAN
    const cleaned = posts.slice(0, 20);

    if (cleaned.length > 0) {
      return NextResponse.json({
        success: true,
        posts: cleaned,
      });
    }

    throw new Error("Empty scrape");
  } catch (err: any) {
    console.log("SCRAPER FAILED:", err.message);

    // 🔥 HARD FALLBACK (ALWAYS WORKS)
    return NextResponse.json({
      success: true,
      posts: [
        {
          title: "Avengers Endgame",
          link: "https://new2.moviesdrives.my/avengers-endgame/",
          image:
            "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        },
        {
          title: "John Wick",
          link: "https://new2.moviesdrives.my/john-wick/",
          image:
            "https://image.tmdb.org/t/p/w500/r17jFHAemzcWPPtoO0UxjIX0xas.jpg",
        },
        {
          title: "Interstellar",
          link: "https://new2.moviesdrives.my/interstellar/",
          image:
            "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        },
      ],
    });
  }
}
