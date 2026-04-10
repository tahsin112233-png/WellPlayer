import axios from "axios";
import * as cheerio from "cheerio";

// 🔥 resolve redirect (short.icu etc)
async function resolveRedirect(url: string): Promise<string> {
  try {
    const res = await axios.get(url, {
      maxRedirects: 5,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    return res.request?.res?.responseUrl || url;
  } catch {
    return url;
  }
}

// 🔥 extract m3u8 / mp4
function extractVideo(html: string): string | null {
  const m3u8 = html.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/);
  if (m3u8) return m3u8[0];

  const mp4 = html.match(/https?:\/\/[^"' ]+\.mp4[^"' ]*/);
  if (mp4) return mp4[0];

  return null;
}

// 🔥 MAIN FUNCTION
export async function getStream(url: string) {
  try {
    // STEP 1: load MyFlixBD page
    const res = await axios.get(url);
    const html = res.data;

    const $ = cheerio.load(html);

    // STEP 2: get iframe
    let iframe =
      $("iframe").attr("data-src") ||
      $("iframe").attr("src") ||
      $(".btn-server").attr("data-url");

    if (!iframe) {
      return {
        success: false,
      };
    }

    // STEP 3: resolve short link
    const finalUrl = await resolveRedirect(iframe);

    // STEP 4: fetch player page
    const playerRes = await axios.get(finalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": url,
      },
    });

    const playerHtml = playerRes.data;

    // STEP 5: try direct video extraction
    const video = extractVideo(playerHtml);

    if (video) {
      return {
        success: true,
        source: {
          type: "file",
          url: video,
        },
      };
    }

    // STEP 6: fallback → iframe inside iframe
    const $$ = cheerio.load(playerHtml);
    const nestedIframe = $$("iframe").attr("src");

    if (nestedIframe) {
      return {
        success: true,
        source: {
          type: "iframe",
          url: nestedIframe,
        },
      };
    }

    // fallback
    return {
      success: true,
      source: {
        type: "iframe",
        url: finalUrl,
      },
    };
  } catch (err) {
    return {
      success: false,
    };
  }
}
