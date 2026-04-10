import axios from "axios";

export async function getMoviesDrive(url: string) {
  try {
    const res = await axios.get(url);
    const html = res.data;

    const match = html.match(/(https:\/\/[^"]+\.m3u8)/);

    if (!match) {
      return { success: false, sources: [] };
    }

    return {
      success: true,
      sources: [
        {
          type: "file",
          url: match[1],
          name: "MoviesDrive HLS",
        },
      ],
    };
  } catch {
    return { success: false, sources: [] };
  }
}
