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
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  const { currentUser, getFriendsAttendingEvent } = useAuth();
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

  // Remove the last 2 cards on the home page event section (show up to 4 events: 1 lead + 3 grid cards)
  const displayEvents = filteredEvents.slice(0, 4);
  const leadEvent = displayEvents[0];
  const remainingEvents = displayEvents.slice(1);

  return (
    <section id="events" className="w-full py-12 sm:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
          <div className="space-y-2 sm:space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>01 / WHAT&apos;S HAPPENING ON CAMPUS</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#11120F] leading-[1.05]">
              Your Next{" "}
              <span className="font-serif italic font-normal text-[#11120F] underline decoration-[#C5FF35] decoration-4 underline-offset-4">
                Story
              </span>{" "}
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
                className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-neutral-50 border border-neutral-200 rounded-full text-xs text-[#11120F] placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-[#11120F] transition-all shadow-xs"
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
          <div className="py-16 text-center bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-[#11120F] shadow-xs">
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
          <div className="space-y-6 sm:space-y-8">
            {/* Lead Event: Asymmetrical Editorial Banner */}
            {leadEvent && (
              <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 hover:shadow-lg hover:border-neutral-400 shadow-xs">
                {/* Visual Image Banner (Col 1-7) */}
                <div className="lg:col-span-7 relative min-h-[200px] sm:min-h-[320px] lg:min-h-[400px] bg-[#11120F] overflow-hidden">
                  <Image
                    src={leadEvent.imageUrl}
                    alt={leadEvent.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center filter contrast-[1.04] transition-transform duration-700 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Badges on Poster */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-black/70 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase rounded-full border border-white/20">
                      {leadEvent.categoryLabel}
                    </span>
                    {leadEvent.statusBadge && (
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#C5FF35] text-[#11120F] text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase rounded-full shadow-xs">
                        {leadEvent.statusBadge}
                      </span>
                    )}
                  </div>

                  <Link href={`/events/${leadEvent.id}`} className="block group/title">
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-white space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#C5FF35] uppercase block">
                        HEADLINE SELECTION // {leadEvent.campus}
                      </span>
                      <h3 className="font-display font-bold text-xl sm:text-3xl lg:text-4xl leading-tight group-hover/title:text-[#C5FF35] transition-colors">
                        {leadEvent.title}
                      </h3>
                    </div>
                  </Link>
                </div>

                {/* Event Details & Booking Action (Col 8-12) */}
                <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-4 sm:space-y-6 bg-white">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-100 pb-2.5">
                      <span className="font-mono text-[#11120F] font-bold">
                        {leadEvent.shortDate} · {leadEvent.time}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono uppercase text-neutral-400">
                        {leadEvent.organizer.name}
                      </span>
                    </div>

                    {/* Friend Attendance Radar */}
                    {currentUser && leadEvent && (() => {
                      const leadFriends = getFriendsAttendingEvent(leadEvent.id);
                      if (leadFriends.length === 0) return null;
                      return (
                        <div className="flex items-center gap-2 p-2 bg-[#C5FF35]/15 border border-[#C5FF35]/40 rounded-xl text-xs font-mono text-[#11120F]">
                          <span className="w-2 h-2 rounded-full bg-[#11120F] animate-pulse shrink-0" />
                          <span className="font-bold">
                            {leadFriends.length} friend{leadFriends.length > 1 ? "s" : ""} going:
                          </span>
                          <span className="text-neutral-700 truncate">
                            {leadFriends.map((f) => `@${f.username}`).join(", ")}
                          </span>
                        </div>
                      );
                    })()}

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {leadEvent.description}
                    </p>

                    <div className="hidden sm:block space-y-1.5 pt-1">
                      <div className="text-[9px] font-mono uppercase text-neutral-400 tracking-wider">
                        HIGHLIGHTS
                      </div>
                      <div className="space-y-1">
                        {leadEvent.highlights.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#11120F]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#11120F] mt-1.5 shrink-0" />
                            <span className="font-medium text-neutral-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-neutral-400 block">
                        TICKETS FROM
                      </span>
                      <span className="font-mono text-lg sm:text-xl font-bold text-[#11120F]">
                        {leadEvent.priceStartingFrom === 0
                          ? "FREE ENTRY"
                          : `₦${leadEvent.priceStartingFrom.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/events/${leadEvent.id}`}
                        className="py-2 px-3 sm:py-2.5 sm:px-4 rounded-full border border-neutral-200 text-[#11120F] hover:bg-neutral-100 text-xs font-mono font-medium transition-all"
                      >
                        Details ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => onSelectEvent(leadEvent)}
                        className="spicy-btn flex items-center gap-1.5 py-2 px-4 sm:py-2.5 sm:px-5 bg-[#11120F] text-white hover:bg-black rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all shadow-xs"
                      >
                        <span>Get Tickets</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5FF35]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Editorial Grid: Secondary Events (Compact on Mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {remainingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-neutral-400 group shadow-xs"
                >
                  {/* Top Image Crop */}
                  <div>
                    <Link href={`/events/${event.id}`} className="block relative aspect-[16/10] bg-[#11120F] overflow-hidden group/img">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center filter contrast-[1.04] transition-transform duration-700 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                      {/* Header Tags */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono tracking-wider uppercase rounded-full border border-white/20">
                          {event.categoryLabel}
                        </span>
                        {event.statusBadge && (
                          <span className="px-2 py-0.5 bg-[#C5FF35] text-[#11120F] text-[9px] font-mono font-bold tracking-wider uppercase rounded-full shadow-xs">
                            {event.statusBadge}
                          </span>
                        )}
                      </div>

                      {/* Date Badge on Image */}
                      <div className="absolute bottom-2.5 left-2.5 text-white">
                        <span className="font-mono text-[11px] font-bold bg-[#11120F]/90 backdrop-blur-xs px-2.5 py-0.5 text-[#C5FF35] rounded-full border border-white/10">
                          {event.shortDate} {"//"} {event.time}
                        </span>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <div className="space-y-1">
                        <Link href={`/events/${event.id}`}>
                          <h4 className="font-display font-bold text-base sm:text-lg text-[#11120F] leading-snug hover:text-neutral-600 transition-colors">
                            {event.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-neutral-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                          {event.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#11120F] shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#11120F] shrink-0" />
                          <span className="truncate">{event.organizer.name}</span>
                        </div>

                        {/* Friend Attendance Radar */}
                        {currentUser && (() => {
                          const friendsGoing = getFriendsAttendingEvent(event.id);
                          if (friendsGoing.length === 0) return null;
                          return (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#C5FF35]/20 border border-[#C5FF35]/40 rounded-full text-[10px] font-mono text-[#11120F] font-bold truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#11120F] shrink-0 animate-pulse" />
                              <span className="truncate">
                                {friendsGoing.length} friend{friendsGoing.length > 1 ? "s" : ""} going ({friendsGoing.map((f) => `@${f.username}`).join(", ")})
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Price & CTA */}
                  <div className="p-4 pt-0 sm:p-5 sm:pt-0 flex items-center justify-between border-t border-neutral-100 mt-2 pt-3 gap-2">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-neutral-400 block">
                        PASS FROM
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#11120F]">
                        {event.priceStartingFrom === 0
                          ? "FREE"
                          : `₦${event.priceStartingFrom.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/events/${event.id}`}
                        className="py-1.5 px-2.5 text-[11px] font-mono text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-all"
                      >
                        Details ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => onSelectEvent(event)}
                        className="spicy-btn py-1.5 px-3 sm:py-2 sm:px-3.5 bg-[#11120F] text-white hover:bg-black rounded-full text-xs font-mono font-medium uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs"
                      >
                        <span>Get Ticket</span>
                        <ArrowRight className="w-3 h-3 text-[#C5FF35]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Link to browse all events */}
            <div className="pt-4 text-center">
              <Link
                href="/events"
                className="spicy-btn inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-[#11120F] hover:text-white text-[#11120F] rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all border border-neutral-200"
              >
                <span>View All Campus Events ({events.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5FF35]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
