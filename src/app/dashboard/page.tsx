import React, { Suspense } from "react";
import { Metadata } from "next";
import { EVENTS, CAMPUS_OPTIONS } from "@/data/events";
import { PartygoerDashboardClient } from "./PartygoerDashboardClient";

export const metadata: Metadata = {
  title: "Partygoer Dashboard — PartyPadi Campus Event Discovery",
  description:
    "Personalized event discovery, digital ticket passes, Padi Circles, and campus vibe community.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070809] text-white flex items-center justify-center font-mono text-xs">
          Loading Partygoer Dashboard...
        </div>
      }
    >
      <PartygoerDashboardClient
        initialEvents={EVENTS}
        campusOptions={CAMPUS_OPTIONS}
      />
    </Suspense>
  );
}
