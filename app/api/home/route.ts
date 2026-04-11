import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://myflixbd.to", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();

    const regex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]+)"/g;

    const posts = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      posts.push({
        title: match[2],
        image: match[1],
        link: "https://myflixbd.to",
      });
    }

    return NextResponse.json({
      posts: posts.slice(0, 20),
    });
  } catch {
    return NextResponse.json({
      posts: [],
    });
  }
}
