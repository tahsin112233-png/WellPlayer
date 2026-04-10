import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: false, sources: [] });
  }

  try {
    // 🔥 Extract ID from MyFlixBD URL (simple fallback)
    const slug = url.split("/movie/")[1]?.replace("/", "");

    // 🔥 Use reliable embed servers
    const sources = [
      {
        name: "Server 1",
        type: "iframe",
        url: `https://vidsrc.to/embed/movie/${slug}`
      },
      {
        name: "Server 2",
        type: "iframe",
        url: `https://vidsrc.me/embed/movie/${slug}`
      },
      {
        name: "Server 3",
        type: "iframe",
        url: `https://vidsrc.net/embed/movie/${slug}`
      }
    ];

    return NextResponse.json({
      success: true,
      sources
    });

  } catch (e) {
    return NextResponse.json({
      success: false,
      sources: []
    });
  }
}
