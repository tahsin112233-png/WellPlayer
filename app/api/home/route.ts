import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔗 Source homepage
    const res = await fetch("https://xm3enq.movielinkbd.li/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      cache: "no-store",
    });

    const html = await res.text();

    // ✅ REGEX (movie cards)
    const regex =
      /href="(https:\/\/xm3enq\.movielinkbd\.li\/movie\/[^"]+)".*?<img[^>]+src="([^"]+)".*?alt="([^"]+)"/gs;

    const matches: RegExpExecArray[] = [];
    let match;

    // ✅ SAFE LOOP (no matchAll)
    while ((match = regex.exec(html)) !== null) {
      matches.push(match);
    }

    // 🎬 FORMAT DATA
    const posts = matches.map((m) => ({
      title: cleanText(m[3]),
      link: m[1],
      image: m[2],
    }));

    // 🔥 Remove duplicates (important)
    const uniquePosts = Array.from(
      new Map(posts.map((p) => [p.link, p])).values()
    );

    return NextResponse.json({
      success: true,
      count: uniquePosts.length,
      data: uniquePosts.slice(0, 20), // limit (adjust if needed)
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Scraping failed",
    });
  }
}

// 🧹 CLEAN TEXT (remove weird chars)
function cleanText(text: string) {
  return text
    .replace(/&#\d+;/g, "")
    .replace(/&[^;]+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
