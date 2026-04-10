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

    // 🔥 Extract m3u8/mp4 from raw HTML
    const m3u8Match = data.match(/https?:\/\/[^"]+\.m3u8/g);
    const mp4Match = data.match(/https?:\/\/[^"]+\.mp4/g);

    if (m3u8Match) {
      m3u8Match.forEach((link: string) => {
        streams.push({
          server: "MyFlixBD",
          link,
          type: "m3u8",
        });
      });
    }

    if (mp4Match) {
      mp4Match.forEach((link: string) => {
        streams.push({
          server: "MyFlixBD",
          link,
          type: "mp4",
        });
      });
    }

    return streams;
  } catch (err) {
    console.error("STREAM ERROR:", err);
    return [];
  }
};
