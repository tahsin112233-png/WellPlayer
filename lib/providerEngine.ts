import { getMoviesDrive } from "./providers/moviesdrive";

export async function getProvider(url: string) {
  try {
    const res = await getMoviesDrive(url);

    if (res.success && res.sources.length > 0) {
      return res;
    }

    return {
      success: false,
      sources: [],
    };
  } catch (e: any) {
    return {
      success: false,
      error: e.message,
      sources: [],
    };
  }
}
