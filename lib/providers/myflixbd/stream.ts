import axios from "axios";
import * as cheerio from "cheerio";

// 🔥 Browser-like headers (VERY IMPORTANT)
const AXIOS_CONFIG = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept":
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Referer": "https://myflixbd.to/",
  },
  timeout: 15000,
};

// 🔥 Resolve redirects (short.icu etc)
async function resolveRedirect(url: string): Promise<string> {
  try {
    const res = await axios.get(url, {
      ...AXIOS_CONFIG,
      maxRedirects: 5,
    });

    return res.request?.res?.responseUrl || url;
  } catch {
    return url;
  }
}

// 🔥 Extract video links
function extractVideo(html: string): string | null {
  const m3u8 = html.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/);
  if (m3u8) return m3u8[0];

  const mp4 = html.match(/https?:\/\/[^"' ]+\.mp4[^"' ]*/);
  if (mp4) return mp4[0];

  return null;
}

// 🔥 Provider detection
function detectProvider(url: string) {
  if (url.includes("hubcloud")) return "hubcloud";
  if (url.includes("filebee")) return "filebee";
  if (url.includes("short.icu")) return "short";
  return "generic";
}

// 🔥 Hubcloud extractor (basic)
async function extractHubcloud(url: string) {
  try {
    const res = await axios.get(url, AXIOS_CONFIG);
    const html = res.data;

    const video = extractVideo(html);
    if (video) {
      return { type: "file", url: video };
    }

    return null;
  } catch {
    return null;
  }
}

// 🔥 Filebee extractor (basic)
async function extractFilebee(url: string) {
  try {
    const res = await axios.get(url, AXIOS_CONFIG);
    const html = res.data;

    const video = extractVideo(html);
    if (video) {
      return { type: "file", url: video };
    }

    return null;
  } catch {
    return null;
  }
}

// 🔥 MAIN FUNCTION
export async function getStream(url: string) {
  try {
    console.log("FETCHING:", url);

    // STEP 1: Load MyFlixBD page
    const res = await axios.get(url, AXIOS_CONFIG);
    const html = res.data;

    const $ = cheerio.load(html);

    // STEP 2: collect servers
    const servers: string[] = [];

    $(".btn-server").each((_, el) => {
      const s = $(el).attr("data-url");
      if (s) servers.push(s);
    });

    // fallback iframe
    if (servers.length === 0) {
      const iframe =
        $("iframe").attr("data-src") ||
        $("iframe").attr("src");

      if (iframe) servers.push(iframe);
    }

    console.log("SERVERS:", servers);

    if (servers.length === 0) {
      return { success: false };
    }

    const sources = [];

    // STEP 3: process each server
    for (let s of servers) {
      let finalUrl = await resolveRedirect(s);

      const provider = detectProvider(finalUrl);

      let result: any = null;

      // 🔥 provider-specific
      if (provider === "hubcloud") {
        result = await extractHubcloud(finalUrl);
      } else if (provider === "filebee") {
        result = await extractFilebee(finalUrl);
      } else {
        try {
          const playerRes = await axios.get(finalUrl, {
            ...AXIOS_CONFIG,
            headers: {
              ...AXIOS_CONFIG.headers,
              Referer: url,
            },
          });

          const playerHtml = playerRes.data;

          // try direct video
          const video = extractVideo(playerHtml);

          if (video) {
            result = {
              type: "file",
              url: video,
            };
          } else {
            const $$ = cheerio.load(playerHtml);
            const iframe = $$("iframe").attr("src");

            result = {
              type: "iframe",
              url: iframe || finalUrl,
            };
          }
        } catch {
          result = null;
        }
      }

      if (result) {
        sources.push({
          name: `Server ${sources.length + 1}`,
          ...result,
        });
      }
    }

    if (sources.length === 0) {
      return { success: false };
    }

    return {
      success: true,
      sources,
    };
  } catch (err) {
    console.log("ERROR:", err);
    return {
      success: false,
    };
  }
}
