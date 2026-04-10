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
  const [mode, setMode] = useState<"iframe" | "video" | "proxy">("iframe");

  const [qualities, setQualities] = useState<any[]>([]);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);

  const [volume, setVolume] = useState(1);
  const [brightness, setBrightness] = useState(1);

  const [showControls, setShowControls] = useState(true);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🔥 LOAD SOURCES
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/stream?url=${encodeURIComponent(target)}`
      );
      const data = await res.json();

      if (data.success) {
        setSources(data.sources);

        const best = data.sources[0];
        setCurrent(best);
        decideMode(best);
      }
    }

    load();
  }, []);

  // 🔥 AUTO FALLBACK LOGIC
  const decideMode = (s: Source) => {
    if (s.type === "iframe") {
      setMode("iframe");
    } else if (s.url.includes(".m3u8")) {
      setMode("video");
    } else {
      setMode("proxy");
    }
  };

  // 🔥 HLS PLAYER + QUALITY PARSER
  useEffect(() => {
    if (!videoRef.current || !current) return;
    if (mode !== "video") return;

    const video = videoRef.current;

    if (Hls.isSupported() && current.url.includes(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(current.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels;
        setQualities(levels);
      });

      setHlsInstance(hls);
    } else {
      video.src = current.url;
    }
  }, [current, mode]);

  // 🔥 GESTURE CONTROLS
  let startY = 0;

  const handleTouchStart = (e: any) => {
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: any) => {
    const diff = startY - e.touches[0].clientY;

    if (e.touches[0].clientX < window.innerWidth / 2) {
      // brightness
      setBrightness((b) => Math.min(2, Math.max(0.5, b + diff * 0.005)));
    } else {
      // volume
      const newVol = Math.min(1, Math.max(0, volume + diff * 0.005));
      setVolume(newVol);
      if (videoRef.current) videoRef.current.volume = newVol;
    }
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "white" }}>
      
      {/* PLAYER */}
      <div
        style={{
          position: "relative",
          maxWidth: 900,
          margin: "auto",
          filter: `brightness(${brightness})`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={() => setShowControls(!showControls)}
      >
        {/* 🔥 IFRAME MODE */}
        {mode === "iframe" && current && (
          <iframe
            src={current.url}
            width="100%"
            height="400"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ border: "none" }}
          />
        )}

        {/* 🔥 VIDEO MODE */}
        {mode !== "iframe" && (
          <video
            ref={videoRef}
            controls={false}
            autoPlay
            style={{ width: "100%" }}
            src={
              mode === "proxy"
                ? `/api/proxy?url=${encodeURIComponent(current?.url || "")}`
                : undefined
            }
          />
        )}

        {/* 🔥 NETFLIX STYLE CONTROLS */}
        {showControls && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              padding: 10,
            }}
          >
            {/* PLAY / PAUSE */}
            <button
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.paused ? v.play() : v.pause();
              }}
              style={{ marginRight: 10 }}
            >
              ▶ / ⏸
            </button>

            {/* QUALITY SELECTOR */}
            {qualities.length > 0 && (
              <select
                onChange={(e) => {
                  const level = parseInt(e.target.value);
                  if (hlsInstance) hlsInstance.currentLevel = level;
                }}
              >
                {qualities.map((q, i) => (
                  <option key={i} value={i}>
                    {q.height}p
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* 🔥 SERVERS */}
      <div style={{ padding: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(s);
              decideMode(s);
            }}
            style={{
              marginRight: 10,
              padding: "10px 15px",
              background: current === s ? "#ff4444" : "#222",
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
