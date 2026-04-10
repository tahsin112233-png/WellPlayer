import axios from "axios";
import * as cheerio from "cheerio";

type Source = {
  type: "file" | "iframe";
  url: string;
  name: string;
};

export async function getStream(target: string) {
  const sources: Source[] = [];

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    Accept: "*/*",
    Referer: "https://myflixbd.to/",
  };

  try {
    // 🔥 STEP 1: LOAD PAGE
    const res = await axios.get(target, { headers });
    const html = res.data;
    const $ = cheerio.load(html);

    // 🔥 STEP 2: EXTRACT iframe
    let iframeUrl =
      $("iframe").attr("src") ||
      $("iframe").attr("data-src") ||
      "";

    if (!iframeUrl) {
      return { success: false, sources: [], debug: "iframe not found" };
    }

    if (iframeUrl.startsWith("/")) {
      iframeUrl = "https://myflixbd.to" + iframeUrl;
    }

    console.log("iframe:", iframeUrl);

    // 🔥 STEP 3: RESOLVE SHORTLINK
    let embedUrl = iframeUrl;

    if (iframeUrl.includes("short.icu")) {
      try {
        const redirect = await axios.get(iframeUrl, {
          headers,
          maxRedirects: 0,
          validateStatus: (s) => s >= 200 && s < 400,
        });

        const location = redirect.headers.location;
        if (location) embedUrl = location;
      } catch (err: any) {
        const location = err?.response?.headers?.location;
        if (location) embedUrl = location;
      }
    }

    console.log("embed:", embedUrl);

    // 🔥 STEP 4: LOAD EMBED PAGE (HUBCLOUD / PLAYER)
    const embedRes = await axios.get(embedUrl, {
      headers: {
        ...headers,
        Referer: iframeUrl,
      },
    });

    const embedHtml = embedRes.data;

    // 🔥 STEP 5: FIND DIRECT VIDEO (MP4 / M3U8)
    const m3u8Match = embedHtml.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/);
    const mp4Match = embedHtml.match(/https?:\/\/[^"' ]+\.mp4[^"' ]*/);

    if (m3u8Match) {
      sources.push({
        type: "file",
        url: m3u8Match[0],
        name: "HLS Stream",
      });
    }

    if (mp4Match) {
      sources.push({
        type: "file",
        url: mp4Match[0],
        name: "MP4",
      });
    }

    // 🔥 STEP 6: FALLBACK TO IFRAME (LAST OPTION)
    if (!sources.length && embedUrl && embedUrl !== "about:blank") {
      sources.push({
        type: "iframe",
        url: embedUrl,
        name: "Embed Fallback",
      });
    }

    return {
      success: sources.length > 0,
      sources,
      debug: {
        iframeUrl,
        embedUrl,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      sources: [],
      debug: err.message,
    };
  }
}
