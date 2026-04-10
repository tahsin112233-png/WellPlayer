import axios from "axios";

export async function getStream(url: string) {
  try {
    const headers = {
      "User-Agent": "Mozilla/5.0",
      Accept: "*/*",
      Referer: "https://myflixbd.to/",
    };

    // 🔥 1. Load page
    const res = await axios.get(url, { headers });
    const html = res.data;

    // 🔥 2. Extract shortlink
    const shortMatch = html.match(/https?:\/\/short\.icu\/[^\s"'<>]+/);

    if (!shortMatch) {
      return { success: false, sources: [], debug: "no shortlink" };
    }

    let shortUrl = shortMatch[0];

    // 🔥 3. Resolve redirect → hubcloud
    let hubUrl = shortUrl;

    try {
      const r = await axios.get(shortUrl, {
        headers,
        maxRedirects: 0,
        validateStatus: (s) => s >= 200 && s < 400,
      });

      hubUrl = r.headers.location || hubUrl;
    } catch (e: any) {
      hubUrl = e.response?.headers?.location || hubUrl;
    }

    // ❌ DO NOT FETCH HUBCLOUD (403)
    // ✅ RETURN IT ONLY

    return {
      success: true,
      sources: [
        {
          type: "iframe",
          url: hubUrl,
          name: "HubCloud",
        },
      ],
    };
  } catch (err: any) {
    return {
      success: false,
      sources: [],
      debug: err.message,
    };
  }
}
