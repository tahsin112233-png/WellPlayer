import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providerEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({
      success: false,
      error: "No URL provided",
    });
  }

  try {
    const data = await getProvider(url);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
