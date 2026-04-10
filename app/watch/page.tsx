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
  const [overlay, setOverlay] = useState("");
  const [loading, setLoading] = useState(true);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🔥 Load API
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

  // 🔥 Setup player
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

  // 🔥 DOUBLE TAP SEEK
  let lastTap = 0;

  const handleTap = (e: any) => {
    const now = Date.now();
    const video = videoRef.current;
    if (!video) return;

    if (now - lastTap < 300) {
      const x = e.nativeEvent.offsetX;
      const width = e.currentTarget.clientWidth;

      if (x < width / 2) {
        video.currentTime -= 10;
        setOverlay("⏪ -10s");
      } else {
        video.currentTime += 10;
        setOverlay("⏩ +10s");
      }

      setTimeout(() => setOverlay(""), 800);
    }

    lastTap = now;
  };

  // 🔥 SWIPE SEEK
  let startX = 0;

  const handleTouchStart = (e: any) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: any) => {
    const video = videoRef.current;
    if (!video) return;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) > 50) {
      video.currentTime += diff > 0 ? 10 : -10;
      setOverlay(diff > 0 ? "⏩ +10s" : "⏪ -10s");

      setTimeout(() => setOverlay(""), 800);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      <div
        style={{
          position: "relative",
          background: "#000",
          maxWidth: 800,
          margin: "auto",
        }}
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {loading ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : current?.type === "iframe" ? (
          <iframe
            src={current.url}
            width="100%"
            height="400"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            style={{ width: "100%" }}
          />
        )}

        {/* 🔥 Overlay UI */}
        {overlay && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: 24,
              background: "rgba(0,0,0,0.6)",
              padding: "10px 20px",
              borderRadius: 10,
            }}
          >
            {overlay}
          </div>
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
