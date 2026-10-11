"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HostEventModal } from "@/components/HostEventModal";
import {
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";

export default function AboutPage() {
  const [hostModalOpen, setHostModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#11120F] flex flex-col font-sans selection:bg-[#C5FF35] selection:text-[#11120F]">
      <Navbar onOpenHostModal={() => setHostModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section (Obsidian Full Width with Neon Accent - Like Organizer Page) */}
        <section className="py-20 sm:py-28 bg-[#0C0D0E] text-white border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>WHO WE ARE // THE PARTYPADI MANIFESTO</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white leading-[1.05]">
              We didn&apos;t set out to build a ticketing company. We set out to fix campus life.
            </h1>

            <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              University is where you meet the friends who will shape your next twenty years. Yet, finding out what&apos;s happening on campus was stuck in fragmented WhatsApp stories and chaotic paper queues.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/events"
                className="spicy-btn px-8 py-3.5 bg-white text-black hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2"
              >
                <span>Discover Campus Events</span>
                <span>→</span>
              </Link>
              <Link
                href="/host"
                className="spicy-btn px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-full text-xs font-mono font-medium"
              >
                Host Your Next Event ↗
              </Link>
            </div>
          </div>
        </section>

        {/* The Reality Split Section (Reference 2 Inspiration) */}
        <section className="py-20 sm:py-28 bg-[#0C0D0E] text-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Lime Tag & Bold Title */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF35] font-bold block">
                  THE GROUND TRUTH
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-medium leading-[1.08] tracking-tight">
                  Why old ticketing solutions fail in Nigerian universities.
                </h2>
                <div className="h-0.5 w-16 bg-[#C5FF35]" />
                <p className="text-sm text-neutral-400 font-sans leading-relaxed">
                  Most ticketing platforms are built for corporate conferences in Victoria Island. They assume 5G Wi-Fi, laptops, and credit cards. Campus life happens on phones, mobile data, and noisy club entrances.
                </p>
              </div>

              {/* Right Column: Narrative with Split Text Reveal */}
              <div className="lg:col-span-7 space-y-10">
                <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35]">01 / THE WHATSAPP LOGJAM</span>
                  <h3 className="text-xl font-display font-medium text-white">
                    &ldquo;Send receipt and matric number to DM&rdquo;
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Student organizers were spending 12 hours manually replying to WhatsApp chats, verifying bank transfer alerts, and writing down names in physical notebooks. When 600 students showed up, the list was lost.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35]">02 / THE 10 PM CELL TOWER CRASH</span>
                  <h3 className="text-xl font-display font-medium text-white">
                    When the network drops, gates turn into riots
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    At 10:30 PM outside a packed campus hall party, 1,200 students gather simultaneously. The local cell mast saturates. Online cloud scanners freeze. Bouncers start checking manually, queues overflow, and fights break out.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35]">03 / THE DUPLICATE SCREENSHOT FRAUD</span>
                  <h3 className="text-xl font-display font-medium text-white">
                    One valid ticket, thirty attendees
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Static PDF barcodes can be screenshotted and broadcast to 15 hostel group chats. Organizers sold 400 tickets but ended up with 900 people in the venue, losing over half of their event revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The PartyPadi Philosophy & Pillars (Pure White) */}
        <section className="py-20 sm:py-28 bg-white text-[#11120F] border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold block">
                OUR PRINCIPLES
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
                Designed with Swiss precision, engineered for campus hustle.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-medium">
                  Sub-0.8s Offline Scanning
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Our gate scanner app functions 100% offline using peer-to-peer cryptographic token validation. No internet required at the venue door.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-medium">
                  Anti-Screenshot Rotation
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Dynamic QR codes that cycle tokens with synchronized time-drift algorithms. A forwarded screenshot expires within 30 seconds.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-medium">
                  Padi Circle Social Layer
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  See which coursemates and faculty padis are going before you book. Split squad tables in seconds without messy transfer math.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Campus Rollout Map */}
        <section className="py-20 bg-neutral-50 border-b border-neutral-200" id="ambassadors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold block">
                  EXPANSION ROADMAP
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight">
                  Built to connect every university across Nigeria.
                </h2>
              </div>
              <div className="text-xs font-mono text-neutral-500">
                ACTIVE PHASE: Q4 2026 PILOT
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border-2 border-[#11120F] space-y-3 relative shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">PHASE 01</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#C5FF35] text-black text-[10px] font-mono font-bold">
                    LIVE NOW
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#11120F]">
                  OOU Ago-Iwoye
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Main Campus, Mini Campus, Ayetoro, Sagamu & Ibogun faculties. 12,000+ registered students.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">PHASE 02</span>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-mono">
                    NOVEMBER &apos;26
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#11120F]">
                  UNILAG Akoka
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Hostel associations, Faculty of Engineering, Law, and Social Sciences.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">PHASE 03</span>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-mono">
                    DECEMBER &apos;26
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#11120F]">
                  UI Ibadan
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Hall of Residence dinners, Sultan Bello, Tedder, Queen Idia, and Awo.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">PHASE 04</span>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-mono">
                    EARLY 2027
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#11120F]">
                  LASU Ojo
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Main campus student executives, club promoters, and departmental weeks.
                </p>
              </div>
            </div>

            {/* Campus Ambassador Callout */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h3 className="text-xl font-display font-medium text-neutral-900">
                  Want to lead PartyPadi on your campus?
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  We are recruiting student ambassadors across Nigerian universities. Get paid per ticket verified, lead campus marketing drops, and get VIP backstage access to every major event.
                </p>
              </div>
              <a
                href="mailto:campus@partypadi.com?subject=Campus%20Ambassador%20Application"
                className="spicy-btn px-6 py-3 rounded-full bg-[#11120F] text-white hover:bg-black font-mono text-xs font-semibold shrink-0"
              >
                Apply as Ambassador ↗
              </a>
            </div>
          </div>
        </section>

        {/* Closing Action Banner */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
              Ready to experience campus the way it was meant to be?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/events"
                className="spicy-btn px-8 py-3.5 bg-[#11120F] text-white rounded-full text-xs font-mono font-medium hover:bg-black transition-all shadow-md"
              >
                Explore Live Events →
              </Link>
              <Link
                href="/host"
                className="spicy-btn px-8 py-3.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full text-xs font-mono font-medium transition-all"
              >
                Host an Event in Studio ↗
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenHostModal={() => setHostModalOpen(true)} />
      <HostEventModal isOpen={hostModalOpen} onClose={() => setHostModalOpen(false)} />
    </div>
  );
}
