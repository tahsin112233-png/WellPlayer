"use client";

import { useEffect, useRef, useState } from "react";

type Source = {
  type: "iframe" | "file";
  url: string;
  name: string;
};

export default function WatchPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [current, setCurrent] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const target = params?.get("url");

  // FETCH SOURCES
  useEffect(() => {
    if (!target) return;

    fetch(`/api/stream?url=${encodeURIComponent(target)}`)
      .then((res) => res.json())
      .then((data) => {
        setSources(data.sources || []);
        setCurrent(data.sources?.[0] || null);
        setLoading(false);
      });
  }, [target]);

  // AUTO RETRY
  useEffect(() => {
    if (!current && sources.length > 1) {
      setCurrent(sources[1]);
    }
  }, [current]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: 10,
      }}
    >
      <h2 style={{ opacity: 0.7 }}>WellPlayer 🎬</h2>

      {/* PLAYER */}
      <div
        style={{
          width: "100%",
          height: 220,
          background: "#111",
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {loading && <p>Loading...</p>}

        {current && current.type === "iframe" && (
          <iframe
            src={current.url}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          />
        )}

        {/* 10s skip overlay (UI only) */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 10,
            fontSize: 12,
            opacity: 0.5,
          }}
        >
          ⏪ 10s
        </div>

        <div
          style={{
            position: "absolute",
            top: "40%",
            right: 10,
            fontSize: 12,
            opacity: 0.5,
          }}
        >
          10s ⏩
        </div>
      </div>

      {/* SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(s)}
            style={{
              marginRight: 10,
              marginBottom: 10,
              padding: "8px 12px",
              background:
                current?.url === s.url ? "#e50914" : "#222",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* QUALITY UI (mock for now) */}
      <div style={{ marginTop: 10 }}>
        {["1080p", "720p", "480p"].map((q) => (
          <button
            key={q}
            style={{
              marginRight: 10,
              padding: "6px 10px",
              background: "#333",
              borderRadius: 6,
              color: "white",
              border: "none",
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
