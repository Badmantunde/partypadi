"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CampusEvent, EventCategory } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TicketModal } from "@/components/TicketModal";
import { HostEventModal } from "@/components/HostEventModal";
import { ToastProvider, useToast } from "@/components/Toast";
import {
  Search,
  MapPin,
  Calendar,
  X,
} from "lucide-react";

interface EventsPageClientProps {
  initialEvents: CampusEvent[];
}

function EventsPageContent({ initialEvents }: EventsPageClientProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "price-asc" | "price-desc">("date");
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<CampusEvent | null>(null);
  const [hostModalOpen, setHostModalOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Experiences" },
    { id: "parties", label: "Parties & Raves" },
    { id: "concerts", label: "Concerts & Live Sets" },
    { id: "dinners", label: "Dinners & Galas" },
    { id: "cultural", label: "Cultural & Games" },
    { id: "networking", label: "Department & Tech" },
  ];

  const filteredEvents = useMemo(() => {
    let result = [...initialEvents];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.campus.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.priceStartingFrom - b.priceStartingFrom);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.priceStartingFrom - a.priceStartingFrom);
    }

    return result;
  }, [initialEvents, searchQuery, selectedCategory, sortBy]);

  const handleCampusChange = (campusId: string) => {
    setSelectedCampus(campusId);
    if (campusId !== "all" && campusId !== "oou") {
      showToast({
        type: "info",
        title: "Waitlist Campus",
        message: `${campusId.toUpperCase()} is on the rollout waitlist. Showing available events across campuses.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#11120F] flex flex-col font-sans selection:bg-[#C5FF35] selection:text-[#11120F]">
      <Navbar onOpenHostModal={() => setHostModalOpen(true)} />

      <main className="flex-1">
        {/* Full-Width Obsidian Black Hero Section (Like Organizer Page) */}
        <section className="py-16 sm:py-24 bg-[#0C0D0E] text-white border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
            {/* Top Pill & Headline */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] animate-pulse" />
                <span>DISCOVER CAMPUS EXPERIENCES</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white leading-[1.05]">
                Everything happening on your campus.
              </h1>

              <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                Verified tickets, direct student entry, and authentic memories. From outdoor rave sessions in Ago-Iwoye to departmental award nights.
              </p>
            </div>

            {/* Embedded Dark Command Center: Search, Campus & Category Filters */}
            <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 text-left">
              {/* Top Row: Search Box & Campus Pills */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Box */}
                <div className="relative flex-1 max-w-lg">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, venues, DJs, or departments..."
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#C5FF35] focus:bg-black/60 transition-all shadow-inner font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Campus Selector Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                  {[
                    { id: "all", label: "All Campuses" },
                    { id: "oou", label: "OOU Ago-Iwoye", activeBadge: true },
                    { id: "unilag", label: "UNILAG" },
                    { id: "ui", label: "UI" },
                    { id: "lasu", label: "LASU" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCampusChange(c.id)}
                      className={`px-3.5 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                        selectedCampus === c.id
                          ? "bg-[#C5FF35] text-black font-bold shadow-[0_0_15px_rgba(197,255,53,0.3)]"
                          : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <span>{c.label}</span>
                      {c.activeBadge && (
                        <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-black" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Category Tabs & Sort */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as EventCategory)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        selectedCategory === cat.id
                          ? "bg-white text-black font-bold shadow-md"
                          : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sort Select */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-mono text-neutral-400">SORT:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "date" | "price-asc" | "price-desc")}
                    className="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#C5FF35]"
                  >
                    <option value="date" className="bg-[#11120F]">Date (Earliest First)</option>
                    <option value="price-asc" className="bg-[#11120F]">Price: Low to High</option>
                    <option value="price-desc" className="bg-[#11120F]">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Feed Container (Pure White) */}
        <div id="events-feed" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>SHOWING {filteredEvents.length} VERIFIED CAMPUS EXPERIENCES</span>
          <span>CAMPUS FEED: LIVE</span>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group flex flex-col rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-neutral-900 transition-all duration-300"
              >
                {/* Event Image Banner with Overlay Badges */}
                <Link
                  href={`/events/${event.id}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900 block"
                >
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-mono font-bold text-neutral-900">
                      {event.shortDate}
                    </span>
                    {event.statusBadge && (
                      <span className="px-2.5 py-1 rounded-full bg-[#0C0D0E]/80 backdrop-blur-sm text-[10px] font-mono uppercase text-[#C5FF35] border border-white/10 font-bold">
                        {event.statusBadge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Category Tag */}
                  <div className="absolute bottom-3 left-3 text-[11px] font-mono text-white/80">
                    {event.categoryLabel}
                  </div>
                </Link>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <Link href={`/events/${event.id}`} className="group-hover:text-black">
                      <h3 className="text-lg font-display font-medium text-[#11120F] group-hover:underline underline-offset-2 leading-snug">
                        {event.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {event.subtitle}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600 font-mono">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{event.campus}</span>
                    </div>
                  </div>

                  {/* Price & Action CTA */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                        TICKETS FROM
                      </span>
                      <span className="text-sm font-mono font-bold text-[#11120F]">
                        {event.isFree ? "FREE ENTRY" : `₦${event.priceStartingFrom.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="text-xs font-mono px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-700 hover:text-black hover:border-black transition-colors"
                      >
                        Details ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSelectedTicketEvent(event)}
                        className="spicy-btn px-3.5 py-1.5 rounded-full bg-[#11120F] text-white text-xs font-mono font-medium hover:bg-black transition-all"
                      >
                        Book Pass
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-20 border border-neutral-200 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-medium text-neutral-900">
              No matching events found
            </h3>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              We couldn&apos;t find any events matching your search or filters. Try adjusting your query or check another campus.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedCampus("all");
                }}
                className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-mono"
              >
                Reset All Filters
              </button>
              <Link
                href="/host"
                className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-800 text-xs font-mono hover:bg-neutral-100"
              >
                Host an Event Instead ↗
              </Link>
            </div>
          </div>
        )}

        {/* Organizer Callout Banner at bottom of page */}
        <div className="rounded-3xl bg-[#0C0D0E] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5FF35]">
              FOR CAMPUS CREATORS & EXECUTIVES
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-medium">
              Organizing an event at your faculty or hall?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Launch your ticket tiers, set door marshalls with instant offline QR scanners, and receive direct bank payouts.
            </p>
          </div>

          <Link
            href="/host"
            className="spicy-btn px-6 py-3.5 bg-white text-black hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_20px_rgba(255,255,255,0.25)] shrink-0 flex items-center gap-2 group"
          >
            <span>Launch Event in Studio</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        </div>
      </main>

      <Footer onOpenHostModal={() => setHostModalOpen(true)} />

      {/* Ticket Purchase Modal */}
      <TicketModal
        event={selectedTicketEvent}
        isOpen={!!selectedTicketEvent}
        onClose={() => setSelectedTicketEvent(null)}
      />

      {/* Host Event Modal */}
      <HostEventModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />
    </div>
  );
}

export function EventsPageClient({ initialEvents }: EventsPageClientProps) {
  return (
    <ToastProvider>
      <EventsPageContent initialEvents={initialEvents} />
    </ToastProvider>
  );
}
