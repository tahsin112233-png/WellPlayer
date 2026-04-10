import axios from "axios";
import * as cheerio from "cheerio";
import { Stream } from "../../types/provider";

export const getStream = async (url: string): Promise<Stream[]> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    const streams: Stream[] = [];

    // Find iframe (player)
    $("iframe").each((_, el) => {
      const src = $(el).attr("src");

      if (src) {
        streams.push({
          server: "MyFlixBD",
          link: src.startsWith("http") ? src : "https:" + src,
        });
      }
    });

    return streams;
  } catch (err) {
    console.error("STREAM ERROR:", err);
    return [];
  }
};
