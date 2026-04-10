"use client";

import { useEffect, useRef, useState } from "react";
import { getSources, getStream } from "@/lib/api";

export default function PlayerModal({ movie, onClose }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [qualities, setQualities] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);

  // 🔥 load qualities
  useEffect(() => {
    if (!movie) return;

    getSources(movie.link).then((res) => {
      if (res.success) setQualities(res.sources);
    });
  }, [movie]);

  // 🎬 load stream
  async function play(url: string) {
    const res = await getStream(url);
    if (res.success) {
      setSources(res.sources);
      setCurrent(res.sources[0]);
    }
  }

  // 🎥 video loader
  useEffect(() => {
    if (!videoRef.current || !current) return;

    const video = videoRef.current;

    if (current.url.includes(".m3u8")) {
      import("hls.js").then((Hls) => {
        const hls = new Hls.default();
        hls.loadSource(current.url);
        hls.attachMedia(video);
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
        background: "rgba(0,0,0,0.9)",
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
          style={{ width: "100%", marginTop: 10 }}
        />
      )}

      {/* 🎯 QUALITIES */}
      <div style={{ marginTop: 20 }}>
        {qualities.map((q, i) => (
          <button
            key={i}
            onClick={() => play(q.url)}
            style={{
              marginRight: 10,
              padding: 10,
              background: "red",
              color: "white",
              borderRadius: 6,
            }}
          >
            {q.quality}
          </button>
        ))}
      </div>
    </div>
  );
}
