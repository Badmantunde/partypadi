"use client";

import React, { useState } from "react";
import { CampusEvent, EventCategory } from "@/types";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { CampusDiscoveryStrip } from "./CampusDiscoveryStrip";
import { FeaturedEvents } from "./FeaturedEvents";
import { SocialProof } from "./SocialProof";
import { HowItWorks } from "./HowItWorks";
import { OrganizerSection } from "./OrganizerSection";
import { PadiCircle } from "./PadiCircle";
import { FinalCTA } from "./FinalCTA";
import { BentoExperienceSection } from "./BentoExperienceSection";
import { StorySection } from "./StorySection";
import { Footer } from "./Footer";
import { TicketModal } from "./TicketModal";
import { HostEventModal } from "./HostEventModal";
import { ToastProvider, useToast } from "./Toast";

interface LandingPageClientProps {
  initialEvents: CampusEvent[];
}

function LandingPageContent({ initialEvents }: LandingPageClientProps) {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");
  const [selectedCampusId, setSelectedCampusId] = useState<string>("oou");
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<CampusEvent | null>(null);
  const [hostModalOpen, setHostModalOpen] = useState(false);

  const handleSelectCampus = (campusId: string) => {
    setSelectedCampusId(campusId);
    if (campusId === "oou") {
      showToast({
        type: "info",
        title: "Campus Switched",
        message: "Now displaying live campus events from OOU Ago-Iwoye.",
      });
    } else if (campusId === "unilag") {
      showToast({
        type: "info",
        title: "UNILAG Pilot Soon",
        message: "Akoka launch is opening next. Displaying current active events from OOU.",
      });
    } else if (campusId === "ui") {
      showToast({
        type: "info",
        title: "UI Ibadan Waitlist",
        message: "UI campus ticketing drops next semester. Showing live OOU events.",
      });
    } else if (campusId === "lasu") {
      showToast({
        type: "info",
        title: "LASU Ojo Waitlist",
        message: "LASU student community onboarded. Showing live OOU events.",
      });
    }
  };

  const handleSelectEventById = (eventId: string) => {
    const found = initialEvents.find((e) => e.id === eventId);
    if (found) {
      setSelectedTicketEvent(found);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#11120F]">
      {/* Navigation */}
      <Navbar onOpenHostModal={() => setHostModalOpen(true)} />

      <main className="flex-1 bg-white">
        {/* Section B — Hero */}
        <Hero
          onOpenHostModal={() => setHostModalOpen(true)}
          onSelectEvent={handleSelectEventById}
        />

        {/* Section C — Campus Discovery Strip */}
        <CampusDiscoveryStrip
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedCampusId={selectedCampusId}
          onSelectCampusId={handleSelectCampus}
        />

        {/* Section D — Featured Events Grid */}
        <FeaturedEvents
          events={initialEvents}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectEvent={(event) => setSelectedTicketEvent(event)}
        />

        {/* Bento Experience Showcase (Moved down by 2 sections) */}
        <BentoExperienceSection onSelectEvent={handleSelectEventById} />

        {/* Section E — Social Proof & Campus Energy */}
        <SocialProof />

        {/* Section F — How PartyPadi Works */}
        <HowItWorks />

        {/* Section G — Editorial Storytelling (Reference 2 style with text reveal) */}
        <StorySection />

        {/* Section H — Padi Circle (Make Plans With Your People - Placed under Story Section) */}
        <PadiCircle />

        {/* Section I — Organizer Conversion Section (Full width black) */}
        <OrganizerSection onOpenHostModal={() => setHostModalOpen(true)} />

        {/* Section J — Final CTA (Full width black) */}
        <FinalCTA onOpenHostModal={() => setHostModalOpen(true)} />
      </main>

      {/* Section J — Footer */}
      <Footer onOpenHostModal={() => setHostModalOpen(true)} />

      {/* Interactive Modals */}
      <TicketModal
        event={selectedTicketEvent}
        isOpen={!!selectedTicketEvent}
        onClose={() => setSelectedTicketEvent(null)}
      />

      <HostEventModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />
    </div>
  );
}

export function LandingPageClient({ initialEvents }: LandingPageClientProps) {
  return (
    <ToastProvider>
      <LandingPageContent initialEvents={initialEvents} />
    </ToastProvider>
  );
}
