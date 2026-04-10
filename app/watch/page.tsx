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

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // FETCH STREAM
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/stream?url=${encodeURIComponent(target)}`
      );
      const data = await res.json();

      if (data.success) {
        setSources(data.sources);
      }
    }

    load();
  }, []);

  // AUTO SELECT BEST SOURCE
  useEffect(() => {
    if (!sources.length) return;

    const iframe = sources.find((s) => s.type === "iframe");
    const file = sources.find((s) => s.type === "file");

    if (iframe) {
      setCurrent(iframe);
      setMode("iframe");
    } else if (file) {
      setCurrent(file);
      setMode("video");
    }
  }, [sources]);

  // LOAD VIDEO (MP4 + HLS)
  useEffect(() => {
    if (!videoRef.current || !current || mode !== "video") return;

    const video = videoRef.current;

    if (current.url.endsWith(".m3u8")) {
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

      {/* PLAYER */}
      {current && mode === "iframe" && (
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

      {current && mode === "video" && (
        <video
          ref={videoRef}
          controls
          style={{
            width: "100%",
            borderRadius: 12,
            background: "black",
          }}
        />
      )}

      {/* SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(s);
              setMode(s.type === "iframe" ? "iframe" : "video");
            }}
            style={{
              marginRight: 10,
              padding: "10px 15px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
          >
            Server {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
