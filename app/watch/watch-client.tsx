"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WatchClient() {
  const params = useSearchParams();
  const url = params.get("url");

  const [stream, setStream] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    const load = async () => {
      try {
        const res1 = await fetch(`/api/source?url=${encodeURIComponent(url)}`);
        const data1 = await res1.json();

        if (!data1.source) {
          setLoading(false);
          return;
        }

        const res2 = await fetch(
          `/api/stream?iframe=${encodeURIComponent(data1.source)}`
        );
        const data2 = await res2.json();

        if (data2.stream) {
          setStream(data2.stream);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    load();
  }, [url]);

  return (
    <div style={{ padding: 20 }}>
      <h1>WellPlayer 🎬</h1>

      {loading && <p>Loading stream...</p>}

      {!loading && stream && (
        <video
          src={stream}
          controls
          autoPlay
          style={{
            width: "100%",
            borderRadius: 12,
            background: "#000",
          }}
        />
      )}

      {!loading && !stream && (
        <p>No playable source found</p>
      )}
    </div>
  );
}
