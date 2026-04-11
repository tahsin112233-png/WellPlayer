import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { data } = await axios.get("https://xm3enq.movielinkbd.li/");

    const $ = cheerio.load(data);
    const movies = [];

    $(".item").each((i, el) => {
      movies.push({
        title: $(el).find(".title").text().trim(),
        image: $(el).find("img").attr("src"),
        link: $(el).find("a").attr("href"),
      });
    });

    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
