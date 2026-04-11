import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({
      success: false,
      sources: [],
    });
  }

  try {
    // 🔥 STEP 1 — fetch moviesdrive page
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const sources: any[] = [];

    // 🔥 STEP 2 — extract ONLY external stream links
    $("a").each((_, el) => {
      const link = $(el).attr("href");

      if (!link) return;

      // 🎯 ONLY REAL STREAM PROVIDERS
      if (
        link.includes("hubcloud") ||
        link.includes("pixeldrain") ||
        link.includes("streamtape") ||
        link.includes("dood") ||
        link.includes("filemoon")
      ) {
        sources.push({
          type: "iframe",
          url: link.startsWith("http")
            ? link
            : `https://new2.moviesdrives.my${link}`,
          name: "Server",
        });
      }
    });

    // 🔥 STEP 3 — remove moviesdrive links (CRITICAL)
    const filtered = sources.filter(
      (s) => !s.url.includes("moviesdrives")
    );

    // 🔥 STEP 4 — remove duplicates
    const unique = Array.from(
      new Map(filtered.map((s) => [s.url, s])).values()
    );

    // 🔥 STEP 5 — fallback if nothing found
    if (unique.length === 0) {
      return NextResponse.json({
        success: true,
        sources: [
          {
            type: "iframe",
            url: url, // fallback to original (at least something loads)
            name: "Fallback",
          },
        ],
      });
    }

    return NextResponse.json({
      success: true,
      sources: unique,
    });
  } catch (err: any) {
    console.log("SOURCE ERROR:", err.message);

    return NextResponse.json({
      success: false,
      sources: [],
    });
  }
}
