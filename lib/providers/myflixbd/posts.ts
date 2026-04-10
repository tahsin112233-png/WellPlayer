import axios from "axios";
import * as cheerio from "cheerio";
import { Post } from "../../types/provider";

export const getPosts = async (): Promise<Post[]> => {
  try {
    const url = "https://myflixbd.to/";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);
    const results: Post[] = [];

    // Target movie/series cards
    $(".film_list-wrap .flw-item").each((_, el) => {
      const title = $(el).find(".film-name a").text().trim();
      const link = $(el).find(".film-name a").attr("href") || "";
      const image = $(el).find("img").attr("data-src") || "";

      if (title && link && image) {
        results.push({
          title,
          link: "https://myflixbd.to" + link,
          image,
        });
      }
    });

    return results.slice(0, 20);
  } catch (err) {
    console.error("MYFLIXBD ERROR:", err);
    return [];
  }
};
