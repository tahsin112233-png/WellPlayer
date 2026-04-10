"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// ✅ FIX: disable SSR for Plyr
const Plyr = dynamic(() => import("plyr-react"), {
  ssr: false
});

import "plyr-react/plyr.css";

type Source = {
  name: string;
  type: "file" | "iframe";
  url: string;
};

export default function WatchPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [current, setCurrent] = useState<Source | null>(null);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  useEffect(() => {
    async function load() {
      try {
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
      } catch (e) {
        console.error(e);
      }
    }

    load();
  }, []);

  const videoSource = {
    type: "video",
    sources: current
      ? [
          {
            src: current.url,
            type: current.url.includes(".m3u8")
              ? "application/x-mpegURL"
              : "video/mp4",
          },
        ]
      : [],
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: 10 }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      <div style={{ maxWidth: 900, margin: "auto" }}>
        {current?.type === "file" && (
          <Plyr
            source={videoSource}
            options={{
              controls: [
                "play",
                "progress",
                "current-time",
                "mute",
                "volume",
                "settings",
                "fullscreen"
              ]
            }}
          />
        )}

        {current?.type === "iframe" && (
          <iframe src={current.url} width="100%" height="400" />
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
              background: current === s ? "#ff4444" : "#222",
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
