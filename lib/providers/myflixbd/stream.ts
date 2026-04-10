import axios from "axios";
import * as cheerio from "cheerio";

export async function getStream(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const sources: any[] = [];

    // ✅ 1. iframe
    $("iframe").each((_, el) => {
      const src = $(el).attr("src");
      if (src) {
        sources.push({
          type: "iframe",
          url: src,
          name: "iframe",
        });
      }
    });

    // ✅ 2. script scan (MP4 + M3U8)
    $("script").each((_, el) => {
      const text = $(el).html() || "";

      // 🔥 MP4 detection
      const mp4 = text.match(/https?:\/\/.*?\.mp4/g);
      if (mp4) {
        mp4.forEach((url) => {
          sources.push({
            type: "file",
            url,
            name: "mp4",
          });
        });
      }

      // 🔥 M3U8 detection
      const m3u8 = text.match(/https?:\/\/.*?\.m3u8/g);
      if (m3u8) {
        m3u8.forEach((url) => {
          sources.push({
            type: "file",
            url,
            name: "hls",
          });
        });
      }
    });

    return {
      success: true,
      sources,
    };
  } catch (e) {
    return {
      success: false,
      sources: [],
    };
  }
}
