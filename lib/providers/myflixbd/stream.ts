import axios from "axios";

export async function getStream(url: string) {
  try {
    const sources: any[] = [];

    const headers = {
      "User-Agent": "Mozilla/5.0",
      Accept: "*/*",
      Referer: "https://myflixbd.to/",
    };

    // 🔥 STEP 1: LOAD MYFLIX PAGE
    const res = await axios.get(url, { headers });
    const html = res.data;

    // 🔥 STEP 2: FIND SHORTLINK (short.icu)
    const shortMatch = html.match(/https?:\/\/short\.icu\/[^\s"'<>]+/);

    if (!shortMatch) {
      return {
        success: false,
        sources: [],
        debug: "shortlink not found",
      };
    }

    let shortUrl = shortMatch[0];

    console.log("shortUrl:", shortUrl);

    // 🔥 STEP 3: RESOLVE SHORTLINK → HUBCLOUD
    let hubUrl = shortUrl;

    try {
      const redirect = await axios.get(shortUrl, {
        headers,
        maxRedirects: 0,
        validateStatus: (s) => s >= 200 && s < 400,
      });

      if (redirect.headers.location) {
        hubUrl = redirect.headers.location;
      }
    } catch (e: any) {
      if (e.response?.headers?.location) {
        hubUrl = e.response.headers.location;
      }
    }

    console.log("hubUrl:", hubUrl);

    // ❌ avoid about:blank
    if (!hubUrl.startsWith("http")) {
      return {
        success: false,
        sources: [],
        debug: "invalid hub url",
      };
    }

    // 🔥 STEP 4: LOAD HUBCLOUD PAGE
    const hubRes = await axios.get(hubUrl, {
      headers: {
        ...headers,
        Referer: shortUrl,
      },
    });

    const hubHtml = hubRes.data;

    // 🔥 STEP 5: EXTRACT MP4 / M3U8
    const m3u8Match = hubHtml.match(/https?:\/\/[^"' ]+\.m3u8[^"' ]*/);
    const mp4Match = hubHtml.match(/https?:\/\/[^"' ]+\.mp4[^"' ]*/);

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

    // 🔥 STEP 6: FINAL FALLBACK (iframe)
    if (!sources.length) {
      sources.push({
        type: "iframe",
        url: hubUrl,
        name: "HubCloud Embed",
      });
    }

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
