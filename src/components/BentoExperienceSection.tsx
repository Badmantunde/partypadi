"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";

interface BentoExperienceSectionProps {
  onSelectEvent: (eventId: string) => void;
}

export function BentoExperienceSection({ onSelectEvent }: BentoExperienceSectionProps) {
  return (
    <section className="w-full bg-white text-[#11120F] py-14 sm:py-20 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>THE PARTYPADI ENGINE</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#11120F] leading-[1.05]">
              Built for How Campus{" "}
              <span className="font-serif italic font-normal text-[#11120F] underline decoration-[#C5FF35] decoration-4 underline-offset-4">
                Actually Lives.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Fast offline QR passes, verified organizers, and clique linkups. The modern ticketing experience university students deserve.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/events"
              className="spicy-btn inline-flex items-center gap-2 px-5 py-2.5 bg-[#11120F] text-white hover:bg-neutral-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5FF35]" />
            </Link>
          </div>
        </div>

        {/* Bento Grid — Sleek & Mobile-Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Card 1: Obsidian Hero Bento Card (Instant Gate Pass with Official Ticket Mark) */}
          <div className="md:col-span-7 bg-[#0C0D0E] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between border border-white/10 shadow-xl relative overflow-hidden group">
            {/* Ambient Lime Glow in Corner */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#C5FF35]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  SPEED & SECURITY
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white leading-tight">
                  1.2s Instant Gate Check-in
                </h3>
                <p className="text-xs text-neutral-400 max-w-md pt-1 leading-relaxed">
                  Cryptographic offline mesh verification. When 2,000 students jam campus network towers at gate time, PartyPadi tickets scan smoothly without active data.
                </p>
              </div>

              {/* Official Ticket Graphic */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                <Image
                  src="/images/partypadi-ticket.png"
                  alt="PartyPadi Ticket"
                  fill
                  className="object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Live Scan Metric Bar */}
            <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-pulse" />
                <span className="text-neutral-300">100% Offline Resilient</span>
              </div>
              <span className="text-[#C5FF35] font-bold">Zero Paper Waste →</span>
            </div>
          </div>

          {/* Card 2: Verified Campus Organizers (Col 8-12) */}
          <div className="md:col-span-5 bg-white text-[#11120F] rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between border border-neutral-200 shadow-sm hover:border-neutral-400 transition-all">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#0C0D0E] text-[#C5FF35] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block pt-1">
                TRUST & VERIFICATION
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-[#11120F] leading-tight">
                100% Vetted Student Hosts
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every faculty executive, hall representative, and departmental coordinator is verified. Zero counterfeit passes, zero fake WhatsApp bank transfer receipts.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>FACULTY BACKED</span>
              <span className="font-bold text-[#11120F]">Campus Verified ✓</span>
            </div>
          </div>

          {/* Card 3: Authentic Campus Energy Photo Card (Col 1-5) */}
          <div className="md:col-span-5 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200 shadow-sm min-h-[220px] sm:min-h-[260px] group">
            <Image
              src="/images/friends-linkup.jpg"
              alt="Nigerian students vibing on campus"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#C5FF35] uppercase block">
                CAMPUS LIFE // VIBES
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl leading-tight">
                Show Up With Your People.
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-normal">
                Never miss an amphitheatre concert, faculty dinner, or sunset linkup.
              </p>
            </div>
          </div>

          {/* Card 4: Clique Group Pass & No WhatsApp Drama (Col 6-12) */}
          <div className="md:col-span-7 bg-white text-[#11120F] rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between border border-neutral-200 shadow-sm hover:border-neutral-400 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0C0D0E] text-[#C5FF35] flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono font-bold text-neutral-800 border border-neutral-200 uppercase">
                  CLIQUE PASS
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  GROUP TICKETING
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#11120F] leading-tight">
                  No More WhatsApp Screenshot Chaos
                </h3>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Send single checkout links to your circle. Each attendee gets their own cryptographically signed QR ticket sent directly to their phone.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>ONE CHECKOUT LINK</span>
              <span className="font-bold text-[#11120F]">Instant Delivery →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
