"use client";

import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface OrganizerSectionProps {
  onOpenHostModal: () => void;
}

export function OrganizerSection({ onOpenHostModal }: OrganizerSectionProps) {
  const outcomes = [
    {
      title: "Direct Campus Reach",
      desc: "Target specific faculties, halls of residence, and matric classes without praying for algorithm luck on social media.",
    },
    {
      title: "Same-Day Bank Payouts",
      desc: "Get your ticket revenue transferred directly to your Nigerian commercial bank account with transparent accounting.",
    },
    {
      title: "Zero Duplicate Passes",
      desc: "Our free Gate Scanner App verifies unique cryptographic QR codes in 1 second, completely eliminating gate fraud.",
    },
    {
      title: "Full Attendance Analytics",
      desc: "Track hourly check-in velocity, male/female turnout, and faculty breakdown to plan your next edition even better.",
    },
  ];

  return (
    <section id="organizers" className="w-full py-20 sm:py-28 bg-[#0C0D0E] text-[#F5F5F0] border-y border-neutral-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5FF35]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition & Conversion (Col 1-7) */}
          <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
                  <span>FOR CAMPUS PROMOTERS & FACULTIES</span>
                </div>

                <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-white">
                  Your Event Deserves
                  <br />
                  <span className="font-serif italic font-normal text-[#C5FF35]">A Bigger Crowd.</span>
                </h2>

                <p className="text-base sm:text-lg text-neutral-400 max-w-xl font-normal leading-relaxed pt-1">
                  From department dinners to campus-wide parties, put your event in front of the students who want to be there. Professional ticketing made simple for university leaders.
                </p>
              </div>

              {/* 4 Outcome Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                {outcomes.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 border-t border-neutral-800/80 pt-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
                      <h3 className="font-display font-bold text-sm text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={onOpenHostModal}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-[#C5FF35] text-[#11120F] hover:bg-[#b4f323] rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Start Selling Tickets</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="flex items-center justify-center gap-2 px-7 py-4 bg-transparent border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-400 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all"
                >
                  <span>See How It Works</span>
                </a>
              </div>
            </div>

            {/* Right Column: Swiss Organizer Live Dashboard Mockup (Col 8-12) */}
            <div className="lg:col-span-5 relative">
              <div className="bg-[#151614] border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl">
                {/* Top Dashboard Status */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white font-bold">
                      LIVE ORGANIZER METRICS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                    CAMPUS PORTAL
                  </span>
                </div>

                {/* Event Name */}
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">
                    ACTIVE CAMPAIGN
                  </span>
                  <h4 className="font-display font-bold text-lg text-white mt-0.5">
                    FASSA DINNER & AWARDS &apos;26
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Heritage Grand Hall · Sat 15 Nov
                  </p>
                </div>

                {/* Key Figures */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0E0F0C] border border-neutral-800 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                      GROSS REVENUE
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-black text-[#C5FF35]">
                      ₦1,425,000
                    </div>
                    <span className="text-[10px] text-neutral-500 block">
                      Next payout: Monday 09:00
                    </span>
                  </div>

                  <div className="p-4 bg-[#0E0F0C] border border-neutral-800 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                      TICKETS ISSUED
                    </span>
                    <div className="font-mono text-xl sm:text-2xl font-black text-white">
                      385 <span className="text-xs text-neutral-500 font-normal">/ 450</span>
                    </div>
                    <span className="text-[10px] text-[#C5FF35] font-mono block">
                      85% SOLD OUT
                    </span>
                  </div>
                </div>

                {/* Live Ticket Sales Stream */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase border-b border-neutral-800 pb-2">
                    <span>RECENT PURCHASES</span>
                    <span>TIME</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-[#0E0F0C] border border-neutral-800/80 rounded-xl">
                      <div>
                        <span className="font-medium text-white block">Tade A. (Biochemistry)</span>
                        <span className="text-[10px] text-neutral-400">1x Single Gala Pass</span>
                      </div>
                      <span className="font-mono text-xs text-[#C5FF35]">₦5,000</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-[#0E0F0C] border border-neutral-800/80 rounded-xl">
                      <div>
                        <span className="font-medium text-white block">Chioma O. & 7 others</span>
                        <span className="text-[10px] text-neutral-400">1x Department Table (8x)</span>
                      </div>
                      <span className="font-mono text-xs text-[#C5FF35]">₦38,000</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-[#0E0F0C] border border-neutral-800/80 rounded-xl">
                      <div>
                        <span className="font-medium text-white block">Kelechi M.</span>
                        <span className="text-[10px] text-neutral-400">2x Couple Gala Pass</span>
                      </div>
                      <span className="font-mono text-xs text-[#C5FF35]">₦9,000</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Guarantee */}
                <div className="pt-2 border-t border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-[#C5FF35] shrink-0" />
                  <span>
                    Protected by 256-bit bank encryption & instant gate QR verification.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
