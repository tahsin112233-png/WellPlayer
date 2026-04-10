"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function WatchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [url, setUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [progress, setProgress] = useState(0);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🔥 LOAD STREAM
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/stream?url=${encodeURIComponent(target)}`
      );
      const data = await res.json();

      if (data.success) {
        const first = data.sources[0];
        setUrl(first.url);
      }
    }

    load();
  }, []);

  // 🔥 HLS INIT
  useEffect(() => {
    if (!videoRef.current || !url) return;

    const video = videoRef.current;

    if (Hls.isSupported() && url.includes(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }
  }, [url]);

  // 🔥 PROGRESS TRACK
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 🔥 PLAY / PAUSE
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
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <div
        style={{ position: "relative", maxWidth: 900, margin: "auto" }}
        onClick={() => setShowUI(!showUI)}
      >
        {/* VIDEO */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          style={{
            width: "100%",
            background: "black",
            pointerEvents: "none"
          }}
        />

        {/* CLICK LAYER */}
        <div
          onClick={togglePlay}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5
          }}
        />

        {/* CENTER BUTTON */}
        {showUI && (
          <div
            onClick={togglePlay}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 60,
              color: "white",
              zIndex: 10
            }}
          >
            {playing ? "⏸" : "▶"}
          </div>
        )}

        {/* BOTTOM CONTROLS */}
        {showUI && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: 10,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
            }}
          >
            {/* PROGRESS BAR */}
            <div
              style={{
                height: 5,
                background: "#444",
                borderRadius: 5
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#ff0000"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
