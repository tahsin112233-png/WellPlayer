import axios from "axios";
import * as cheerio from "cheerio";

export async function getMoviesDrive(url: string) {
  try {
    const sources: any[] = [];

    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(res.data);

    // 🔥 find all download/watch links
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";

      if (
        href.includes("hubcloud") ||
        href.includes("drive") ||
        href.includes("video")
      ) {
        sources.push({
          type: "iframe",
          url: href,
          name: "MoviesDrive",
        });
      }
    });

    return sources;
  } catch (e) {
    return [];
  }
}
