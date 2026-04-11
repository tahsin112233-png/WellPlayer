import axios from "axios";
import * as cheerio from "cheerio";

export async function getMoviesDrive(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);
    const sources: any[] = [];

    let count = 1;

    $("a").each((_, el) => {
      const href = $(el).attr("href");

      if (!href) return;

      if (
        href.includes("hubcloud") ||
        href.includes("gdflix") ||
        href.includes("drive") ||
        href.includes("player")
      ) {
        sources.push({
          type: "iframe",
          url: href,
          name: `Server ${count++}`,
        });
      }
    });

    return {
      success: true,
      sources,
    };
  } catch {
    return {
      success: false,
      sources: [],
    };
  }
}
