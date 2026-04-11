"use client";

import { useEffect, useState } from "react";

type Movie = {
  title: string;
  image: string;
  link: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/home");
        const data = await res.json();

        if (data.posts?.length) {
          setPosts(data.posts);
        } else {
          throw new Error("Empty");
        }
      } catch {
        // 🔥 FALLBACK (ALWAYS SHOW SOMETHING)
        setPosts([
          {
            title: "Avatar",
            link: "https://myflixbd.to/movie/avatar/",
            image:
              "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
          },
          {
            title: "John Wick",
            link: "https://myflixbd.to/movie/john-wick/",
            image:
              "https://image.tmdb.org/t/p/w500/r17jFHAemzcWPPtoO0UxjIX0xas.jpg",
          },
        ]);
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ padding: 20 }}>WellPlayer 🎬</h1>

      {loading && <p style={{ padding: 20 }}>Loading...</p>}

      {!loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 16,
            padding: 20,
          }}
        >
          {posts.map((m, i) => (
            <a
              key={i}
              href={`/watch?url=${encodeURIComponent(m.link)}`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <img
                src={m.image}
                style={{ width: "100%", borderRadius: 10 }}
              />
              <p>{m.title}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
