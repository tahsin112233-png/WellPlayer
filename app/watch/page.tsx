"use client";

import { useEffect, useRef, useState } from "react";

type Source = {
  type: "file" | "iframe";
  url: string;
  name: string;
};

export default function WatchPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [sources, setSources] = useState<Source[]>([]);
  const [current, setCurrent] = useState<Source | null>(null);
  const [mode, setMode] = useState<"iframe" | "video">("iframe");

  const target =
    "https://myflixbd.to/movie/avatar-fire-and-ash/";

  // 🔥 FETCH API
  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/stream?url=${encodeURIComponent(target)}`
      );
      const data = await res.json();

      if (data.success) {
        setSources(data.sources);
      }
    }

    load();
  }, []);

  // 🔥 AUTO SELECT
  useEffect(() => {
    if (!sources.length) return;

    setCurrent(sources[0]);
    setMode("iframe");
  }, [sources]);

  // 🔥 MAGIC: EXTRACT VIDEO FROM IFRAME
  useEffect(() => {
    if (!iframeRef.current || mode !== "iframe") return;

    const interval = setInterval(() => {
      try {
        const iframeDoc =
          iframeRef.current?.contentWindow?.document;

        if (!iframeDoc) return;

        const html = iframeDoc.documentElement.innerHTML;

        // 🔥 extract mp4
        const mp4 = html.match(
          /https?:\/\/[^"' ]+\.mp4[^"' ]*/
        );

        const m3u8 = html.match(
          /https?:\/\/[^"' ]+\.m3u8[^"' ]*/
        );

        if (mp4 || m3u8) {
          const url = mp4?.[0] || m3u8?.[0];

          console.log("FOUND VIDEO:", url);

          setCurrent({
            type: "file",
            url,
            name: "Extracted",
          });

          setMode("video");
          clearInterval(interval);
        }
      } catch (e) {
        // cross-origin → ignore
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [mode]);

  // 🔥 LOAD VIDEO
  useEffect(() => {
    if (!videoRef.current || mode !== "video" || !current)
      return;

    const video = videoRef.current;

    if (current.url.endsWith(".m3u8")) {
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
  }, [current, mode]);

  return (
    <div style={{ padding: 20, background: "black", minHeight: "100vh" }}>
      <h1 style={{ color: "white" }}>WellPlayer 🎬</h1>

      {/* IFRAME MODE */}
      {current && mode === "iframe" && (
        <iframe
          ref={iframeRef}
          src={current.url}
          style={{
            width: "100%",
            height: 220,
            border: "none",
            borderRadius: 12,
          }}
          allowFullScreen
        />
      )}

      {/* VIDEO MODE */}
      {current && mode === "video" && (
        <video
          ref={videoRef}
          controls
          autoPlay
          style={{
            width: "100%",
            borderRadius: 12,
            background: "black",
          }}
        />
      )}

      {/* SERVERS */}
      <div style={{ marginTop: 20 }}>
        {sources.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(s);
              setMode(s.type === "iframe" ? "iframe" : "video");
            }}
            style={{
              marginRight: 10,
              padding: "10px 15px",
              background: "red",
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
