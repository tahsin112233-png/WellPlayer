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

    const title = $(".heading-name").text().trim();
    const image = $(".film-poster img").attr("src") || "";
    const synopsis = $(".description").text().trim();

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
