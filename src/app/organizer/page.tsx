import React, { Suspense } from "react";
import { Metadata } from "next";
import { EVENTS } from "@/data/events";
import { OrganizerDashboardClient } from "./OrganizerDashboardClient";

export const metadata: Metadata = {
  title: "Organizer Studio & Dashboard — PartyPadi Event Management",
  description:
    "Official workspace for student event hosts: create events, track ticket sales, manage attendees, and monitor gate telemetry.",
};

export default function OrganizerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070809] text-white flex items-center justify-center font-mono text-xs">
          Loading Organizer Studio...
        </div>
      }
    >
      <OrganizerDashboardClient initialEvents={EVENTS} />
    </Suspense>
  );
}
