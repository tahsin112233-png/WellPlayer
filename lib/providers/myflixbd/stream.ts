import axios from "axios";
import { Stream } from "../../types/provider";

export const getStream = async (url: string): Promise<Stream[]> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const m3u8Matches = data.match(/https?:\/\/[^"]+\.m3u8/g) || [];
    const mp4Matches = data.match(/https?:\/\/[^"]+\.mp4/g) || [];

    // 🔥 Prefer m3u8 (real streams)
    if (m3u8Matches.length > 0) {
      const unique = Array.from(new Set(m3u8Matches));
      return unique.map((link) => ({
        server: "MyFlixBD",
        link,
        type: "m3u8",
      }));
    }

    // 🔥 fallback to mp4 (even if tutorial)
    if (mp4Matches.length > 0) {
      const unique = Array.from(new Set(mp4Matches));
      return unique.map((link) => ({
        server: "MyFlixBD",
        link,
        type: "mp4",
      }));
    }

    return [];
  } catch (err) {
    console.error("STREAM ERROR:", err);
    return [];
  }
};
