import axios from "axios";
import * as cheerio from "cheerio";

type Source = {
  name: string;
  type: "file" | "iframe";
  url: string;
};

export async function getStream(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const sources: Source[] = [];

    // 🔥 1. FIND IFRAME SOURCES (MyFlixBD style)
    $("iframe").each((i, el) => {
      const src = $(el).attr("src");
      if (src && src.startsWith("http")) {
        sources.push({
          name: `Server ${sources.length + 1}`,
          type: "iframe",
          url: src,
        });
      }
    });

    // 🔥 2. FIND JWPLAYER FILES (VERY IMPORTANT)
    const scripts = $("script").map((_, el) => $(el).html()).get();

    for (const script of scripts) {
      if (!script) continue;

      // match file:"https://..."
      const match = script.match(/file:\s*"(https[^"]+)"/);

      if (match && match[1]) {
        sources.push({
          name: `Server ${sources.length + 1}`,
          type: "file",
          url: match[1],
        });
      }

      // match sources: [{file:"..."}]
      const m3u8 = script.match(/"(https[^"]+\.m3u8[^"]*)"/);
      if (m3u8 && m3u8[1]) {
        sources.push({
          name: `Server ${sources.length + 1}`,
          type: "file",
          url: m3u8[1],
        });
      }
    }

    // 🔥 3. CLEAN DUPLICATES
    const unique = Array.from(
      new Map(sources.map((s) => [s.url, s])).values()
    );

    return {
      success: true,
      sources: unique,
    };
  } catch (err) {
    console.error("STREAM ERROR:", err);

    return {
      success: false,
      sources: [],
    };
  }
}
