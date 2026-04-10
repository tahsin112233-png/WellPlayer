"use client";

import { useEffect, useState, useRef } from "react";

export default function WatchPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 🔥 Fetch stream
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/stream?url=https://myflixbd.to/movie/avatar-fire-and-ash/");
        const data = await res.json();

        if (data.success) {
          setSources(data.sources);
          setCurrent(data.sources[0]);
        }
      } catch (err) {
        console.log("error loading stream");
      }
    };

    load();
  }, []);

  // 🔥 Handle video load
  useEffect(() => {
    if (!current || !videoRef.current) return;

    if (current.type === "file") {
      videoRef.current.src = current.url;
    }
  }, [current]);

  return (
    <div style={{ padding: 20 }}>
      <h1>WellPlayer 🎬</h1>

      {/* 🔥 PLAYER */}
      <div style={{ width: "100%", height: 250, background: "#000" }}>
        {current?.type === "iframe" ? (
          <iframe
            src={current.url}
            width="100%"
            height="100%"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            controls
            width="100%"
            height="100%"
          />
        )}
      </div>

      {/* 🔥 ERROR */}
      {!current && (
        <p style={{ color: "red" }}>Failed to load video</p>
      )}

      {/* 🔥 SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(s)}
            style={{
              marginRight: 10,
              padding: "8px 12px",
              background: current === s ? "red" : "gray",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
