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
  const [loading, setLoading] = useState(true);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🔥 Fetch sources
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/stream?url=${encodeURIComponent(target)}`
      );
      const data = await res.json();

      if (data.success) {
        setSources(data.sources);

        const best =
          data.sources.find((s: Source) =>
            s.url.includes(".m3u8")
          ) ||
          data.sources.find((s: Source) =>
            s.url.includes(".mp4")
          ) ||
          data.sources[0];

        setCurrent(best);
      }

      setLoading(false);
    }

    load();
  }, []);

  // 🔥 Setup video
  useEffect(() => {
    if (!current || !videoRef.current) return;

    const video = videoRef.current;

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
    <div style={{ background: "#000", minHeight: "100vh", padding: 10 }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      {/* PLAYER */}
      <div
        style={{
          position: "relative",
          maxWidth: 900,
          margin: "auto",
          background: "#000",
        }}
      >
        {loading ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : current?.type === "iframe" ? (
          <iframe src={current.url} width="100%" height="400" />
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              style={{ width: "100%" }}
            />

            {/* 🔥 CENTER PLAY BUTTON */}
            <div
              onClick={togglePlay}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 60,
                color: "white",
                cursor: "pointer",
              }}
            >
              {playing ? "⏸" : "▶"}
            </div>

            {/* 🔥 TOP GRADIENT */}
            <div
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: 60,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
              }}
            />

            {/* 🔥 BOTTOM CONTROLS */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: 10,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <button
                onClick={togglePlay}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: 20,
                }}
              >
                {playing ? "⏸" : "▶"}
              </button>

              <span style={{ color: "white" }}>WellPlayer</span>
            </div>
          </>
        )}
      </div>

      {/* SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(s)}
            style={{
              marginRight: 10,
              padding: "10px 15px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
