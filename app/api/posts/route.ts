import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const { data } = await axios.get(
      "https://new2.moviesdrives.my/",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const $ = cheerio.load(data);
    const posts: any[] = [];

    $(".post").each((_, el) => {
      const title = $(el).find("h2 a").text().trim();
      const link = $(el).find("h2 a").attr("href");
      const image = $(el).find("img").attr("src");

      if (title && link) {
        posts.push({
          title,
          link,
          image,
        });
      }
    });

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      posts: [],
    });
  }
}
