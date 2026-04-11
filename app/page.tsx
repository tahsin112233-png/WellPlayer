"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      });
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* HEADER */}
      <h1 style={{ padding: 20, fontSize: 28 }}>WellPlayer 🎬</h1>

      {/* HERO (OPTIONAL) */}
      {posts.length > 0 && (
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
            <h2 style={{ fontSize: 28 }}>{posts[0].title}</h2>

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

      {/* TRENDING */}
      <h2 style={{ padding: "0 20px" }}>Trending</h2>

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
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <div>
              <img
                src={movie.image}
                alt={movie.title}
                style={{
                  width: "100%",
                  borderRadius: 10,
                  height: 220,
                  objectFit: "cover",
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
    </div>
  );
}
