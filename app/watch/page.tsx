"use client";

import { useEffect, useState } from "react";

export default function WatchPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  useEffect(() => {
    async function run() {
      const res = await fetch(
        `/api/stream?url=${encodeURIComponent(target)}`
      );
      const data = await res.json();

      if (!data.success) return;

      const hubUrl = data.sources[0].url;

      // 🔥 OPEN HUBCLOUD IN NEW TAB (FOR DEBUG)
      window.open(hubUrl, "_blank");

      alert(
        "Open DevTools → Network → click MP4 → copy URL → paste into player"
      );
    }

    run();
  }, []);

  return (
    <div style={{ background: "black", height: "100vh", color: "white" }}>
      <h1>WellPlayer 🎬</h1>

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          autoPlay
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}
