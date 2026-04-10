import { NextResponse } from "next/server";
import { getSources } from "@/lib/providers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: false, sources: [] });
  }

  const sources = await getSources(url);

  return NextResponse.json({
    success: true,
    sources
  });
}
