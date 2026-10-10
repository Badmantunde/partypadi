"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CampusEvent, EventCategory } from "@/types";
import {
  MapPin,
  Search,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface FeaturedEventsProps {
  events: CampusEvent[];
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  onSelectEvent: (event: CampusEvent) => void;
}

export function FeaturedEvents({
  events,
  selectedCategory,
  onSelectCategory,
  onSelectEvent,
}: FeaturedEventsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory =
        selectedCategory === "all" || ev.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const leadEvent = filteredEvents[0];
  const remainingEvents = filteredEvents.slice(1);

  return (
    <section id="events" className="w-full py-16 sm:py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>01 / WHAT&apos;S HAPPENING ON CAMPUS</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#11120F] leading-[1.05]">
              Your Next{" "}
              <span className="font-serif italic font-normal text-[#7C3AED]">Story</span>{" "}
              Starts Here.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Discover official campus parties, live acoustic sets, department dinners, and culture nights. Reserve your spot with zero paper friction.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, venues..."
                className="w-full pl-10 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-full text-xs text-[#11120F] placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-[#11120F] transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-400 hover:text-[#11120F] bg-neutral-200/60 rounded-full px-2 py-0.5"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center bg-neutral-50/60 border border-neutral-200 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto text-[#11120F] shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-[#11120F]">
                No campus events found
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No events matched your search &ldquo;{searchQuery}&rdquo;. Try another term or reset your category filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                onSelectCategory("all");
              }}
              className="py-2.5 px-6 bg-[#11120F] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Lead Event: Asymmetrical Editorial Banner */}
            {leadEvent && (
              <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 hover:shadow-xl hover:border-neutral-400 shadow-sm">
                {/* Visual Image Banner (Col 1-7) */}
                <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] bg-[#11120F] overflow-hidden">
                  <Image
                    src={leadEvent.imageUrl}
                    alt={leadEvent.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter contrast-[1.04] transition-transform duration-700 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Badges on Poster */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono tracking-wider uppercase rounded-full border border-white/20">
                      {leadEvent.categoryLabel}
                    </span>
                    {leadEvent.statusBadge && (
                      <span className="px-3 py-1 bg-[#C5FF35] text-[#11120F] text-[10px] font-mono font-bold tracking-wider uppercase rounded-full shadow-xs">
                        {leadEvent.statusBadge}
                      </span>
                    )}
                  </div>

                  <Link href={`/events/${leadEvent.id}`} className="block group/title">
                    <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
                      <span className="text-[10px] font-mono tracking-widest text-[#C5FF35] uppercase block">
                        HEADLINE SELECTION // {leadEvent.campus}
                      </span>
                      <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl leading-tight group-hover/title:text-[#C5FF35] transition-colors">
                        {leadEvent.title}
                      </h3>
                    </div>
                  </Link>
                </div>

                {/* Event Details & Booking Action (Col 8-12) */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-neutral-50/40">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-200/80 pb-3">
                      <span className="font-mono text-[#11120F] font-bold">
                        {leadEvent.shortDate} · {leadEvent.time}
                      </span>
                      <span className="text-[11px] font-mono uppercase text-neutral-400">
                        {leadEvent.organizer.name}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {leadEvent.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                        HIGHLIGHTS
                      </div>
                      <div className="space-y-1.5">
                        {leadEvent.highlights.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#11120F]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 shrink-0" />
                            <span className="font-medium text-neutral-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                        TICKETS FROM
                      </span>
                      <span className="font-mono text-xl font-black text-[#11120F]">
                        {leadEvent.priceStartingFrom === 0
                          ? "FREE ENTRY"
                          : `₦${leadEvent.priceStartingFrom.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/events/${leadEvent.id}`}
                        className="py-2.5 px-4 rounded-full border border-neutral-300 text-[#11120F] hover:bg-neutral-100 text-xs font-mono font-medium transition-all"
                      >
                        Details ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => onSelectEvent(leadEvent)}
                        className="spicy-btn flex items-center gap-2 py-3 px-6 bg-[#11120F] text-white hover:bg-neutral-800 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all shadow-md hover:scale-[1.03] group"
                      >
                        <span>Get Tickets</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5FF35] transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Editorial Grid: Secondary Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {remainingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-neutral-200 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-neutral-400 hover:-translate-y-1 group shadow-xs"
                >
                  {/* Top Image Crop */}
                  <div>
                    <Link href={`/events/${event.id}`} className="block relative aspect-[16/10] bg-[#11120F] overflow-hidden group/img">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center filter contrast-[1.04] transition-transform duration-700 group-hover/img:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

                      {/* Header Tags */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono tracking-wider uppercase rounded-full border border-white/20">
                          {event.categoryLabel}
                        </span>
                        {event.statusBadge && (
                          <span className="px-2.5 py-0.5 bg-[#C5FF35] text-[#11120F] text-[9px] font-mono font-bold tracking-wider uppercase rounded-full shadow-xs">
                            {event.statusBadge}
                          </span>
                        )}
                      </div>

                      {/* Date Badge on Image */}
                      <div className="absolute bottom-3 left-3 text-white">
                        <span className="font-mono text-xs font-bold bg-[#11120F]/90 backdrop-blur-xs px-2.5 py-1 text-[#C5FF35] rounded-full border border-white/10">
                          {event.shortDate} {"//"} {event.time}
                        </span>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="p-6 space-y-3">
                      <div className="space-y-1">
                        <Link href={`/events/${event.id}`}>
                          <h4 className="font-display font-bold text-lg text-[#11120F] leading-snug hover:text-[#7C3AED] transition-colors">
                            {event.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {event.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-dashed border-neutral-200 space-y-1.5 text-xs text-neutral-600">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#11120F] shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#11120F] shrink-0" />
                          <span>{event.organizer.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Price & CTA */}
                  <div className="p-6 pt-0 flex flex-wrap items-center justify-between border-t border-neutral-100 mt-2 gap-2">
                    <div className="pt-3">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                        PASS FROM
                      </span>
                      <span className="font-mono text-base font-bold text-[#11120F]">
                        {event.priceStartingFrom === 0
                          ? "FREE"
                          : `₦${event.priceStartingFrom.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        href={`/events/${event.id}`}
                        className="py-2 px-3 text-[11px] font-mono text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-all"
                      >
                        Details ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => onSelectEvent(event)}
                        className="spicy-btn py-2.5 px-4 bg-[#11120F] text-white hover:bg-neutral-800 rounded-full text-xs font-mono font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs hover:scale-[1.03] group"
                      >
                        <span>Get Ticket</span>
                        <ArrowRight className="w-3 h-3 text-[#C5FF35] transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
