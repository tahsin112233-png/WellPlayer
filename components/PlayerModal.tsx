"use client";

import { useEffect, useRef, useState } from "react";
import { getSources, getStream } from "@/lib/api";

export default function PlayerModal({ movie, onClose }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [qualities, setQualities] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);

  // 🎯 Load qualities
  useEffect(() => {
    if (!movie) return;

    getSources(movie.link).then((res) => {
      if (res.success) setQualities(res.sources);
    });
  }, [movie]);

  // 🔁 AUTO RETRY PLAYER
  async function play(url: string, tried: string[] = []) {
    const res = await getStream(url);

    if (res.success && res.sources?.length) {
      setCurrent(res.sources[0]);
    } else {
      const next = qualities.find((q) => !tried.includes(q.url));

      if (next) {
        play(next.url, [...tried, url]);
      }
    }
  }

  // 🎥 Load video
  useEffect(() => {
    if (!videoRef.current || !current) return;

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
  }, [current]);

  if (!movie) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "blur(20px)",
        background: "rgba(0,0,0,0.85)",
        zIndex: 999,
        padding: 20,
      }}
    >
      <button onClick={onClose} style={{ color: "white" }}>
        Close
      </button>

      {/* 🎬 PLAYER */}
      {current && (
        <video
          ref={videoRef}
          controls
          autoPlay
          style={{
            width: "100%",
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <track
            kind="subtitles"
            src="/sample.vtt"
            srcLang="en"
            label="English"
          />
        </video>
      )}

      {/* 🎯 QUALITY BUTTONS */}
      <div style={{ marginTop: 20 }}>
        {qualities.map((q, i) => (
          <button
            key={i}
            onClick={() => play(q.url)}
            style={{
              marginRight: 10,
              padding: 10,
              background: "#ff4444",
              color: "white",
              borderRadius: 6,
              border: "none",
            }}
          >
            {q.quality}
          </button>
        ))}
      </div>
    </div>
  );
}
