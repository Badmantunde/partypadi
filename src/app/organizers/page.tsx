"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HostEventModal } from "@/components/HostEventModal";
import { GiftSupportModal } from "@/components/GiftSupportModal";
import { useAuth, getOrganizerMilestones } from "@/context/AuthContext";
import {
  Users,
  CreditCard,
  Building,
  Heart,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Crown,
} from "lucide-react";

export default function OrganizersPage() {
  const { gifts } = useAuth();
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState<{ id?: string; name: string }>({
    id: "fassa_execs",
    name: "FASSA Social Committee",
  });
  const [ticketPrice, setTicketPrice] = useState(3000);
  const [expectedAttendees, setExpectedAttendees] = useState(500);

  // Revenue calculation (0% commission for campus launch - 100% net to organizers)
  const grossRevenue = ticketPrice * expectedAttendees;
  const platformFee = 0;
  const netEarnings = grossRevenue;

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
                href="/organizer"
                className="spicy-btn px-8 py-3.5 bg-white text-black hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2"
              >
                <span>Open Organizer Studio</span>
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
                    <span>PartyPadi Commission:</span>
                    <span className="text-[#C5FF35] font-bold">₦0 (0% Waived)</span>
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
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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

        {/* Direct Organizer Support Directory */}
        <section className="py-20 bg-white border-b border-neutral-200" id="directory">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-mono uppercase tracking-wider font-bold">
                  <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                  <span>PADI GIFTER · DIRECT ORGANIZER SUPPORT</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-medium tracking-tight">
                  Support Campus Organizers Directly
                </h2>
                <p className="text-sm text-neutral-600 max-w-xl">
                  Show appreciation to the student committees and independent curators who build campus culture. Direct gifts help them fund future events and logistics.
                </p>
              </div>

              <Link
                href="/leaderboard"
                className="spicy-btn px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <span>View Campus Leaderboards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "fassa_execs",
                  name: "FASSA Social Committee",
                  shortName: "FASSA Socials",
                  role: "Faculty Association Executive",
                  campus: "Main Campus",
                  avatar: "FS",
                  bio: "Official faculty social directorate coordinating faculty weeks, annual black-tie dinners, and campus linkups.",
                },
                {
                  id: "vibe_tribe",
                  name: "Vibe Tribe & Campus Socials",
                  shortName: "Vibe Tribe",
                  role: "Official Campus Promoter",
                  campus: "Main Campus",
                  avatar: "VT",
                  bio: "Pioneering sunset parties, sound clashes, and semester kickoffs across Nigerian campus culture.",
                },
                {
                  id: "soundhaus",
                  name: "SoundHaus Collective",
                  shortName: "SoundHaus",
                  role: "Independent Sound Curators",
                  campus: "Club Vegas & Garden",
                  avatar: "SH",
                  bio: "Underground afro-house, alte sounds, and nocturnal garden sessions powered by acoustic connoisseurs.",
                },
              ].map((org) => {
                const totalSupport = gifts
                  .filter(
                    (g) =>
                      g.organizerId === org.id ||
                      (g.organizerName && g.organizerName.includes(org.shortName))
                  )
                  .reduce((sum, g) => sum + g.amount, 0);
                const uniquePatrons = new Set(
                  gifts
                    .filter(
                      (g) =>
                        g.organizerId === org.id ||
                        (g.organizerName && g.organizerName.includes(org.shortName))
                    )
                    .map((g) => g.userId || g.gifterName)
                ).size;
                const milestones = getOrganizerMilestones(totalSupport, uniquePatrons);

                return (
                  <div
                    key={org.id}
                    className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-black transition-all space-y-5 flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#11120F] text-[#C5FF35] flex items-center justify-center text-xl font-bold">
                            {org.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-display font-bold text-base text-[#11120F]">
                                {org.name}
                              </h3>
                              <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                            </div>
                            <span className="text-xs font-mono text-neutral-500 block">
                              {org.role} · {org.campus}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {org.bio}
                      </p>

                      {/* Milestones Unlocked */}
                      <div className="space-y-2 pt-2 border-t border-neutral-200">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                          MILESTONE ACHIEVEMENTS:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {milestones.map((m) => (
                            <div
                              key={m.id}
                              className={`p-2 rounded-xl border text-[10px] font-mono ${
                                m.unlocked
                                  ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                                  : "bg-white border-neutral-200 text-neutral-400"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="shrink-0">
                                  {m.id === "first_gift" && <Sparkles className="w-3 h-3 text-neutral-800" />}
                                  {m.id === "crowd_favourite" && <Users className="w-3 h-3 text-amber-600" />}
                                  {m.id === "community_backed" && <ShieldCheck className="w-3 h-3 text-blue-600" />}
                                  {m.id === "campus_favourite" && <Crown className="w-3 h-3 text-purple-600" />}
                                </div>
                                <span className="truncate">{m.title}</span>
                              </div>
                              <span className="text-[9px] block text-neutral-500 truncate mt-0.5">
                                {m.unlocked ? "Unlocked" : m.requirement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Telemetry Stats */}
                      <div className="p-3 bg-white rounded-2xl border border-neutral-200 flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-500">Total Backing:</span>
                        <span className="font-bold text-[#11120F]">
                          ₦{totalSupport.toLocaleString()} ({uniquePatrons} Patrons)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrganizer({ id: org.id, name: org.name });
                        setGiftModalOpen(true);
                      }}
                      className="spicy-btn w-full py-3 bg-[#11120F] text-white hover:bg-neutral-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Gift {org.shortName}</span>
                    </button>
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

      {/* Direct Organizer Gift Modal */}
      <GiftSupportModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        organizerName={selectedOrganizer.name}
        organizerId={selectedOrganizer.id}
        initialType="direct_organizer_gift"
      />
    </div>
  );
}
