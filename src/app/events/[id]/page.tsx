import React from "react";
import { notFound } from "next/navigation";
import { EVENTS, getEventById } from "@/data/events";
import { EventDetailPageClient } from "./EventDetailPageClient";

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return EVENTS.map((event) => ({
    id: event.id,
  }));
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const relatedEvents = EVENTS.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <EventDetailPageClient event={event} relatedEvents={relatedEvents} />
  );
}
