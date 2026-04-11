import { Suspense } from "react";
import WatchClient from "./WatchClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading player...</div>}>
      <WatchClient />
    </Suspense>
  );
}
