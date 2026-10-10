"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, QrCode } from "lucide-react";

interface BentoExperienceSectionProps {
  onSelectEvent: (eventId: string) => void;
}

export function BentoExperienceSection({ onSelectEvent }: BentoExperienceSectionProps) {
  return (
    <section className="w-full bg-[#000000] text-white py-16 sm:py-24 border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* 1. Left Card: Tall Peach Pill Card (Col 1-4) */}
          <div className="lg:col-span-4 bg-[#FCECE8] text-[#11120F] rounded-[38px] sm:rounded-[44px] p-7 sm:p-9 flex flex-col justify-between min-h-[520px] lg:min-h-[640px] shadow-2xl relative overflow-hidden">
            {/* Top Text */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-black/50 block">
                CAMPUS EXPERIENCES
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#11120F] leading-tight">
                Every vibe,
                <br />
                on your terms.
              </h3>
            </div>

            {/* Center 3D Sculpture Asset (Reference: Geometric prism with amber spheres) */}
            <div className="relative my-6 w-full aspect-square max-w-[260px] mx-auto rounded-3xl overflow-hidden shadow-md">
              <Image
                src="/images/bento-sculpture.jpg"
                alt="3D geometric sculpture with amber spheres"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom Copy & Action Pill */}
            <div className="space-y-4 pt-2">
              <p className="text-xs sm:text-[13px] text-black/70 leading-relaxed font-normal">
                From spontaneous after-class hangouts to 1,000-student department dinners and amphitheatre concerts.
              </p>

              <a
                href="#events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/20 text-xs font-mono font-medium hover:bg-black hover:text-white transition-all shadow-xs"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 2. Right Side: Top Headline + Rocket Card + Bottom Wide White Card (Col 5-12) */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-6 lg:gap-8">
            {/* Top Row: Bold Headline Block + Purple Rocket Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Center Headline Block (Col 1-7) */}
              <div className="md:col-span-7 space-y-3 py-4 sm:py-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
                  <span>THE PARTYPADI ENGINE</span>
                </div>

                <h2 className="font-display font-medium text-4xl sm:text-6xl lg:text-[4.25rem] leading-[0.96] tracking-tight text-white">
                  We power
                  <br />
                  <span className="inline-flex items-baseline gap-3">
                    <span>campus</span>
                    {/* Glowing circular element from reference */}
                    <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#DADBD4] inline-block align-middle" />
                  </span>
                  <br />
                  <span className="relative inline-block mt-1">
                    <span className="px-3 sm:px-4 py-0.5 rounded-full bg-[#7C3AED] text-white">
                      experiences.
                    </span>
                  </span>
                </h2>
              </div>

              {/* Purple Square Rocket Card (Col 8-12) */}
              <div
                onClick={() => onSelectEvent("after-class-sunset")}
                className="md:col-span-5 bg-[#7C3AED] text-white rounded-[38px] sm:rounded-[44px] p-6 sm:p-7 flex flex-col justify-between aspect-square max-w-sm w-full mx-auto shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
              >
                {/* Top Label */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-display font-black text-xl sm:text-2xl leading-tight block">
                      Zero Gate
                    </span>
                    <span className="font-display font-black text-xl sm:text-2xl leading-tight block text-[#C5FF35]">
                      Friction
                    </span>
                  </div>
                  <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    FAST SCAN
                  </span>
                </div>

                {/* 3D Rocket Asset from Reference */}
                <div className="relative w-full aspect-square max-h-[160px] sm:max-h-[180px] mx-auto rounded-2xl overflow-hidden shadow-lg my-2">
                  <Image
                    src="/images/bento-rocket.jpg"
                    alt="3D rocket blasting off"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Bottom Tag */}
                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/80">Tap to Preview</span>
                  <span className="text-[#C5FF35] font-bold">1.2s Gate Check-in →</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Wide White Rounded Card (Reference Style) */}
            <div className="bg-white text-[#11120F] rounded-[38px] sm:rounded-[44px] p-3 sm:p-4 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
                {/* Sub-Card 1: Soft Lavender/Blue with Smiling Student Cutout & Rings (Col 1-7) */}
                <div className="md:col-span-7 bg-[#EEF2FF] rounded-[28px] sm:rounded-[34px] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
                  {/* Subtle Background Rings */}
                  <div className="absolute right-0 bottom-0 w-56 h-56 rounded-full border border-[#4338CA]/10 pointer-events-none -translate-x-4 translate-y-4" />
                  <div className="absolute right-0 bottom-0 w-40 h-40 rounded-full border border-[#4338CA]/10 pointer-events-none translate-x-2 translate-y-2" />

                  {/* Top: Oval Student Cutout + Sparkle */}
                  <div className="flex items-center justify-between z-10">
                    {/* Oval Student Cutout */}
                    <div className="relative w-20 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-amber-900">
                      <Image
                        src="/images/hero-student.jpg"
                        alt="Smiling Nigerian student"
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Sparkle Icon from Reference */}
                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#4338CA] shadow-xs">
                      <span className="text-base font-bold">✦</span>
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="pt-4 z-10 space-y-1">
                    <h4 className="font-display font-black text-xl sm:text-2xl text-[#11120F] leading-tight">
                      All across campus.
                    </h4>
                    <p className="text-xs text-[#5C5E57] font-mono">
                      5 Faculties · 40+ Departments · Ago-Iwoye Main Site
                    </p>
                  </div>
                </div>

                {/* Sub-Card 2: Soft Lime/Yellow with 01 sec Metric (Col 8-12) */}
                <div className="md:col-span-5 bg-[#FEF08A] rounded-[28px] sm:rounded-[34px] p-6 sm:p-7 flex flex-col justify-between text-[#11120F] min-h-[220px]">
                  {/* Top: Rounded square scanner badge with circular purple accent */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl border-2 border-[#11120F] bg-white p-1.5 flex items-center justify-center relative shadow-xs">
                      <QrCode className="w-full h-full text-[#11120F]" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#7C3AED] border border-white" />
                    </div>

                    {/* Massive Bold Numeral: 01 sec (Reference: 02 sce in purple) */}
                    <div className="font-display font-black text-3xl sm:text-4xl text-[#7C3AED] tracking-tight">
                      01 sec
                    </div>
                  </div>

                  {/* Bottom Description */}
                  <div className="pt-4 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-black/60 block">
                      OFFLINE QR ENTRY
                    </span>
                    <p className="text-xs text-[#11120F] font-medium leading-relaxed">
                      Instant gate check-in verified by official faculty association scanners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
