import React, { Suspense } from "react";
import { OnboardingClient } from "./OnboardingClient";

export const metadata = {
  title: "Onboarding & Sign In — Party Padi App",
  description: "Join Party Padi as a partygoer or event organizer. Campus event discovery, ticketing, and creator studio.",
};

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0C0D0E] text-white flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-ping" />
            <span>Loading Party Padi Portal...</span>
          </div>
        </div>
      }
    >
      <OnboardingClient />
    </Suspense>
  );
}
