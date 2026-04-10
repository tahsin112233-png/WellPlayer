import { getMyFlix } from "@/lib/providers/myflixbd";
import { getMoviesDrive } from "@/lib/providers/moviesdrive";
import { getDirect } from "@/lib/providers/direct";

export type Source = {
  type: "file" | "iframe";
  url: string;
  name: string;
};

export type StreamResponse = {
  success: boolean;
  sources: Source[];
  debug?: string;
};

export async function getStream(url: string): Promise<StreamResponse> {
  const logs: string[] = [];

  // ❌ invalid url protection
  if (!url || url.startsWith("about:")) {
    return {
      success: false,
      sources: [],
      debug: "Invalid URL",
    };
  }

  // 🔥 PROVIDER 1 — MYFLIXBD
  try {
    const myflix = await getMyFlix(url);
    if (myflix.success && myflix.sources.length > 0) {
      return {
        success: true,
        sources: sanitizeSources(myflix.sources),
      };
    } else {
      logs.push("MyFlixBD failed");
    }
  } catch (e: any) {
    logs.push("MyFlixBD error: " + e.message);
  }

  // 🔥 PROVIDER 2 — MOVIESDRIVE
  try {
    const movies = await getMoviesDrive(url);
    if (movies.success && movies.sources.length > 0) {
      return {
        success: true,
        sources: sanitizeSources(movies.sources),
      };
    } else {
      logs.push("MoviesDrive failed");
    }
  } catch (e: any) {
    logs.push("MoviesDrive error: " + e.message);
  }

  // 🔥 PROVIDER 3 — DIRECT LINK
  try {
    const direct = getDirect(url);
    if (direct.success && direct.sources.length > 0) {
      return {
        success: true,
        sources: sanitizeSources(direct.sources),
      };
    } else {
      logs.push("Direct failed");
    }
  } catch (e: any) {
    logs.push("Direct error: " + e.message);
  }

  // ❌ ALL FAILED
  return {
    success: false,
    sources: [],
    debug: logs.join(" | "),
  };
}

// 🔥 CLEAN & VALIDATE SOURCES
function sanitizeSources(sources: Source[]): Source[] {
  return sources.filter((s) => {
    if (!s.url) return false;

    // ❌ block broken urls
    if (
      s.url.startsWith("about:") ||
      s.url.includes("javascript:") ||
      s.url === "#"
    ) {
      return false;
    }

    return true;
  });
}

// 🔥 OPTIONAL ALIAS (for old code compatibility)
export const getProvider = getStream;
