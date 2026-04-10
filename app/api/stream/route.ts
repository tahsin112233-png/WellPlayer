import { NextResponse } from "next/server";
import { getStream } from "@/lib/providers/myflixbd/stream";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: false });
  }

  const data = await getStream(url);

  return NextResponse.json(data);
}
