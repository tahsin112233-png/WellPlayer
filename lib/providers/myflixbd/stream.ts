import axios from "axios";
import * as cheerio from "cheerio";

type Source = {
  type: "iframe" | "file";
  url: string;
  name: string;
};

export async function getStream(target: string) {
  const sources: Source[] = [];

  try {
    // 🔥 HEADERS (VERY IMPORTANT)
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "*/*",
      Referer: "https://myflixbd.to/",
    };

    // 🔥 STEP 1: LOAD PAGE
    const res = await axios.get(target, { headers });
    const html = res.data;

    const $ = cheerio.load(html);

    // 🔥 STEP 2: FIND IFRAME
    let iframeUrl =
      $("iframe").attr("src") ||
      $("iframe").attr("data-src") ||
      "";

    if (!iframeUrl) {
      return {
        success: false,
        sources: [],
        debug: "iframe not found",
      };
    }

    // 🔥 FIX RELATIVE URL
    if (iframeUrl.startsWith("/")) {
      iframeUrl = "https://myflixbd.to" + iframeUrl;
    }

    console.log("STEP 2 iframe:", iframeUrl);

    // 🔥 STEP 3: RESOLVE SHORTLINK
    let finalUrl = iframeUrl;

    if (iframeUrl.includes("short.icu")) {
      try {
        const redirect = await axios.get(iframeUrl, {
          headers,
          maxRedirects: 0, // 👈 CRITICAL
          validateStatus: (s) => s >= 200 && s < 400,
        });

        const location = redirect.headers.location;

        if (location) {
          finalUrl = location;
          console.log("Resolved shortlink:", finalUrl);
        }
      } catch (err: any) {
        const location = err?.response?.headers?.location;
        if (location) {
          finalUrl = location;
          console.log("Resolved (catch):", finalUrl);
        }
      }
    }

    // 🔥 STEP 4: PUSH IFRAME SOURCE
    sources.push({
      type: "iframe",
      url: finalUrl,
      name: "Embed",
    });

    return {
      success: true,
      sources,
    };
  } catch (err: any) {
    return {
      success: false,
      sources: [],
      debug: err.message,
    };
  }
}
