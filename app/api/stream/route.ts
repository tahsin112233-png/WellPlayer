import { NextResponse } from "next/server";
import { getMoviesDrive } from "@/lib/providers/moviesdrive";
import { getMyFlix } from "@/lib/providers/myflixbd";
import { getDirect } from "@/lib/providers/direct";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: false, sources: [] });
  }

  let sources: any[] = [];

  // 🔥 TRY MOVIESDRIVE FIRST
  const md = await getMoviesDrive(url);
  if (md.length) sources.push(...md);

  // 🔥 FALLBACK → MYFLIX
  const mf = await getMyFlix(url);
  if (mf.length) sources.push(...mf);

  // 🔥 FINAL FALLBACK
  const direct = await getDirect();
  sources.push(...direct);

  return NextResponse.json({
    success: true,
    sources,
  });
}
