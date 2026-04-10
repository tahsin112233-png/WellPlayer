import axios from "axios";

export async function getMyFlix(url: string) {
  const sources: any[] = [];

  try {
    const headers = {
      "User-Agent": "Mozilla/5.0",
      Accept: "*/*",
      Referer: "https://myflixbd.to/",
    };

    const res = await axios.get(url, { headers });
    const html = res.data;

    // 🔥 extract iframe (basic but working)
    const match = html.match(/<iframe.*?src="(.*?)"/);

    if (!match) {
      return { success: false, sources: [], debug: "iframe not found" };
    }

    let iframeUrl = match[1];

    // fix relative
    if (iframeUrl.startsWith("//")) {
      iframeUrl = "https:" + iframeUrl;
    }

    // 🔥 resolve shortlink
    let finalUrl = iframeUrl;

    if (iframeUrl.includes("short.icu")) {
      const redirect = await axios.get(iframeUrl, {
        headers,
        maxRedirects: 0,
        validateStatus: (s) => s >= 200 && s < 400,
      });

      const location = redirect.headers.location;
      if (location) finalUrl = location;
    }

    sources.push({
      type: "iframe",
      url: finalUrl,
      name: "MyFlixBD",
    });

    return { success: true, sources };
  } catch (e: any) {
    return {
      success: false,
      sources: [],
      debug: e.message,
    };
  }
}
