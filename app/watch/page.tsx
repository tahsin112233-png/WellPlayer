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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [sources, setSources] = useState<Source[]>([]);
  const [current, setCurrent] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 CHANGE THIS URL WHEN TESTING
  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/stream?url=${encodeURIComponent(target)}`
        );
        const data = await res.json();

        if (data.success && data.sources.length > 0) {
          setSources(data.sources);

          // 🔥 auto-pick best source
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // 🔥 Handle video playback
  useEffect(() => {
    if (!current || !videoRef.current) return;

    const video = videoRef.current;

    if (current.type === "file") {
      // HLS support
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
    }
  }, [current]);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      {/* PLAYER */}
      <div
        style={{
          background: "#000",
          width: "100%",
          maxWidth: 800,
          margin: "20px auto",
        }}
      >
        {loading ? (
          <p style={{ color: "white" }}>Loading...</p>
        ) : current?.type === "iframe" ? (
          <iframe
            ref={iframeRef}
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
