"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onOpenHostModal: () => void;
}

export function FinalCTA({ onOpenHostModal }: FinalCTAProps) {
  return (
    <section className="w-full py-24 sm:py-36 bg-[#0C0D0E] text-[#F5F5F0] border-t border-neutral-800 relative overflow-hidden">
      {/* Swiss grid accent lines */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 opacity-5">
        <div className="border-r border-white h-full col-span-4" />
        <div className="border-r border-white h-full col-span-4" />
        <div className="border-r border-white h-full col-span-4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
          <span>YOUR TICKET TO CAMPUS CULTURE</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h2 className="font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.98]">
            There&apos;s More to Campus
            <br />
            <span className="font-serif italic font-normal text-[#C5FF35]">Than Class.</span>
          </h2>

          <p className="text-base sm:text-xl text-neutral-400 max-w-xl mx-auto font-normal leading-relaxed pt-2">
            Find what&apos;s happening. Get your ticket. Be there.
          </p>
        </div>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/events"
            className="spicy-btn w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 bg-white text-[#0C0D0E] hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.02]"
          >
            <span>Explore Events</span>
            <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
          </Link>

          <button
            type="button"
            onClick={onOpenHostModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all"
          >
            <span>Bring Your Event to PartyPadi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Swiss Coordinates & Location Stamp */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
          <span>CAMPUS CULTURE · NIGERIA</span>
          <span>{"//"}</span>
          <span>07°08&apos;N 03°55&apos;E</span>
          <span>{"//"}</span>
          <span>ALL CAMPUSES SOON</span>
        </div>
      </div>
    </section>
  );
}
