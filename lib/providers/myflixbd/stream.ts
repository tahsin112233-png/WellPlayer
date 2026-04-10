import axios from "axios";
import * as cheerio from "cheerio";

type Source = {
  name: string;
  type: "file" | "iframe";
  url: string;
};

export async function getStream(url: string) {
  try {
    const sources: Source[] = [];

    // 🔥 STEP 1 — Load movie page
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);

    // 🔥 STEP 2 — FIND WATCH PAGE LINK
    let watchUrl = "";

    $("a").each((_, el) => {
      const href = $(el).attr("href");

      if (href && href.includes("/watch/")) {
        watchUrl = href.startsWith("http")
          ? href
          : `https://myflixbd.to${href}`;
      }
    });

    if (!watchUrl) {
      return { success: false, sources: [] };
    }

    // 🔥 STEP 3 — Load watch page
    const res = await axios.get(watchUrl);
    const $$ = cheerio.load(res.data);

    // 🔥 STEP 4 — Extract iframe
    $$("iframe").each((_, el) => {
      const src = $$(el).attr("src");

      if (src && src.startsWith("http")) {
        sources.push({
          name: `Server ${sources.length + 1}`,
          type: "iframe",
          url: src,
        });
      }
    });

    // 🔥 STEP 5 — Extract m3u8 from scripts
    const scripts = $$("script").map((_, el) => $$(el).html()).get();

    for (const script of scripts) {
      if (!script) continue;

      const m3u8 = script.match(/(https[^"]+\.m3u8[^"]*)/);
      if (m3u8) {
        sources.push({
          name: `Server ${sources.length + 1}`,
          type: "file",
          url: m3u8[1],
        });
      }
    }

    return {
      success: true,
      sources,
    };
  } catch (err) {
    return {
      success: false,
      sources: [],
    };
  }
}
