"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useToast } from "./Toast";
import { Users, Split, Car, Check, QrCode } from "lucide-react";

export function PadiCircle() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsJoined(true);
    showToast({
      type: "success",
      title: "Waitlist Confirmed",
      message: `${email} is on the priority list for Padi Circle beta testing!`,
    });
  };

  const pillars = [
    {
      icon: Users,
      title: "Clique RSVPs",
      description:
        "See which events your department course mates and close friends are attending before you buy your pass.",
    },
    {
      icon: Split,
      title: "Split Table Bills",
      description:
        "Coordinate and split VIP tables or party packages seamlessly between 4 to 8 friends with automatic split links.",
    },
    {
      icon: Car,
      title: "Campus Rides & Shuttles",
      description:
        "Coordinate shared rides from Ago-Iwoye campus gates to off-campus party lounges safely as a group.",
    },
  ];

  return (
    <section id="padi-circle" className="w-full py-20 sm:py-28 bg-[#0C0D0E] text-[#F5F5F0] border-y border-neutral-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-neutral-800">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>PREVIEW // SOCIAL ARCHITECTURE</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.05]">
              Make Plans{" "}
              <br />
              <span className="font-serif italic font-normal text-[#C5FF35]">With Your People.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Going to events alone is good, but rolling up with your clique is what creates unforgettable university memories. Padi Circle is our upcoming social coordination layer.
            </p>
            <span className="inline-block px-3.5 py-1 bg-white/5 text-white/80 text-[10px] font-mono uppercase tracking-wider rounded-full border border-white/10">
              LAUNCHING NEXT SEMESTER
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Pillars + Visual Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3 Pillars (Col 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-start gap-4 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#C5FF35] flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-medium text-base sm:text-lg text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Documentary Card with Floating Squad Pass (Col 8-12) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/4.5] bg-[#11120F] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/friends-linkup.jpg"
                alt="Nigerian university friends sharing digital tickets on campus lawn"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover filter contrast-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-[10px] font-mono uppercase bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  PADI CIRCLE // PROTOTYPE
                </span>
                <span className="w-2.5 h-2.5 bg-[#C5FF35] rounded-full animate-ping" />
              </div>

              {/* Floating Translucent Squad Pass */}
              <div className="absolute bottom-4 left-4 right-4 p-5 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 text-white space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/20">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white">
                      SQUAD PASS // 4 SEATS
                    </span>
                  </div>
                  <span className="font-mono text-[10px] bg-[#C5FF35] text-black px-2 py-0.5 rounded-full font-bold">
                    SPLIT ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-display font-bold text-sm">
                      Law Gala Table Share
                    </h5>
                    <p className="text-[11px] text-white/70">
                      ₦9,500 / person · 4 of 4 paid
                    </p>
                  </div>

                  <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shrink-0 shadow-xs">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Early Access / Waitlist Bar */}
        <div className="bg-[#151614] border border-neutral-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display font-medium text-base sm:text-lg text-white">
              Want early access to Padi Circle?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400">
              Join the student preview list. We&apos;ll notify you when squad features drop at your university.
            </p>
          </div>

          {isJoined ? (
            <div className="flex items-center gap-2 px-5 py-3 bg-neutral-900 border border-neutral-800 text-[#C5FF35] text-xs font-mono rounded-full shadow-sm">
              <Check className="w-4 h-4" />
              <span>You&apos;re on the priority waitlist!</span>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter student email..."
                className="px-5 py-3 text-xs bg-[#0E0F0C] border border-neutral-800 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] w-full md:w-72 shadow-xs transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#C5FF35] text-[#11120F] hover:bg-[#b4f323] rounded-full text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all shadow-xs hover:scale-[1.02]"
              >
                Get Priority
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
