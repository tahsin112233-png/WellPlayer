import axios from "axios";

export async function getStream(url: string) {
  try {
    const sources: any[] = [];

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Referer": "https://myflixbd.to/",
      "Origin": "https://myflixbd.to",
    };

    // STEP 1: LOAD PAGE
    const page = await axios.get(url, { headers });
    const html = page.data;

    console.log("PAGE LOADED");

    // STEP 2: EXTRACT MOVIE ID
    const idMatch = html.match(/postid\s*=\s*["'](\d+)["']/i);
    const movieId = idMatch?.[1];

    console.log("MOVIE ID:", movieId);

    if (!movieId) {
      return {
        success: false,
        sources: [],
        debug: "movieId not found",
      };
    }

    // STEP 3: AJAX CALL
    const ajax = await axios.get(
      "https://myflixbd.to/wp-admin/admin-ajax.php",
      {
        params: {
          action: "doo_player_ajax",
          post: movieId,
          nume: "1",
          type: "movie",
        },
        headers: {
          ...headers,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const playerHtml = ajax.data?.embed || "";

    console.log("AJAX RESPONSE:", playerHtml.slice(0, 200));

    // STEP 4: IFRAME
    const iframeMatch = playerHtml.match(/src=["'](.*?)["']/);
    if (iframeMatch) {
      sources.push({
        type: "iframe",
        url: iframeMatch[1],
        name: "MyFlixBD",
      });
    }

    // STEP 5: MP4
    const mp4 = playerHtml.match(/https?:\/\/.*?\.mp4/g);
    if (mp4) {
      mp4.forEach((url) => {
        sources.push({
          type: "file",
          url,
          name: "MP4",
        });
      });
    }

    // STEP 6: M3U8
    const m3u8 = playerHtml.match(/https?:\/\/.*?\.m3u8/g);
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
