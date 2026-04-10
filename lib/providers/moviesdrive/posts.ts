import axios from "axios";
import * as cheerio from "cheerio";
import { Post } from "../../types/provider";

export const getPosts = async (): Promise<Post[]> => {
  try {
    const url = "https://moviesdrive.net/";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);
    const results: Post[] = [];

    $(".post-item").each((_, el) => {
      const title = $(el).find("h2").text().trim();
      const link = $(el).find("a").attr("href") || "";
      const image = $(el).find("img").attr("src") || "";

      if (title && link) {
        results.push({
          title,
          link,
          image,
        });
      }
    });

    return results.slice(0, 20);
  } catch (error) {
    console.error(error);
    return [];
  }
};
