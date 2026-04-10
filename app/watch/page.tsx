"use client";

import { useEffect, useState } from "react";

type Server = {
  name: string;
  url: string;
};

export default function WatchPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [current, setCurrent] = useState<Server | null>(null);

  // 👉 change this dynamically later
  const imdbId = "tt0499549"; // Avatar test

  // 🔥 BUILD EMBED SERVERS
  useEffect(() => {
    const list: Server[] = [
      {
        name: "Server 1",
        url: `https://vidsrc.to/embed/movie/${imdbId}`,
      },
      {
        name: "Server 2",
        url: `https://vidlink.pro/movie/${imdbId}`,
      },
      {
        name: "Server 3",
        url: `https://autoembed.cc/embed/movie/${imdbId}`,
      },
    ];

    setServers(list);
    setCurrent(list[0]); // auto select first
  }, []);

  // 🔥 AUTO FALLBACK
  const handleError = () => {
    if (!current) return;

    const index = servers.findIndex((s) => s.url === current.url);
    const next = servers[index + 1];

    if (next) {
      setCurrent(next);
    }
  };

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: 16,
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 10 }}>
        WellPlayer 🎬
      </h1>

      {/* 🔥 PLAYER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: "#111",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {current && (
          <iframe
            key={current.url}
            src={current.url}
            allowFullScreen
            onError={handleError}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        )}
      </div>

      {/* 🔥 SERVER BUTTONS */}
      <div
        style={{
          marginTop: 15,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {servers.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(s)}
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background:
                current?.url === s.url ? "#e50914" : "#333",
              color: "#fff",
            }}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
