"use client";

import React from "react";
import { MotionReveal, SplitTextReveal } from "./MotionReveal";
import { SpicyButton } from "./SpicyButton";

export function StorySection() {
  return (
    <section className="w-full py-24 sm:py-32 bg-[#0C0D0E] text-[#F5F5F0] border-y border-neutral-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C5FF35]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column (Reference 2 style) */}
          <div className="lg:col-span-5 space-y-4">
            <MotionReveal direction="up" delayMs={50}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
                <span>WHO WE ARE // OUR STORY</span>
              </div>
            </MotionReveal>

            <MotionReveal direction="up" delayMs={150}>
              <h2 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.04]">
                Built for the Moments That Define University Life.
              </h2>
            </MotionReveal>

            <MotionReveal direction="up" delayMs={250} className="pt-4">
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl max-w-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-ping" />
                  <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-300 font-bold">
                    CAMPUS-FIRST MANIFESTO
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Every concert, hall week, department gala, and impromptu weekend hangout should be effortless to find and attend.
                </p>
              </div>
            </MotionReveal>
          </div>

          {/* Right Column (Reference 2 editorial text with text reveal) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <MotionReveal direction="up" delayMs={100}>
                <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-snug">
                  Shaping meaningful campus experiences through culture, connection, and technology.
                </h3>
              </MotionReveal>

              <div className="space-y-5 text-sm sm:text-base text-neutral-300 leading-relaxed font-normal pt-2">
                <SplitTextReveal
                  delayStartMs={150}
                  text="PartyPadi was born from a fundamental truth of student life: university is about so much more than lectures and exams. It is about the friendships forged in midnight conversations, the amphitheatre concerts where the bass echoes through campus, the black-tie faculty dinners where you celebrate your journey, and the energy of showing up with your clique."
                />

                <SplitTextReveal
                  delayStartMs={300}
                  text="For too long, campus ticketing was broken. Students had to navigate messy WhatsApp statuses, send bank transfers while praying for receipts, deal with counterfeit paper passes, and endure gate congestion. We built PartyPadi to give Nigerian universities the clean, high-speed digital infrastructure they deserve."
                />

                <SplitTextReveal
                  delayStartMs={450}
                  text="From Ago-Iwoye to Akoka, Ibadan, and beyond, we empower student leaders, departmental executives, and creative promoters to sell out their events with dignity, clarity, and instant verified payouts."
                />
              </div>
            </div>

            {/* CTA to About Page */}
            <MotionReveal direction="up" delayMs={500} className="pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <SpicyButton
                  href="/about"
                  variant="lime"
                  size="md"
                  icon="right"
                >
                  Read Our Full Story
                </SpicyButton>

                <SpicyButton
                  href="/events"
                  variant="outline"
                  size="md"
                  className="text-white border-neutral-700 hover:bg-neutral-900"
                >
                  Explore Campus Events
                </SpicyButton>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
