"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WatchContent() {
  const params = useSearchParams();
  const url = params.get("url");

  const [sources, setSources] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);

  useEffect(() => {
    if (!url) return;

    fetch(`/api/stream?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSources(data.sources);
          setCurrent(data.sources[0]);
        }
      });
  }, [url]);

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      <div style={{ padding: 10 }}>
        <a href="/" style={{ color: "#fff" }}>← Back</a>
      </div>

      {/* PLAYER */}
      <div
        style={{
          width: "100%",
          height: "250px",
          background: "#111",
        }}
      >
        {current ? (
          <iframe
            src={current.url}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="fullscreen; autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <p style={{ padding: 20 }}>Loading player...</p>
        )}
      </div>

      {/* SERVERS */}
      <div style={{ padding: 15 }}>
        <h3>Servers</h3>

        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(s)}
            style={{
              display: "block",
              marginBottom: 10,
              padding: 12,
              width: "100%",
              background: "#e50914",
              border: "none",
              borderRadius: 6,
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
