"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Source = {
  name: string;
  type: "file" | "iframe";
  url: string;
};

export default function WatchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [sources, setSources] = useState<Source[]>([]);
  const [current, setCurrent] = useState<Source | null>(null);
  const [playing, setPlaying] = useState(false);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🔥 LOAD SOURCES
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/stream?url=${encodeURIComponent(target)}`
      );
      const data = await res.json();

      if (data.sources?.length) {
        setSources(data.sources);
        setCurrent(data.sources[0]);
      }
    }

    load();
  }, []);

  // 🔥 HANDLE VIDEO
  useEffect(() => {
    if (!current || current.type !== "file") return;

    const video = videoRef.current;
    if (!video) return;

    if (current.url.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(current.url);
        hls.attachMedia(video);
      } else {
        video.src = current.url;
      }
    } else {
      video.src = current.url;
    }
  }, [current]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div style={{ padding: 20, background: "#000", minHeight: "100vh" }}>
      <h1 style={{ color: "#fff" }}>WellPlayer 🎬</h1>

      {/* 🔥 PLAYER */}
      <div style={{ position: "relative", marginTop: 20 }}>
        {current?.type === "iframe" ? (
          <iframe
            src={current.url}
            allowFullScreen
            style={{
              width: "100%",
              height: 220,
              border: "none",
              borderRadius: 12
            }}
          />
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              style={{
                width: "100%",
                borderRadius: 12,
                background: "black"
              }}
            />

            {/* 🔥 overlay control */}
            <div
              onClick={togglePlay}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: 50,
                cursor: "pointer"
              }}
            >
              {playing ? "⏸" : "▶"}
            </div>
          </>
        )}
      </div>

      {/* 🔥 SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(s)}
            style={{
              marginRight: 10,
              padding: "10px 15px",
              background: current === s ? "red" : "#333",
              color: "#fff",
              border: "none",
              borderRadius: 8
            }}
          >
            {s.name || `Server ${i + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}
