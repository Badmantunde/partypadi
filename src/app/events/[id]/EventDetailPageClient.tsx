"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CampusEvent } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TicketModal } from "@/components/TicketModal";
import { HostEventModal } from "@/components/HostEventModal";
import { ToastProvider, useToast } from "@/components/Toast";
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface EventDetailPageClientProps {
  event: CampusEvent;
  relatedEvents: CampusEvent[];
}

function EventDetailContent({ event, relatedEvents }: EventDetailPageClientProps) {
  const { showToast } = useToast();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState(event.ticketTiers[0]?.id || "");
  const [quantity, setQuantity] = useState(1);

  const activeTier =
    event.ticketTiers.find((t) => t.id === selectedTierId) ||
    event.ticketTiers[0];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast({
        type: "success",
        title: "Link Copied!",
        message: "Event link copied to clipboard. Share with your clique!",
      });
    }
  };

  const totalPrice = activeTier ? activeTier.price * quantity : 0;

  return (
    <div className="min-h-screen bg-white text-[#11120F] flex flex-col">
      <Navbar onOpenHostModal={() => setHostModalOpen(true)} />

      <main className="flex-1 pb-20">
        {/* Breadcrumb Bar */}
        <div className="w-full bg-neutral-50 border-b border-neutral-200 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Campus Discovery</span>
            </Link>
            <span className="text-neutral-400 hidden sm:inline">
              EVENT REF // {event.id.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl bg-black">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover filter contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Badges on Poster */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-mono tracking-wider uppercase rounded-full border border-white/20">
                {event.categoryLabel}
              </span>
              {event.statusBadge && (
                <span className="px-3 py-1 bg-[#C5FF35] text-[#11120F] text-xs font-mono font-bold tracking-wider uppercase rounded-full shadow-md">
                  {event.statusBadge}
                </span>
              )}
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-mono rounded-full border border-white/20 hidden sm:inline-block">
                {event.campus}
              </span>
            </div>

            {/* Share Button on Banner */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-full border border-white/20 backdrop-blur-md transition-all shadow-md hover:scale-105"
              title="Share event link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Bottom Title on Banner */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-2">
              <span className="text-[11px] font-mono tracking-widest text-[#C5FF35] uppercase block">
                OFFICIAL CAMPUS EXPERIENCE // {event.campus}
              </span>
              <h1 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.04] text-white">
                {event.title}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl font-normal leading-relaxed">
                {event.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Main Content & Booking Panel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Event Intel & Description (Col 1-7) */}
            <div className="lg:col-span-7 space-y-10">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-neutral-50/70 border border-neutral-200 rounded-3xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono uppercase">
                    <Calendar className="w-3.5 h-3.5 text-[#11120F]" />
                    <span>DATE</span>
                  </div>
                  <p className="font-bold text-sm text-[#11120F]">{event.date}</p>
                </div>

                <div className="space-y-1 sm:border-l sm:border-neutral-200 sm:pl-4">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono uppercase">
                    <Clock className="w-3.5 h-3.5 text-[#11120F]" />
                    <span>TIME</span>
                  </div>
                  <p className="font-bold text-sm text-[#11120F]">{event.time}</p>
                </div>

                <div className="space-y-1 sm:border-l sm:border-neutral-200 sm:pl-4">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono uppercase">
                    <MapPin className="w-3.5 h-3.5 text-[#11120F]" />
                    <span>VENUE</span>
                  </div>
                  <p className="font-bold text-sm text-[#11120F] truncate">{event.venue}</p>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-4">
                <h2 className="font-display font-medium text-2xl tracking-tight text-[#11120F]">
                  About This Experience
                </h2>
                <p className="text-base text-neutral-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[#11120F]">
                  Experience Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-neutral-50/60 border border-neutral-200 rounded-2xl flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Organizer Card */}
              <div className="p-6 bg-neutral-50/70 border border-neutral-200 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#11120F] text-[#C5FF35] flex items-center justify-center font-display font-black text-xl shadow-sm">
                    {event.organizer.name.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display font-bold text-base text-[#11120F]">
                        {event.organizer.name}
                      </h4>
                      <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                    </div>
                    <p className="text-xs text-neutral-500 font-mono">
                      {event.organizer.role} · Verified Campus Partner
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-block px-3 py-1 bg-white border border-neutral-200 rounded-full text-[10px] font-mono uppercase text-neutral-600">
                  100% VETTED
                </span>
              </div>

              {/* Squad Invitation Banner */}
              <div className="p-6 bg-[#0C0D0E] text-white rounded-3xl space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-ping" />
                  <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300 font-semibold">
                    PADI SQUAD COORDINATION
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-white">
                  Rolling with your clique?
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-lg leading-relaxed">
                  Coordinate table packages, share direct booking links on WhatsApp, and show up together with seamless multi-seat tickets.
                </p>
                <div className="pt-1">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-mono transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-[#C5FF35]" />
                    <span>Copy Clique Invite Link</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Pass Booking Box (Col 8-12) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 p-6 sm:p-8 bg-neutral-50/70 border border-neutral-200 rounded-3xl space-y-6 shadow-xl">
                <div className="space-y-1 pb-4 border-b border-neutral-200">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    INSTANT CHECKOUT
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-3xl font-black text-[#11120F]">
                      {totalPrice === 0 ? "FREE ENTRY" : `₦${totalPrice.toLocaleString()}`}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      ₦0 platform fee
                    </span>
                  </div>
                </div>

                {/* Tier Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#11120F] font-semibold block">
                    Choose Your Pass Tier:
                  </label>
                  <div className="space-y-2.5">
                    {event.ticketTiers.map((tier) => {
                      const isSelected = activeTier?.id === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedTierId(tier.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-[#11120F] bg-white ring-2 ring-[#11120F] shadow-sm"
                              : "border-neutral-200 bg-white/70 hover:bg-white"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-sm text-[#11120F]">
                                {tier.name}
                              </span>
                              {tier.badge && (
                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#C5FF35] text-[#11120F] font-bold rounded-full">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500">{tier.description}</p>
                          </div>
                          <span className="font-mono text-base font-bold text-[#11120F] shrink-0 ml-3">
                            {tier.price === 0 ? "FREE" : `₦${tier.price.toLocaleString()}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between py-3 border-y border-neutral-200">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#11120F] font-semibold">
                    Quantity
                  </span>
                  <div className="flex items-center border border-neutral-300 rounded-full bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-sm font-mono hover:bg-neutral-100 disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-mono text-sm font-bold min-w-8 text-center text-[#11120F]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      className="px-3.5 py-1.5 text-sm font-mono hover:bg-neutral-100 disabled:opacity-30"
                      disabled={quantity >= 5}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(true)}
                  className="spicy-btn w-full py-4 px-6 bg-[#11120F] text-white hover:bg-neutral-800 rounded-full text-xs sm:text-sm font-mono font-medium uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all group"
                >
                  <span>
                    {totalPrice === 0
                      ? "Claim Free Campus Pass"
                      : `Get ${quantity}x Ticket${quantity > 1 ? "s" : ""} · ₦${totalPrice.toLocaleString()}`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#C5FF35] transition-transform group-hover:translate-x-1" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-mono text-center">
                  <ShieldCheck className="w-4 h-4 text-[#11120F]" />
                  <span>Instant digital QR token delivered to email & WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="border-t border-neutral-200 pt-12 space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
                    <span>MORE HAPPENING ON CAMPUS</span>
                  </div>
                  <h3 className="font-display font-medium text-2xl sm:text-3xl text-[#11120F] tracking-tight">
                    Other Events You Might Like
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-black hidden sm:inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/events/${rel.id}`}
                    className="p-4 bg-neutral-50/70 border border-neutral-200 rounded-3xl hover:border-black hover:shadow-xl transition-all duration-300 group block"
                  >
                    <div className="relative aspect-[16/10] bg-black rounded-2xl overflow-hidden mb-3">
                      <Image
                        src={rel.imageUrl}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded-full text-[9px] font-mono">
                        {rel.shortDate}
                      </div>
                    </div>
                    <h4 className="font-display font-bold text-base text-[#11120F] group-hover:text-[#7C3AED] transition-colors leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-1">
                      {rel.venue}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onOpenHostModal={() => setHostModalOpen(true)} />

      {/* Ticket Modal */}
      <TicketModal
        event={event}
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />

      {/* Host Modal */}
      <HostEventModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />
    </div>
  );
}

export function EventDetailPageClient(props: EventDetailPageClientProps) {
  return (
    <ToastProvider>
      <EventDetailContent {...props} />
    </ToastProvider>
  );
}
