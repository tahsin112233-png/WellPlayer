import axios from "axios";
import * as cheerio from "cheerio";

// 🔥 resolve redirect
async function resolveRedirect(url: string): Promise<string> {
  try {
    const res = await axios.get(url, {
      maxRedirects: 5,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    return res.request?.res?.responseUrl || url;
  } catch {
    return url;
  }
}

// 🔥 extract m3u8/mp4
function extractVideo(html: string): string | null {
  const m3u8 = html.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/);
  if (m3u8) return m3u8[0];

  const mp4 = html.match(/https?:\/\/[^"' ]+\.mp4[^"' ]*/);
  if (mp4) return mp4[0];

  return null;
}

// 🔥 detect provider
function detectProvider(url: string) {
  if (url.includes("hubcloud")) return "hubcloud";
  if (url.includes("filebee")) return "filebee";
  if (url.includes("short.icu")) return "short";
  return "unknown";
}

// 🔥 hubcloud extractor (basic)
async function extractHubcloud(url: string) {
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const html = res.data;
  const video = extractVideo(html);

  if (video) {
    return {
      type: "file",
      url: video,
    };
  }

  return null;
}

// 🔥 filebee extractor (basic)
async function extractFilebee(url: string) {
  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const html = res.data;
  const video = extractVideo(html);

  if (video) {
    return {
      type: "file",
      url: video,
    };
  }

  return null;
}

// 🔥 MAIN
export async function getStream(url: string) {
  try {
    const res = await axios.get(url);
    const html = res.data;
    const $ = cheerio.load(html);

    // 🔥 collect ALL servers
    const servers: string[] = [];

    $(".btn-server").each((_, el) => {
      const s = $(el).attr("data-url");
      if (s) servers.push(s);
    });

    // fallback
    if (servers.length === 0) {
      const iframe =
        $("iframe").attr("data-src") ||
        $("iframe").attr("src");
      if (iframe) servers.push(iframe);
    }

    const sources = [];

    // 🔥 process each server
    for (let s of servers) {
      let finalUrl = await resolveRedirect(s);

      const provider = detectProvider(finalUrl);

      let result: any = null;

      if (provider === "hubcloud") {
        result = await extractHubcloud(finalUrl);
      } else if (provider === "filebee") {
        result = await extractFilebee(finalUrl);
      } else {
        // generic fallback
        const playerRes = await axios.get(finalUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Referer: url,
          },
        });

        const video = extractVideo(playerRes.data);

        if (video) {
          result = {
            type: "file",
            url: video,
          };
        } else {
          const $$ = cheerio.load(playerRes.data);
          const iframe = $$("iframe").attr("src");

          result = {
            type: "iframe",
            url: iframe || finalUrl,
          };
        }
      }

      if (result) {
        sources.push({
          name: `Server ${sources.length + 1}`,
          ...result,
        });
      }
    }

    return {
      success: true,
      sources,
    };
  } catch {
    return {
      success: false,
    };
  }
}
