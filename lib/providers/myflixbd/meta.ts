import axios from "axios";
import * as cheerio from "cheerio";
import { Info } from "../../types/provider";

export const getMeta = async (url: string): Promise<Info> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    // Try multiple selectors (fallback system)
    const title =
      $("h1").first().text().trim() ||
      $(".film-name").text().trim() ||
      "";

    const image =
      $(".film-poster img").attr("src") ||
      $(".film-poster img").attr("data-src") ||
      $("img").first().attr("src") ||
      "";

    const synopsis =
      $(".description").text().trim() ||
      $(".film-description").text().trim() ||
      $("p").text().trim();

    return {
      title,
      image,
      synopsis,
      type: "movie",
      linkList: [
        {
          title: "Watch",
          link: url,
        },
      ],
    };
  } catch (err) {
    console.error("META ERROR:", err);
    return {
      title: "",
      image: "",
      synopsis: "",
      type: "movie",
      linkList: [],
    };
  }
};
