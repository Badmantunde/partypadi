import React from "react";
import { Metadata } from "next";
import { getAllEvents } from "@/data/events";
import { EventsPageClient } from "../events/EventsPageClient";

export const metadata: Metadata = {
  title: "Discover Campus Events — PartyPadi",
  description:
    "Explore upcoming campus parties, concerts, department week dinners, and student link-ups across Nigerian universities.",
};

export default function DiscoverPage() {
  const events = getAllEvents();

  return <EventsPageClient initialEvents={events} />;
}
