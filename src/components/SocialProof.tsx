"use client";

import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

export function SocialProof() {
  const principles = [
    {
      num: "01",
      title: "Campus-First Discovery",
      desc: "Built around your semester rhythms, faculty calendars, hall weeks, and convocation. No clutter from outside city events.",
    },
    {
      num: "100%",
      title: "Verified Student Organizers",
      desc: "Every faculty executive, departmental committee, and campus promoter is vetted before selling passes to eliminate scams.",
    },
    {
      num: "0s",
      title: "Gate Queue Friction",
      desc: "Direct digital QR passes scanned via high-speed organizer apps. Walk straight into the venue with zero gate arguments.",
    },
    {
      num: "₦0",
      title: "Hidden Fees for Students",
      desc: "Clear upfront pricing. What is written on the event poster is exactly what you pay at checkout with student fee waivers.",
    },
  ];

  return (
    <section className="w-full py-20 sm:py-28 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header with Oversized Typography & Social Metric Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-neutral-200/80">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>CAMPUS PHILOSOPHY // 2026</span>
            </div>
            <h2 className="font-display font-medium text-4xl sm:text-6xl tracking-tight text-[#11120F] leading-[1.02]">
              Good Nights{" "}
              <br />
              <span className="font-serif italic font-normal text-[#11120F] underline decoration-[#C5FF35] decoration-4 underline-offset-4">
                Become
              </span>{" "}
              Great Stories.
            </h2>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Find the people, places, and experiences that make campus life memorable. PartyPadi connects Nigerian university students to what is happening right outside their lecture halls.
            </p>

            {/* Social Proof Metric Snippet */}
            <div className="p-5 bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#11120F] flex items-center justify-center text-white text-xs font-bold">
                    O
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-300 flex items-center justify-center text-[#11120F] text-xs font-bold">
                    T
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-800 flex items-center justify-center text-white text-xs font-bold">
                    K
                  </div>
                  {/* Neon Lime Plus Badge */}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#C5FF35] flex items-center justify-center text-[#11120F] text-xs font-bold shadow-xs">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <span className="font-display font-black text-lg text-[#11120F] leading-none block">
                    1,200+ Passes
                  </span>
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    ISSUED THIS SEMESTER
                  </span>
                </div>
              </div>

              {/* Split Stats with Hairline Divider */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-200/80 text-left">
                <div>
                  <span className="font-display font-black text-xl text-[#11120F] block">
                    95%
                  </span>
                  <span className="text-[10px] text-neutral-500 leading-tight block">
                    Gate scan velocity under 2 seconds
                  </span>
                </div>
                <div className="border-l border-neutral-200/80 pl-3">
                  <span className="font-display font-black text-xl text-[#11120F] block">
                    9 / 10
                  </span>
                  <span className="text-[10px] text-neutral-500 leading-tight block">
                    Students book passes with their clique
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Oversized Numerical Grid (Swiss Discipline) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {principles.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-7 bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl flex flex-col justify-between space-y-4 sm:space-y-6 relative overflow-hidden hover:border-[#11120F] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-xs"
            >
              <div className="space-y-4">
                {/* Oversized Number */}
                <div className="font-display font-black text-4xl sm:text-5xl text-[#11120F] tracking-tighter leading-none">
                  {item.num}
                </div>
                <div className="h-0.5 w-6 rounded-full bg-[#C5FF35]" />
                <h3 className="font-display font-bold text-base text-[#11120F] leading-snug">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Documentary Photography Triptych */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="relative aspect-[4/3] bg-[#11120F] border border-neutral-200 rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
            <Image
              src="/images/friends-linkup.jpg"
              alt="Students laughing and enjoying campus life on university lawn"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover filter contrast-[1.04] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5FF35] block">
                01 / SOCIAL ENERGY
              </span>
              <p className="font-display font-bold text-sm sm:text-base mt-0.5">
                After-class hangs & lawn linkups
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-[#11120F] border border-neutral-200 rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
            <Image
              src="/images/concert-live.jpg"
              alt="Concert stage and Nigerian student audience"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover filter contrast-[1.04] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5FF35] block">
                02 / LIVE PERFORMANCES
              </span>
              <p className="font-display font-bold text-sm sm:text-base mt-0.5">
                Campus sound clashes & amphitheatre concerts
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-[#11120F] border border-neutral-200 rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
            <Image
              src="/images/dinner-gala.jpg"
              alt="Department awards and banquet dinner celebration"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover filter contrast-[1.04] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5FF35] block">
                03 / ANNUAL TRADITIONS
              </span>
              <p className="font-display font-bold text-sm sm:text-base mt-0.5">
                Faculty black-tie dinners & merit galas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
