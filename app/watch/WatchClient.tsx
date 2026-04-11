// app/watch/WatchClient.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchClient() {
  const params = useSearchParams();
  const url = params?.get("url");

  const [servers, setServers] = useState<any[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    // For now, directly use URL as stream
    setServers([{ name: "Main", url }]);
    setCurrent(url);
  }, [url]);

  if (!url) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        No stream URL provided
      </div>
    );
  }

  if (!current) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading stream...
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <video
        src={current}
        controls
        autoPlay
        style={{ width: "100%", maxHeight: "80vh" }}
      />
    </div>
  );
}
