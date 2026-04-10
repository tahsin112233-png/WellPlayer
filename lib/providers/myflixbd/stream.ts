import axios from "axios";

export async function getStream(url: string) {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Referer": "https://myflixbd.to/",
    };

    const sources: any[] = [];

    // 🔥 STEP 1: LOAD PAGE
    const page = await axios.get(url, { headers });
    const html = page.data;

    // 🔥 STEP 2: EXTRACT IFRAME DIRECTLY (NO postid)
    const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);

    if (!iframeMatch) {
      return {
        success: false,
        sources: [],
        debug: "iframe not found (blocked or changed)",
      };
    }

    const iframeUrl = iframeMatch[1];

    // ✅ push iframe
    sources.push({
      type: "iframe",
      url: iframeUrl,
      name: "Embed",
    });

    // 🔥 STEP 3: LOAD IFRAME PAGE
    const iframePage = await axios.get(iframeUrl, { headers });
    const iframeHtml = iframePage.data;

    // 🔥 STEP 4: EXTRACT MP4
    const mp4 = iframeHtml.match(/https?:\/\/.*?\.mp4/g);
    if (mp4) {
      mp4.forEach((url) => {
        sources.push({
          type: "file",
          url,
          name: "MP4",
        });
      });
    }

    // 🔥 STEP 5: EXTRACT M3U8
    const m3u8 = iframeHtml.match(/https?:\/\/.*?\.m3u8/g);
    if (m3u8) {
      m3u8.forEach((url) => {
        sources.push({
          type: "file",
          url,
          name: "HLS",
        });
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
      error: err.message,
    };
  }
}
