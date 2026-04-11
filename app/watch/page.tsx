import { Suspense } from "react";
import WatchClient from "./watch-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <WatchClient />
    </Suspense>
  );
}
