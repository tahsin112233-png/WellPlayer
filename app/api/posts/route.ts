import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// 🔥 MULTI DOMAIN SUPPORT (auto fallback)
const DOMAINS = [
  "https://new2.moviesdrives.my",
  "https://moviesdrives.my",
  "https://moviesdrive.net",
];

export async function GET() {
  for (const domain of DOMAINS) {
    try {
      const { data } = await axios.get(domain, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(data);
      const posts: any[] = [];

      $(".post, article, .item").each((_, el) => {
        const title =
          $(el).find("h2").text() ||
          $(el).find("img").attr("alt");

        const link = $(el).find("a").attr("href");

        const image =
          $(el).find("img").attr("src") ||
          $(el).find("img").attr("data-src");

        if (title && link) {
          posts.push({
            title: title.trim(),
            link,
            image:
              image ||
              "https://via.placeholder.com/300x450?text=No+Image",
          });
        }
      });

      if (posts.length > 0) {
        return NextResponse.json({
          success: true,
          posts,
          source: domain, // 🔥 debug (see which domain worked)
        });
      }
    } catch (err) {
      console.log("Domain failed:", domain);
    }
  }

  // 🔥 FINAL FALLBACK (never blank UI)
  return NextResponse.json({
    success: true,
    posts: getFallback(),
    source: "fallback",
  });
}

// 🔥 Backup content
function getFallback() {
  return [
    {
      title: "Avengers Endgame",
      link: "https://new2.moviesdrives.my/",
      image:
        "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    },
    {
      title: "John Wick",
      link: "https://new2.moviesdrives.my/",
      image:
        "https://image.tmdb.org/t/p/w500/r17jFHAemzcWPPtoO0UxjIX0xas.jpg",
    },
  ];
}
