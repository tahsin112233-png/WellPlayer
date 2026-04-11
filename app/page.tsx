"use client";

import { useEffect, useState } from "react";

type Movie = {
  title: string;
  link: string;
  image: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/home")
      .then((res) => res.json())
      .then((data) => {
        console.log("HOME DATA:", data);

        if (data.success && data.posts?.length) {
          setPosts(data.posts);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* HEADER */}
      <h1 style={{ padding: 20, fontSize: 28 }}>WellPlayer 🎬</h1>

      {/* LOADING */}
      {loading && (
        <p style={{ padding: 20, color: "gray" }}>Loading content...</p>
      )}

      {/* HERO BANNER */}
      {!loading && posts.length > 0 && (
        <div
          style={{
            position: "relative",
            height: 300,
            marginBottom: 20,
          }}
        >
          <img
            src={posts[0].image}
            alt={posts[0].title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6,
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
            }}
          >
            <h2 style={{ fontSize: 26 }}>{posts[0].title}</h2>

            <a
              href={`/watch?url=${encodeURIComponent(posts[0].link)}`}
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "10px 20px",
                background: "#e50914",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              ▶ Play
            </a>
          </div>
        </div>
      )}

      {/* GRID */}
      {!loading && posts.length > 0 && (
        <>
          <h2 style={{ padding: "0 20px" }}>Latest</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 15,
              padding: 20,
            }}
          >
            {posts.map((movie, i) => (
              <a
                key={i}
                href={`/watch?url=${encodeURIComponent(movie.link)}`}
                style={{
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                <div>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />

                  <h3
                    style={{
                      fontSize: 14,
                      marginTop: 8,
                    }}
                  >
                    {movie.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <p style={{ padding: 20, color: "gray" }}>
          No content found (MyFlix blocked or changed structure)
        </p>
      )}
    </div>
  );
}
