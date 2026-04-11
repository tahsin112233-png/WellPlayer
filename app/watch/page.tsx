"use client";

import { Suspense } from "react";
import WatchContent from "./watch-content";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ color: "#fff" }}>Loading...</div>}>
      <WatchContent />
    </Suspense>
  );
}
