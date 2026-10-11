import React, { Suspense } from "react";
import { CircleDetailClient } from "./CircleDetailClient";

export default function CirclePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070809] text-white flex items-center justify-center font-mono text-xs">
          Loading Circle planning room...
        </div>
      }
    >
      <CircleDetailClient />
    </Suspense>
  );
}
