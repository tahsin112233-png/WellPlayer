export const dynamic = "force-dynamic";

type Movie = {
  title: string;
  image: string;
  link: string;
};

export default async function Home() {
  let movies: Movie[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home`, {
      cache: "no-store",
    });

    movies = await res.json();
  } catch (e) {
    console.error("Homepage fetch failed", e);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>WellPlayer</h1>

      {movies.length === 0 ? (
        <p>Loading stream...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {movies.map((movie, i) => (
            <a key={i} href={`/watch?url=${encodeURIComponent(movie.link)}`}>
              <img src={movie.image} alt={movie.title} style={{ width: "100%" }} />
              <p>{movie.title}</p>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
