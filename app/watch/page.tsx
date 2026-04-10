"use client";

import { useEffect, useState } from "react";

export default function WatchPage() {
  const [video, setVideo] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api =
      "https://well-player.vercel.app/api/stream?provider=myflixbd&url=https://myflixbd.to/movie/avatar-fire-and-ash/";

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setVideo(data[0].link);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        WellPlayer 🎬
      </div>

      {/* Player */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#111",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#888",
            }}
          >
            Loading stream...
          </div>
        ) : video ? (
          <video
            src={video}
            controls
            autoPlay
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "red",
            }}
          >
            Failed to load video
          </div>
        )}
      </div>

      {/* Controls section (future upgrade placeholder) */}
      <div style={{ padding: "16px" }}>
        <p style={{ color: "#aaa", fontSize: "14px" }}>
          More features coming: Skip Intro • Servers • Episodes • Quality ⚡
        </p>
      </div>
    </div>
  );
}
