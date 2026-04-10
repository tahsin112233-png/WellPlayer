import axios from "axios";
import { Stream } from "../../types/provider";

export const getStream = async (url: string): Promise<Stream[]> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    // Extract links
    const m3u8Matches = data.match(/https?:\/\/[^"]+\.m3u8/g) || [];
    const mp4Matches = data.match(/https?:\/\/[^"]+\.mp4/g) || [];

    const allLinks = [...m3u8Matches, ...mp4Matches];

    // ❌ FILTER OUT junk/tutorial videos
    const filtered = allLinks.filter((link) => {
      return (
        !link.includes("wp-content") && // remove tutorial vids
        !link.includes("logo") &&
        !link.includes("intro")
      );
    });

    const uniqueLinks = Array.from(new Set(filtered));

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
