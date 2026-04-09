import { NextResponse } from "next/server";
import { getProvider } from "../../../lib/providerEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const providerName = searchParams.get("provider");

  if (!providerName) {
    return NextResponse.json(
      { error: "Provider required" },
      { status: 400 }
    );
  }

  try {
    const provider = getProvider(providerName);
    const data = await provider.getPosts();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
