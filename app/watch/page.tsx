"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WatchPage() {
  const params = useSearchParams();
  const url = params.get("url");

  const [servers, setServers] = useState<any[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    fetch(`/api/source?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SERVERS:", data);

        if (data.sources?.length) {
          setServers(data.sources);
          setCurrent(data.sources[0].url);
        }
      });
  }, [url]);

  return (
    <div style={{ padding: 20, color: "#fff" }}>
      <h2>🎬 WellPlayer</h2>

      {/* PLAYER */}
      {current && (
        <iframe
          src={current}
          width="100%"
          height="250"
          allowFullScreen
          style={{ borderRadius: 10, marginBottom: 20 }}
        />
      )}

      {/* SERVERS */}
      <div>
        <h3>Servers</h3>
        {servers.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(s.url)}
            style={{
              display: "block",
              margin: "10px 0",
              padding: "10px",
              background: "#e50914",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              width: "100%",
            }}
          >
            Server {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
