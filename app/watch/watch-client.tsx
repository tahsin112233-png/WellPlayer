"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchClient() {
  const params = useSearchParams();
  const url = params.get("url");

  const [iframe, setIframe] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    fetch(`/api/source?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        if (data.iframe) {
          setIframe(data.iframe);
        }
      });
  }, [url]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {iframe ? (
        <iframe
          src={iframe}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : (
        <p className="text-white">Loading stream...</p>
      )}
    </div>
  );
}
