"use client";

import { useEffect, useRef, useState } from "react";

type Source = {
  type: "file" | "iframe";
  url: string;
  name: string;
};

export default function WatchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [sources, setSources] = useState<Source[]>([]);
  const [current, setCurrent] = useState<Source | null>(null);
  const [mode, setMode] = useState<"iframe" | "video">("video");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🔥 FETCH STREAM
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/stream?url=${encodeURIComponent(target)}`
        );

        const data = await res.json();
        console.log("API DATA:", data);

        if (data.success && data.sources.length) {
          setSources(data.sources);
        } else {
          setError("No playable sources found");
        }
      } catch (err) {
        setError("Failed to load stream");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 🔥 AUTO SELECT BEST SOURCE (VIDEO FIRST)
  useEffect(() => {
    if (!sources.length) return;

    const file = sources.find((s) => s.type === "file");
    const iframe = sources.find((s) => s.type === "iframe");

    if (file) {
      setCurrent(file);
      setMode("video");
    } else if (iframe) {
      setCurrent(iframe);
      setMode("iframe");
    }
  }, [sources]);

  // 🔥 LOAD VIDEO (MP4 + HLS SAFE)
  useEffect(() => {
    if (!videoRef.current || !current || mode !== "video") return;

    let hls: any;
    const video = videoRef.current;

    if (current.url.endsWith(".m3u8")) {
      import("hls.js").then((Hls) => {
        if (Hls.default.isSupported()) {
          hls = new Hls.default();
          hls.loadSource(current.url);
          hls.attachMedia(video);
        } else {
          video.src = current.url;
        }
      });
    } else {
      video.src = current.url;
    }

    return () => {
      if (hls) hls.destroy(); // 🧹 cleanup
    };
  }, [current, mode]);

  return (
    <div
      style={{
        padding: 20,
        background: "black",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>WellPlayer 🎬</h1>

      {/* 🔄 LOADING */}
      {loading && <p>Loading player...</p>}

      {/* ❌ ERROR */}
      {error && (
        <div>
          <p>{error}</p>
          <button
            onClick={() => location.reload()}
            style={{
              padding: "8px 12px",
              background: "red",
              border: "none",
              color: "white",
              borderRadius: 6,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* 🎬 PLAYER */}
      {!loading && !error && current && (
        <>
          {mode === "iframe" ? (
            <iframe
              src={current.url}
              allowFullScreen
              style={{
                width: "100%",
                height: 220,
                border: "none",
                borderRadius: 12,
                background: "black",
              }}
            />
          ) : (
            <video
              ref={videoRef}
              controls
              autoPlay
              style={{
                width: "100%",
                borderRadius: 12,
                background: "black",
              }}
            />
          )}
        </>
      )}

      {/* 🔁 SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(s);
              setMode(s.type === "file" ? "video" : "iframe");
            }}
            style={{
              marginRight: 10,
              padding: "10px 15px",
              background:
                current?.url === s.url ? "#ff4444" : "#333",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
          >
            {s.name || `Server ${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
