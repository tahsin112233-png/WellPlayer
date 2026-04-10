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

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🚀 FETCH STREAM
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/stream?url=${encodeURIComponent(target)}`
        );
        const data = await res.json();

        if (data.success && data.sources?.length) {
          setSources(data.sources);
        } else {
          throw new Error("No valid sources");
        }
      } catch (err) {
        console.log("FALLBACK ACTIVATED");

        // 🔥 ALWAYS HAVE BACKUP
        setSources([
          {
            type: "file",
            url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            name: "Fallback Stream",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 🎯 AUTO SELECT
  useEffect(() => {
    if (!sources.length) return;

    const iframe = sources.find((s) => s.type === "iframe");
    const file = sources.find((s) => s.type === "file");

    if (iframe && iframe.url !== "about:blank") {
      setCurrent(iframe);
      setMode("iframe");
    } else if (file) {
      setCurrent(file);
      setMode("video");
    }
  }, [sources]);

  // 🎬 VIDEO LOADER
  useEffect(() => {
    if (!videoRef.current || !current || mode !== "video") return;

    const video = videoRef.current;

    if (current.url.includes(".m3u8")) {
      import("hls.js").then((Hls) => {
        if (Hls.default.isSupported()) {
          const hls = new Hls.default();
          hls.loadSource(current.url);
          hls.attachMedia(video);
        }
      });
    } else {
      video.src = current.url;
    }
  }, [current, mode]);

  return (
    <div style={{ padding: 20, background: "black", minHeight: "100vh" }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      {/* 🔄 LOADING */}
      {loading && (
        <p style={{ color: "gray" }}>Loading streams...</p>
      )}

      {/* ❌ NO SOURCE */}
      {!loading && !current && (
        <p style={{ color: "red" }}>No playable source found</p>
      )}

      {/* 🎬 IFRAME */}
      {current && mode === "iframe" && current.url !== "about:blank" && (
        <iframe
          src={current.url}
          style={{
            width: "100%",
            height: 220,
            border: "none",
            borderRadius: 12,
          }}
          allowFullScreen
        />
      )}

      {/* 🎥 VIDEO */}
      {current && mode === "video" && (
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

      {/* 🔁 SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              if (!s.url || s.url === "about:blank") return;

              setCurrent(s);
              setMode(s.type === "iframe" ? "iframe" : "video");
            }}
            style={{
              marginRight: 10,
              padding: "10px 15px",
              background: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: 6,
              opacity: s.url === "about:blank" ? 0.5 : 1,
            }}
          >
            {s.name || `Server ${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
