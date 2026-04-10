import axios from "axios";
import { Stream } from "../../types/provider";

export const getStream = async (url: string): Promise<Stream[]> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const streams: Stream[] = [];

    // 🔥 Extract all possible video links
    const m3u8Matches = data.match(/https?:\/\/[^"]+\.m3u8/g) || [];
    const mp4Matches = data.match(/https?:\/\/[^"]+\.mp4/g) || [];

    const allLinks = [...m3u8Matches, ...mp4Matches];

    // 🔥 Remove duplicates
    const uniqueLinks = Array.from(new Set(allLinks));

    // 🔥 Format response
    return uniqueLinks.map((link) => ({
      server: "MyFlixBD",
      link,
      type: link.includes(".m3u8") ? "m3u8" : "mp4",
    }));
  } catch (err) {
    console.error("STREAM ERROR:", err);
    return [];
  }
};
