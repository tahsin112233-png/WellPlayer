import axios from "axios";
import * as cheerio from "cheerio";

// 🔥 Helper: follow redirects
async function resolveRedirect(url: string): Promise<string> {
  try {
    const res = await axios.get(url, {
      maxRedirects: 5,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    return res.request?.res?.responseUrl || url;
  } catch (err) {
    return url;
  }
}

// 🔥 Extract m3u8/mp4 from HTML
function extractVideoFromHtml(html: string): string | null {
  // m3u8
  const m3u8Match = html.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/);
  if (m3u8Match) return m3u8Match[0];

  // mp4
  const mp4Match = html.match(/https?:\/\/[^"' ]+\.mp4[^"' ]*/);
  if (mp4Match) return mp4Match[0];

  return null;
}

// 🔥 MAIN extractor
export async function extractStream(url: string) {
  try {
    // STEP 1: resolve short links (short.icu etc)
    const finalUrl = await resolveRedirect(url);

    // STEP 2: fetch page
    const res = await axios.get(finalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": url,
      },
    });

    const html = res.data;

    // STEP 3: try direct extraction
    let video = extractVideoFromHtml(html);
    if (video) {
      return {
        type: "file",
        url: video,
      };
    }

    // STEP 4: check iframe inside iframe
    const $ = cheerio.load(html);
    const iframe = $("iframe").attr("src");

    if (iframe) {
      return {
        type: "iframe",
        url: iframe,
      };
    }

    return {
      type: "unknown",
      url: finalUrl,
    };
  } catch (err) {
    return {
      type: "error",
      url: "",
    };
  }
}
