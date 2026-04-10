import axios from "axios";

export async function getStream(url: string) {
  try {
    const sources: any[] = [];

    // STEP 1: LOAD PAGE
    const page = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://myflixbd.to/",
      },
    });

    const html = page.data;

    // STEP 2: EXTRACT MOVIE ID
    const idMatch = html.match(/postid\s*=\s*["'](\d+)["']/i);
    const movieId = idMatch?.[1];

    if (!movieId) {
      return { success: false, sources: [] };
    }

    // STEP 3: CALL AJAX (REAL SOURCE)
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
          "User-Agent": "Mozilla/5.0",
          "X-Requested-With": "XMLHttpRequest",
          "Referer": url,
        },
      }
    );

    const playerHtml = ajax.data?.embed || "";

    // STEP 4: EXTRACT IFRAME
    const iframeMatch = playerHtml.match(/src=["'](.*?)["']/);
    if (iframeMatch) {
      sources.push({
        type: "iframe",
        url: iframeMatch[1],
        name: "MyFlixBD",
      });
    }

    // STEP 5: EXTRACT MP4
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

    // STEP 6: EXTRACT M3U8
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
  } catch {
    return {
      success: false,
      sources: [],
    };
  }
}
