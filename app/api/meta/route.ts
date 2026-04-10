import { NextResponse } from "next/server";
import { getProvider } from "../../../lib/providerEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const providerName = searchParams.get("provider");
  const url = searchParams.get("url");

  if (!providerName || !url) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  try {
    const provider: any = getProvider(providerName);
    const data = await provider.getMeta(url);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Meta failed" },
      { status: 500 }
    );
  }
}
