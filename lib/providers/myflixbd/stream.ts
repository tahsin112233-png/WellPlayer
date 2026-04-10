// lib/providers/myflixbd/stream.ts

import axios from "axios";
import * as cheerio from "cheerio";
import { StreamResponse, Source } from "../../types";

export async function getMyFlix(url: string): Promise<StreamResponse> {
  try {
    const headers = {
      "User-Agent": "Mozilla/5.0",
      Accept: "*/*",
      Referer: "https://myflixbd.to/",
    };

    // 🔥 STEP 1: LOAD PAGE
    const res = await axios.get(url, { headers });
    const html = res.data;

    const $ = cheerio.load(html);

    let sources: Source[] = [];

    // 🔥 STEP 2: FIND IFRAME
    const iframe = $("iframe").attr("src");

    if (!iframe) {
      return {
        success: false,
        sources: [],
      };
    }

    let finalUrl = iframe;

    // 🔥 STEP 3: RESOLVE SHORTLINK
    if (iframe.includes("short.icu")) {
      try {
        const redirect = await axios.get(iframe, {
          headers,
          maxRedirects: 0,
          validateStatus: (s) => s >= 200 && s < 400,
        });

        const location = redirect.headers.location;

        if (location) {
          finalUrl = location;
        }
      } catch (err: any) {
        // fallback keep iframe
      }
    }

    // 🔥 STEP 4: PUSH SOURCE
    sources.push({
      type: "iframe",
      url: finalUrl,
      name: "Embed",
    });

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
