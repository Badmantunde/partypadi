"use client";

import React, { useState } from "react";
import { QrCode, Check } from "lucide-react";

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"pass" | "scan">("pass");

  const steps = [
    {
      num: "01",
      name: "DISCOVER",
      title: "Find your next experience",
      description:
        "Filter by your faculty, weekend vibe, or music taste. Stop searching through cluttered WhatsApp statuses and student group chats.",
      details: ["Filtered by your campus", "Real-time ticket availability", "Verified student organizers"],
    },
    {
      num: "02",
      name: "GET YOUR TICKET",
      title: "Reserve in seconds",
      description:
        "Select your tier—from early bird passes to full squad VIP tables. Pay securely via Bank Transfer, USSD, or Card with zero surprise fees.",
      details: ["Instant payment confirmation", "Direct email & WhatsApp receipt", "Apple Wallet support"],
    },
    {
      num: "03",
      name: "SHOW UP",
      title: "Walk straight in",
      description:
        "Open your unique digital QR pass on your phone. Get scanned in under 3 seconds at the door. No printouts, no gate arguments.",
      details: ["Offline QR code backup", "Zero duplicate pass entry", "Verified entry wristband exchange"],
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 sm:py-28 bg-white border-b border-neutral-200/80">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
            <span>THE WORKFLOW // FOR ATTENDEES</span>
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#11120F] leading-[1.05]">
            Less Searching.
            <br />
            <span className="font-serif italic font-normal text-[#11120F] underline decoration-[#C5FF35] decoration-4 underline-offset-4">
              More Showing Up.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            PartyPadi strips out the hassle of campus event ticketing so you and your people can focus on being where things happen.
          </p>
        </div>

        {/* 3 Concise Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-5 sm:p-8 bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl flex flex-col justify-between space-y-6 sm:space-y-8 hover:border-[#11120F] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-xs"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 sm:pb-4">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#11120F]">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                    {step.name}
                  </span>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#11120F]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-neutral-100 space-y-2">
                {step.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-neutral-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#11120F] shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Pass Demo Showcase */}
        <div className="bg-neutral-50/60 border border-neutral-200 rounded-[38px] p-6 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 font-semibold">
                  PRODUCT INTERFACE // DIGITAL PASS ENGINE
                </span>
                <h3 className="font-display font-black text-2xl sm:text-4xl text-[#11120F] leading-tight">
                  Designed for the gate rush.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  When 400 students arrive at the venue at 8:00 PM, network connectivity drops and paper tickets get lost. PartyPadi digital passes operate smoothly offline with tamper-proof cryptographic QR tokens.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("pass")}
                  className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full border transition-all ${
                    activeTab === "pass"
                      ? "bg-[#11120F] text-white border-[#11120F] shadow-sm"
                      : "bg-white text-neutral-600 border-neutral-200 hover:text-[#11120F]"
                  }`}
                >
                  Attendee Digital Pass
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("scan")}
                  className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full border transition-all ${
                    activeTab === "scan"
                      ? "bg-[#11120F] text-white border-[#11120F] shadow-sm"
                      : "bg-white text-neutral-600 border-neutral-200 hover:text-[#11120F]"
                  }`}
                >
                  Door Scanner View
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-neutral-600">
                <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
                  <span className="font-mono text-[10px] text-neutral-400 block uppercase">SCAN SPEED</span>
                  <span className="font-bold text-base text-[#11120F]">Under 1.2s</span>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
                  <span className="font-mono text-[10px] text-neutral-400 block uppercase">DUPLICATE ENTRY</span>
                  <span className="font-bold text-base text-[#11120F]">Zero Tolerance</span>
                </div>
              </div>
            </div>

            {/* Right: Realistic Ticket or Scanner View */}
            <div className="lg:col-span-6 flex justify-center">
              {activeTab === "pass" ? (
                /* Attendee Pass Mockup */
                <div className="w-full max-w-sm bg-white border border-neutral-300 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#11120F]">
                        PARTYPADI PASS
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400 bg-neutral-100 rounded-full px-2.5 py-0.5">
                      PADI-2026-884
                    </span>
                  </div>

                  <div className="py-5 space-y-2">
                    <span className="text-[10px] font-mono text-[#7C3AED] uppercase font-bold tracking-wider block">
                      SEMESTER OPENER
                    </span>
                    <h4 className="font-display font-black text-xl text-[#11120F] leading-tight">
                      AFTER CLASS: Sunset Sessions
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Mini Stadium Lawn, Main Campus
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-3.5 border-y border-dashed border-neutral-200 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-400 block uppercase">HOLDER</span>
                      <span className="font-bold text-[#11120F]">Oluwaseun Bakare</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-neutral-400 block uppercase">TIER</span>
                      <span className="font-bold text-[#11120F]">Regular Pass</span>
                    </div>
                  </div>

                  <div className="pt-5 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-[#11120F] rounded-2xl p-2.5 flex items-center justify-center relative shadow-md">
                      <QrCode className="w-full h-full text-[#C5FF35]" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-2.5">
                      READY TO SCAN AT MAIN GATE
                    </span>
                  </div>
                </div>
              ) : (
                /* Gate Scanner Mockup */
                <div className="w-full max-w-sm bg-[#11120F] border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-4">
                  <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-ping" />
                      <span className="font-mono text-[10px] font-bold text-[#C5FF35] uppercase tracking-wider">
                        GATE SCANNER: ACTIVE
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400 bg-neutral-900 rounded-full px-2.5 py-0.5">
                      BATTERY 94%
                    </span>
                  </div>

                  <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl text-center space-y-2.5">
                    <div className="w-11 h-11 rounded-full bg-[#C5FF35] text-[#11120F] mx-auto flex items-center justify-center font-bold shadow-sm">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h5 className="font-display font-bold text-lg text-white">
                      PASS VALIDATED
                    </h5>
                    <p className="text-xs text-neutral-300">
                      Tade Adebayo · Law Faculty · VIP Pass #402
                    </p>
                    <span className="inline-block text-[10px] font-mono text-neutral-400">
                      Checked in at 19:42:15 WAT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 bg-neutral-900/70 border border-neutral-800 rounded-xl">
                      <span className="text-[9px] font-mono text-neutral-400 block uppercase">TOTAL ADMITTED</span>
                      <span className="font-mono text-lg font-bold text-[#C5FF35]">312 / 400</span>
                    </div>
                    <div className="p-3 bg-neutral-900/70 border border-neutral-800 rounded-xl">
                      <span className="text-[9px] font-mono text-neutral-400 block uppercase">DOOR REJECTION</span>
                      <span className="font-mono text-lg font-bold text-white">0</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
