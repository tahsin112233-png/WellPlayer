"use client";

import { useEffect, useState } from "react";

export default function WatchPage() {
  const [src, setSrc] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href).searchParams.get("url");

    if (!url) return;

    fetch(`/api/stream?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        if (data.source) {
          setSrc(data.source);
          setType(data.type);
        }
      });
  }, []);

  if (!src) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      {type === "iframe" ? (
        <iframe
          src={src}
          width="100%"
          height="500"
          allowFullScreen
        />
      ) : (
        <video
          src={src}
          controls
          autoPlay
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}
