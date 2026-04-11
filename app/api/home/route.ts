import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://xm3enq.movielinkbd.li/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      cache: "no-store",
    });

    const html = await res.text();

    // ✅ STEP 1: find ALL movie links
    const regex =
      /href="(https:\/\/xm3enq\.movielinkbd\.li\/movie\/[^"]+)"/g;

    const matches: { link: string; index: number }[] = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      matches.push({
        link: match[1],
        index: match.index,
      });
    }

    // ❌ If still nothing → site is JS-rendered
    if (matches.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No matches found (likely JS-rendered site)",
        debug: html.slice(0, 500), // helps debug
      });
    }

    // ✅ STEP 2: extract title + image near each link
    const posts = matches.map((m) => {
      const slice = html.substring(m.index, m.index + 800);

      const titleMatch = slice.match(/alt="([^"]+)"/i);
      const imgMatch = slice.match(
        /src="([^"]+\.(jpg|jpeg|png|webp))"/i
      );

      return {
        title: titleMatch ? cleanText(titleMatch[1]) : "No title",
        link: m.link,
        image: imgMatch ? imgMatch[1] : "",
      };
    });

    // ✅ STEP 3: remove duplicates
    const uniquePosts = Array.from(
      new Map(posts.map((p) => [p.link, p])).values()
    );

    return NextResponse.json({
      success: true,
      count: uniquePosts.length,
      data: uniquePosts.slice(0, 20),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Scraping failed",
    });
  }
}

// 🧹 CLEAN TEXT
function cleanText(text: string) {
  return text
    .replace(/&#\d+;/g, "")
    .replace(/&[^;]+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
