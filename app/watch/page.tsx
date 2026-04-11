import { Suspense } from "react";
import WatchClient from "./WatchClient";

export default function WatchPage() {
  return (
    <Suspense fallback={<div style={{ color: "#fff" }}>Loading player...</div>}>
      <WatchClient />
    </Suspense>
  );
}
