"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HostEventModal } from "@/components/HostEventModal";
import {
  Users,
  CreditCard,
  Building,
} from "lucide-react";

export default function OrganizersPage() {
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(3000);
  const [expectedAttendees, setExpectedAttendees] = useState(500);

  // Revenue calculation
  const grossRevenue = ticketPrice * expectedAttendees;
  const platformFee = Math.round(grossRevenue * 0.045);
  const netEarnings = grossRevenue - platformFee;

  return (
    <div className="min-h-screen bg-white text-[#11120F] flex flex-col font-sans selection:bg-[#C5FF35] selection:text-[#11120F]">
      <Navbar onOpenHostModal={() => setHostModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section (Obsidian Full Width with Neon Accent) */}
        <section className="py-20 sm:py-28 bg-[#0C0D0E] text-white border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>THE CAMPUS EVENT INFRASTRUCTURE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white leading-[1.05]">
              Sell out your event without the WhatsApp stress.
            </h1>

            <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Designed for student association executives, departmental committees, and independent promoters across Nigerian universities.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/host"
                className="spicy-btn px-8 py-3.5 bg-white text-black hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2"
              >
                <span>Open Event Studio</span>
                <span>→</span>
              </Link>
              <a
                href="#calculator"
                className="spicy-btn px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-full text-xs font-mono font-medium"
              >
                Estimate Event Earnings ↓
              </a>
            </div>
          </div>
        </section>

        {/* Live Revenue Calculator Section (Pure White) */}
        <section className="py-20 bg-white border-b border-neutral-200" id="calculator">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                FINANCIAL TRANSPARENCY
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight">
                Live Campus Revenue Calculator
              </h2>
              <p className="text-sm text-neutral-600 max-w-xl mx-auto">
                No hidden charges. No upfront setup fees. Calculate how much your event will net directly into your bank account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-neutral-50 p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-sm">
              {/* Sliders Input (Col 1-7) */}
              <div className="md:col-span-7 space-y-8">
                {/* Ticket Price Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500 uppercase">Average Ticket Price</span>
                    <span className="text-base font-bold text-neutral-900">
                      ₦{ticketPrice.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={15000}
                    step={250}
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full accent-[#11120F] h-2 bg-neutral-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>₦500 (Free / Cheap)</span>
                    <span>₦7,500</span>
                    <span>₦15,000 (VIP / Gala)</span>
                  </div>
                </div>

                {/* Attendees Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500 uppercase">Expected Student Attendees</span>
                    <span className="text-base font-bold text-neutral-900">
                      {expectedAttendees.toLocaleString()} Students
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2500}
                    step={50}
                    value={expectedAttendees}
                    onChange={(e) => setExpectedAttendees(Number(e.target.value))}
                    className="w-full accent-[#11120F] h-2 bg-neutral-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>50 (Intimate)</span>
                    <span>1,200 (Department)</span>
                    <span>2,500+ (Campus Festival)</span>
                  </div>
                </div>
              </div>

              {/* Output Card (Col 8-12) */}
              <div className="md:col-span-5 bg-[#0C0D0E] text-white p-6 sm:p-8 rounded-2xl border border-neutral-800 space-y-6 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#C5FF35] tracking-widest font-bold">
                    ESTIMATED NET PAYOUT
                  </span>
                  <div className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                    ₦{netEarnings.toLocaleString()}
                  </div>
                  <span className="text-xs text-neutral-400">
                    Disbursed directly on event night
                  </span>
                </div>

                <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-neutral-400">
                    <span>Gross Sales:</span>
                    <span className="text-white">₦{grossRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>PartyPadi Fee (4.5%):</span>
                    <span className="text-neutral-400">-₦{platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Card Processing:</span>
                    <span className="text-[#C5FF35]">₦0 (Included)</span>
                  </div>
                </div>

                <Link
                  href="/host"
                  className="spicy-btn block w-full py-3 text-center bg-[#C5FF35] text-black font-mono text-xs font-bold rounded-full hover:bg-white transition-all shadow-md"
                >
                  Create Event with This Setup →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Association & Faculty Features */}
        <section className="py-20 bg-neutral-50 border-b border-neutral-200" id="faculty">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold block">
                BUILT FOR STUDENT EXECUTIVES
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight">
                Everything department associations need to stay accountable.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-medium">Faculty Bank Multi-Sign</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Support for departmental official accounts (President, General Secretary, Financial Sec). Transparent real-time reporting to avoid auditing issues.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-medium">Matric & Level Restrictions</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Restrict ticket sales strictly to your department or graduating class. Students verify with their matric number before checkout.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-neutral-200 space-y-4 shadow-sm" id="payouts">
                <div className="w-10 h-10 rounded-full bg-[#11120F] text-[#C5FF35] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-medium">Same-Night Bank Settlement</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Funds settle directly into your bank on event night, so you can pay caterers, MCs, DJs, and venue management without cash delays.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Bar */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
              Ready to publish your next campus event?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/host"
                className="spicy-btn px-8 py-3.5 bg-[#11120F] text-white rounded-full text-xs font-mono font-medium hover:bg-black transition-all shadow-md"
              >
                Launch in Creator Studio →
              </Link>
              <Link
                href="/events"
                className="spicy-btn px-8 py-3.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full text-xs font-mono font-medium transition-all"
              >
                View Live Campus Feed ↗
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
