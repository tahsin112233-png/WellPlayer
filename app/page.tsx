export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllContent } from "@/lib/providers";

export default async function Home() {
  const posts = await getAllContent();

  return (
    <main style={{ padding: 20, color: "#fff" }}>
      <h1>WellPlayer 🎬</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 16
      }}>
        {posts.map((movie, i) => (
          <Link
            key={i}
            href={`/watch?url=${encodeURIComponent(movie.link)}`}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <div>
              <img
                src={movie.image}
                style={{ width: "100%", borderRadius: 10 }}
              />
              <p>{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
