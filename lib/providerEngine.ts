import { getMoviesDrive } from "./providers/moviesdrive";
import { Source } from "./types";

function sanitize(sources: any[]): Source[] {
  return sources.map((s, i) => ({
    type: s.type === "file" ? "file" : "iframe",
    url: s.url,
    name: s.name || `Server ${i + 1}`,
  }));
}

export async function getProvider(url: string) {
  const result = await getMoviesDrive(url);

  if (result.success && result.sources.length) {
    return {
      success: true,
      sources: sanitize(result.sources),
    };
  }

  return {
    success: false,
    sources: [],
  };
}
