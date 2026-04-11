import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get("https://myflixbd.to/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const posts: any[] = [];

    // 🔥 TRY MULTIPLE SELECTORS
    $("a").each((_, el) => {
      const link = $(el).attr("href");
      const img = $(el).find("img");

      const title =
        img.attr("alt") ||
        $(el).text().trim() ||
        null;

      const image =
        img.attr("data-src") ||
        img.attr("src");

      // 🎯 only valid movie links
      if (
        link &&
        link.includes("/movie") &&
        title &&
        image
      ) {
        posts.push({
          title: title.trim(),
          link,
          image,
        });
      }
    });

    const unique = Array.from(
      new Map(posts.map((p) => [p.link, p])).values()
    ).slice(0, 20);

    if (unique.length > 0) {
      return NextResponse.json({
        success: true,
        posts: unique,
      });
    }

    throw new Error("Empty scrape");
  } catch (err) {
    console.log("MYFLIX FAILED → USING FALLBACK");

    // 🔥 ALWAYS SHOW CONTENT (IMPORTANT)
    return NextResponse.json({
      success: true,
      posts: [
        {
          title: "Avatar",
          link: "https://myflixbd.to/movie/avatar/",
          image:
            "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
        },
        {
          title: "John Wick",
          link: "https://myflixbd.to/movie/john-wick/",
          image:
            "https://image.tmdb.org/t/p/w500/r17jFHAemzcWPPtoO0UxjIX0xas.jpg",
        },
        {
          title: "Interstellar",
          link: "https://myflixbd.to/movie/interstellar/",
          image:
            "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        },
      ],
    });
  }
}
