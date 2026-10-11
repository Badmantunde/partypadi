"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HostEventModal } from "@/components/HostEventModal";
import {
  QrCode,
  Smartphone,
  ShieldCheck,
  Zap,
  CreditCard,
  Users,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"students" | "organizers">("students");
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [scannerStatus, setScannerStatus] = useState<"idle" | "scanning" | "verified">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const simulateScan = () => {
    setScannerStatus("scanning");
    setTimeout(() => {
      setScannerStatus("verified");
      setTimeout(() => {
        setScannerStatus("idle");
      }, 3500);
    }, 600);
  };

  const faqs = [
    {
      q: "What happens if there is no internet connection at the event venue?",
      a: "That is precisely why we built PartyPadi. Our gate scanning engine operates 100% offline using cryptographic local mesh tokens. Marshalls do not need active cellular data to verify genuine student passes and prevent duplicates.",
    },
    {
      q: "Can someone take a screenshot of my ticket and enter before me?",
      a: "No. PartyPadi passes use dynamic time-signature rotation that regenerates security tokens every 30 seconds. A forwarded screenshot taken 5 minutes earlier is immediately flagged as invalid at the gate scanner.",
    },
    {
      q: "How do event organizers receive their ticket money?",
      a: "Each organizer gets a dedicated virtual account. When a student purchases a ticket, funds drop directly and immediately into the organizer's account balance in real time. Organizers can withdraw their money directly to their payout bank account (GTBank, Access, Kuda, Moniepoint, OPay, etc.) anytime.",
    },
    {
      q: "What payment methods are supported for students?",
      a: "Students can pay via debit cards (Mastercard, Visa, Verve), direct bank transfer, USSD codes (*737#, *901#, etc.), and instant OPay / Palmpay wallets.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#11120F] flex flex-col font-sans selection:bg-[#C5FF35] selection:text-[#11120F]">
      <Navbar onOpenHostModal={() => setHostModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section (Obsidian Full Width with Neon Accent - Like Organizer Page) */}
        <section className="py-20 sm:py-28 bg-[#0C0D0E] text-white border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>THE PARTYPADI PROTOCOL</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white leading-[1.05]">
              How it works. Fast, verified, and completely stress-free.
            </h1>

            <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Whether you are turning up with your friends or organizing the largest department gala of the year, here is how the magic happens.
            </p>

            {/* Track Switcher Pills */}
            <div className="inline-flex p-1.5 rounded-full bg-white/5 border border-white/15 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("students")}
                className={`px-6 py-2.5 rounded-full text-xs font-mono transition-all duration-200 ${
                  activeTab === "students"
                    ? "bg-[#C5FF35] text-black font-bold shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                For Students (Attending)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("organizers")}
                className={`px-6 py-2.5 rounded-full text-xs font-mono transition-all duration-200 ${
                  activeTab === "organizers"
                    ? "bg-[#C5FF35] text-black font-bold shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                For Organizers (Hosting)
              </button>
            </div>
          </div>
        </section>

        {/* Step-by-Step Flow Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === "students" ? (
              /* Student Flow */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 01</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Discover Verified Events</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Filter by your campus, faculty, or favorite event type. See ticket prices, lineup, dress codes, and real student interest.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 02</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Pay in 15 Seconds</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Zero account sign-up required. Checkout with your card, bank transfer, or USSD code. Immediate instant confirmation.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 03</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Get Offline Pass</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Your cryptographically signed pass is delivered instantly via WhatsApp, email, or Apple/Google Wallet. Works with 0 data.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 04</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Flash & Walk In</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Show your screen at the venue door. Scanners validate in &lt;0.8 seconds. Walk past the long ticket queues and enjoy the night.
                  </p>
                </div>
              </div>
            ) : (
              /* Organizer Flow */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 01</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Studio Creation</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Configure your event in under 2 minutes. Set multiple ticket tiers (Regular, VIP, Table for 5) with custom caps.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 02</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Campus Broadcast</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Your event is published immediately to our campus feed and ambassador distribution network across student hostel groups.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 03</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Offline Gate App</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Equip your gate marshalls with our scanner link. Zero duplicate passes, zero screenshot fraud, even without Wi-Fi.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <span className="text-xs font-mono text-[#C5FF35] font-bold">STEP 04</span>
                  <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-medium">Instant Bank Settlement</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Receive your ticket revenue directly into your designated bank account on event night. No waiting for weeks.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Interactive QR Gate Scanner Simulator Section */}
        <section className="py-20 bg-[#0C0D0E] text-white" id="scanner">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF35] font-semibold">
                INTERACTIVE DEMO
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
                Try the Sub-Second Gate Scanner
              </h2>
              <p className="text-sm text-neutral-400 max-w-xl mx-auto">
                Test how our cryptographic gate scanner verifies passes in real time without sending requests over congested cell networks.
              </p>
            </div>

            {/* Scanner Sandbox Device Frame */}
            <div className="max-w-md mx-auto rounded-3xl bg-[#16171A] border border-white/15 p-6 shadow-2xl space-y-6 text-center">
              {/* Virtual Scanner Viewfinder */}
              <div className="relative aspect-square w-full rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                {/* Crosshairs */}
                <div className="absolute inset-8 border border-white/20 rounded-xl pointer-events-none" />
                <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-[#C5FF35]" />
                <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-[#C5FF35]" />
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-[#C5FF35]" />
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-[#C5FF35]" />

                {scannerStatus === "idle" && (
                  <div className="space-y-3 p-4">
                    <QrCode className="w-16 h-16 mx-auto text-white/40" />
                    <p className="text-xs font-mono text-white/60">
                      POINT SCANNER AT TICKET OR CLICK BUTTON BELOW
                    </p>
                  </div>
                )}

                {scannerStatus === "scanning" && (
                  <div className="space-y-3 p-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-2 border-[#C5FF35] border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs font-mono text-[#C5FF35]">
                      DECRYPTING HMAC LOCAL TOKEN...
                    </p>
                  </div>
                )}

                {scannerStatus === "verified" && (
                  <div className="space-y-3 p-6 animate-in zoom-in-90 duration-200">
                    <div className="w-16 h-16 rounded-full bg-[#C5FF35] text-black flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(197,255,53,0.5)]">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase bg-[#C5FF35]/20 text-[#C5FF35] px-2.5 py-0.5 rounded-full font-bold">
                        VERIFIED ENTRY · 0.42s
                      </span>
                      <h4 className="text-lg font-display font-bold text-white">
                        Adekunle O. (Verified Pass)
                      </h4>
                      <p className="text-xs font-mono text-white/70">
                        Tier: VIP LOUNGE PASS · ADMIT 1
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Trigger Button */}
              <button
                type="button"
                onClick={simulateScan}
                disabled={scannerStatus !== "idle"}
                className="spicy-btn w-full py-3.5 bg-white text-black hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {scannerStatus === "idle"
                  ? "Simulate Student QR Scan ↗"
                  : scannerStatus === "scanning"
                  ? "Validating Pass..."
                  : "Pass Verified Successfully!"}
              </button>

              <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
                <span>Local Cryptographic Database: Sync 0ms latency</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section (Pure White) */}
        <section className="py-20 bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                QUESTIONS & ANSWERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="border border-neutral-200 rounded-2xl overflow-hidden transition-all bg-neutral-50/50"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-medium text-base text-[#11120F] hover:bg-neutral-100/50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-neutral-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA Bar */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
              Ready to create or discover events?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/events"
                className="spicy-btn px-8 py-3.5 bg-[#11120F] text-white rounded-full text-xs font-mono font-medium hover:bg-black transition-all shadow-md"
              >
                Browse Live Events →
              </Link>
              <Link
                href="/host"
                className="spicy-btn px-8 py-3.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full text-xs font-mono font-medium transition-all"
              >
                Open Host Studio ↗
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
