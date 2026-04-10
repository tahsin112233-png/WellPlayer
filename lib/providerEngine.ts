import { getMyFlix } from "@/lib/providers/myflixbd";
import { getMoviesDrive } from "@/lib/providers/moviesdrive";
import { getDirect } from "@/lib/providers/direct";

export async function getStream(url: string) {
  // 🔥 try MyFlixBD first
  const myflix = await getMyFlix(url);
  if (myflix.success && myflix.sources.length) {
    return myflix;
  }

  // 🔥 fallback MoviesDrive
  const movies = await getMoviesDrive(url);
  if (movies.success && movies.sources.length) {
    return movies;
  }

  // 🔥 fallback direct
  const direct = getDirect(url);
  if (direct.success) {
    return direct;
  }

  return {
    success: false,
    sources: [],
    debug: "No provider worked",
  };
}
