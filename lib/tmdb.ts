const API_KEY = "f81af962f969df1a8bebbb9f6b7f17b7";

export async function searchMovie(title: string) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
    );

    const data = await res.json();
    return data.results?.[0];
  } catch {
    return null;
  }
}
