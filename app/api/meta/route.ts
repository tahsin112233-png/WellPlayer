import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providerEngine";

export async function GET() {
  const data = await getProvider();
  return NextResponse.json(data);
}
