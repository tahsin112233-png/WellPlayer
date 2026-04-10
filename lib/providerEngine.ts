// lib/providerEngine.ts

import { StreamResponse, Source } from "./types";

// 🔌 PROVIDERS
import { getMoviesDrive } from "./providers/moviesdrive";
import { getMyFlix } from "./providers/myflixbd/stream";
import { getDirect } from "./providers/direct";

// 🧹 SANITIZE (IMPORTANT FIX)
function sanitizeSources(sources: any[]): Source[] {
  return sources
    .filter((s) => s?.url)
    .map((s) => ({
      type: s.type === "file" ? "file" : "iframe", // ✅ force valid type
      url: s.url,
      name: s.name || "Source",
    }));
}

// 🧠 MAIN ENGINE
export async function getProvider(url: string): Promise<StreamResponse> {
  const logs: string[] = [];

  try {
    // 🔥 1. MYFLIXBD (PRIMARY)
    if (url.includes("myflixbd")) {
      const myflix = await getMyFlix(url);

      if (myflix.success && myflix.sources.length > 0) {
        return {
          success: true,
          sources: sanitizeSources(myflix.sources),
        };
      } else {
        logs.push("MyFlix failed");
      }
    }

    // 🔥 2. MOVIESDRIVE (FALLBACK)
    const movies = await getMoviesDrive(url);

    if (movies.success && movies.sources.length > 0) {
      return {
        success: true,
        sources: sanitizeSources(movies.sources),
      };
    } else {
      logs.push("MoviesDrive failed");
    }

    // 🔥 3. DIRECT (LAST RESORT)
    const direct = await getDirect(url);

    if (direct.success && direct.sources.length > 0) {
      return {
        success: true,
        sources: sanitizeSources(direct.sources),
      };
    } else {
      logs.push("Direct failed");
    }

    // ❌ NOTHING WORKED
    return {
      success: false,
      sources: [],
    };
  } catch (err: any) {
    return {
      success: false,
      sources: [],
    };
  }
}
