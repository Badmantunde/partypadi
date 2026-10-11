"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

type HostStep = "essentials" | "tiers" | "gate" | "payout";

export default function HostEventStudioPage() {
  const [activeStep, setActiveStep] = useState<HostStep>("essentials");
  const [activeTabNav, setActiveTabNav] = useState("Overview");

  // Form states
  const [eventTitle, setEventTitle] = useState("OOU All-White Freshers Welcome Rave");
  const [selectedCampus, setSelectedCampus] = useState("OOU (Ago-Iwoye)");
  const [selectedCategory, setSelectedCategory] = useState("Party & Rave");
  const [venue, setVenue] = useState("Club Vegas, Off-Campus Ring Road");
  const [eventDate, setEventDate] = useState("2026-11-20");
  const [eventTime, setEventTime] = useState("20:00");
  const [regularPrice, setRegularPrice] = useState(3500);
  const [regularCapacity, setRegularCapacity] = useState(600);
  const [vipPrice, setVipPrice] = useState(10000);
  const [vipCapacity, setVipCapacity] = useState(80);
  const [bankName, setBankName] = useState("GTBank (Guaranty Trust)");
  const [accountNumber, setAccountNumber] = useState("0124982736");
  const [accountName, setAccountName] = useState("ADEKUNLE OLAOLUWA (STUDENT REP)");
  const [scannerRepEmail, setScannerRepEmail] = useState("headgate@ooufreshers.ng");
  const [isPublished, setIsPublished] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculations (0% commission during campus launch - completely free)
  const grossPotential = regularPrice * regularCapacity + vipPrice * vipCapacity;
  const platformFee = 0;
  const netEarnings = grossPotential;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublished(true);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans selection:bg-[#C5FF35] selection:text-black">
      {/* Standard Universal Top Navbar */}
      <Navbar onOpenHostModal={() => {}} />

      <main className="flex-1">
        {/* Hero Section (Obsidian Full Width with Neon Accent - Like Organizer Page) */}
        <section className="py-20 sm:py-28 bg-[#0C0D0E] text-white border-b border-white/10 mb-8 sm:mb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>OFFICIAL CREATOR STUDIO DASHBOARD</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-white leading-[1.05]">
              Publish your campus event with Swiss precision.
            </h1>

            <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Automated ticket tiers, sub-second offline gate scanners, and instant virtual account payouts directly to your Nigerian bank account.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#studio-canvas"
                className="spicy-btn px-8 py-3.5 bg-white text-black hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-2"
              >
                <span>Jump to Creator Studio</span>
                <span>↓</span>
              </a>
              <Link
                href="/organizers"
                className="spicy-btn px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-full text-xs font-mono font-medium"
              >
                Organizer Guidelines ↗
              </Link>
            </div>
          </div>
        </section>

        {/* Main Studio Frame inspired directly by Reference 1 */}
        <div id="studio-canvas" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Breadcrumb & Studio Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <Link href="/" className="hover:text-white transition-colors">
                HOME
              </Link>
              <span>/</span>
              <span className="text-[#C5FF35]">STUDIO DASHBOARD</span>
              <span>/</span>
              <span className="text-white/80">CREATE NEW EVENT</span>
            </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] animate-ping" />
            <span>CAMPUS GATE TELEMETRY: ACTIVE</span>
          </div>
        </div>

        {/* Studio Bento Master Canvas - Matching Reference 1 */}
        <div className="relative rounded-3xl lg:rounded-[36px] bg-[#0E1013] border border-white/10 shadow-2xl overflow-hidden">
          {/* Top Embedded Studio Bar (as seen in Reference 1) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-4 sm:py-5 border-b border-white/10 bg-[#0E1013]/90 backdrop-blur-md">
            {/* Left: Star Mark & Pills */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5FF35]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-sm tracking-tight text-white">
                  PartyPadi Studio
                </span>
              </div>

              {/* Capsule Navigation Pills from Reference 1 */}
              <div className="hidden sm:inline-flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono">
                {["Overview", "Ticket Tiers", "Gate Scanner", "Bank Payouts"].map(
                  (tab) => {
                    const isActive = activeTabNav === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTabNav(tab)}
                        className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                          isActive
                            ? "bg-white text-black font-semibold shadow-sm"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <Link
                href="/events"
                className="text-xs font-mono px-3.5 py-1.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-1.5"
              >
                <span>Live Feed</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/organizers"
                className="spicy-btn text-xs font-mono font-medium px-4 py-1.5 rounded-full bg-white text-black hover:bg-[#F5F5F0] transition-all"
              >
                Log In ↗
              </Link>
            </div>
          </div>

          {/* Two-Column Master Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
            {/* Left Side: Iridescent Liquid Chromatic Art + Glassmorphic Card (Ref 1) */}
            <div className="lg:col-span-6 relative min-h-[480px] lg:min-h-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              {/* High-res Iridescent Metallic Texture Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/iridescent_fluid_host_art.jpg"
                  alt="PartyPadi Iridescent Fluid Studio Artwork"
                  fill
                  className="object-cover object-center scale-105 filter brightness-95"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
              </div>

              {/* Top Card Floating Indicator */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white/90">
                  <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-pulse" />
                  <span>PREVIEW: {selectedCampus.split(" ")[0]} TICKET PASS</span>
                </div>
                <div className="text-[11px] font-mono text-white/70 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                  ₦{regularPrice.toLocaleString()} / PASS
                </div>
              </div>

              {/* Floating Glassmorphism Hero Card (As exact in Reference 1) */}
              <div className="relative z-10 mt-auto rounded-3xl p-6 sm:p-8 bg-black/40 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-5">
                {/* Community Avatars Cluster + Label */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border-2 border-[#0E1013] flex items-center justify-center text-[10px] font-bold text-white shadow">
                      OA
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C5FF35] to-emerald-600 border-2 border-[#0E1013] flex items-center justify-center text-[10px] font-bold text-black shadow">
                      DJ
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 border-2 border-[#0E1013] flex items-center justify-center text-[10px] font-bold text-white shadow">
                      SU
                    </div>
                  </div>
                  <span className="text-xs font-mono text-white/80 tracking-tight">
                    4,500+ active campus organizers
                  </span>
                </div>

                {/* Big Bold Dynamic Headline */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5FF35] font-semibold">
                    CURRENT EVENT DRAFT
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight leading-snug line-clamp-2">
                    {eventTitle || "Welcome to our Campus Studio"}
                  </h3>
                </div>

                {/* Event Location & Date Sub-Meta */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono text-white/70 border-t border-white/10">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#C5FF35] shrink-0" />
                    <span className="truncate">{venue || "Venue not set"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C5FF35] shrink-0" />
                    <span>{eventDate}</span>
                  </div>
                </div>

                {/* Circular Glass Concentric Arrow Button from Reference 1 */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                    <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
                    <span>Instant Virtual Account Settlement</span>
                  </div>

                  <div className="relative group cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#C5FF35] group-hover:text-black group-hover:scale-105 shadow-xl">
                      <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    {/* Subtle concentric ripple ring */}
                    <div className="absolute -inset-1.5 rounded-full border border-white/10 pointer-events-none animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Dark Studio Canvas with Swiss Layout & Interactive Flow */}
            <div className="lg:col-span-6 bg-[#0C0D0E] p-6 sm:p-10 flex flex-col justify-between space-y-8">
              {/* Studio Header Copy from Reference 1 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#C5FF35] font-bold">
                    OFFICIAL HOSTING DASHBOARD
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium tracking-tight text-white leading-[1.08]">
                    Hosting is less stressing with PartyPadi.
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed max-w-xl">
                  Automated ticket tiers, offline gate scanners with zero fraud,
                  and direct bank payouts to your Nigerian account within minutes of showtime.
                </p>

                {/* Campus & Technology Pill Badges (resembling crypto tags in Reference 1) */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "🏛 OOU (Ago-Iwoye)",
                    "🌊 UNILAG (Akoka)",
                    "🎓 UI (Ibadan)",
                    "⚡ LASU (Ojo)",
                    "⚡ Instant Virtual Accounts",
                    "📱 0.8s Offline Scan",
                    "+12 More Campuses",
                  ].map((pill) => {
                    const isSelected = selectedCampus === pill;
                    return (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => {
                          if (pill.includes("OOU") || pill.includes("UNILAG") || pill.includes("UI") || pill.includes("LASU")) {
                            setSelectedCampus(pill);
                          }
                        }}
                        className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? "bg-[#C5FF35] text-black font-semibold border-[#C5FF35]"
                            : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {pill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Tabs Indicator */}
              {!isPublished && (
                <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-4 sm:p-6 space-y-6">
                  {/* Step Selector Pills */}
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl text-center text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveStep("essentials")}
                      className={`py-2 px-1 rounded-lg transition-all ${
                        activeStep === "essentials"
                          ? "bg-white text-black font-semibold shadow"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      1. Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep("tiers")}
                      className={`py-2 px-1 rounded-lg transition-all ${
                        activeStep === "tiers"
                          ? "bg-white text-black font-semibold shadow"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      2. Tiers
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep("gate")}
                      className={`py-2 px-1 rounded-lg transition-all ${
                        activeStep === "gate"
                          ? "bg-white text-black font-semibold shadow"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      3. Scanner
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep("payout")}
                      className={`py-2 px-1 rounded-lg transition-all ${
                        activeStep === "payout"
                          ? "bg-white text-black font-semibold shadow"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      4. Payout
                    </button>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handlePublish} className="space-y-4">
                    {/* Step 1: Essentials */}
                    {activeStep === "essentials" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Event Title
                          </label>
                          <input
                            type="text"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="e.g. Faculty of Science Dinner & Awards"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              Campus
                            </label>
                            <select
                              value={selectedCampus}
                              onChange={(e) => setSelectedCampus(e.target.value)}
                              className="w-full bg-[#161719] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                            >
                              <option value="OOU (Ago-Iwoye)">OOU (Ago-Iwoye - Active)</option>
                              <option value="UNILAG (Akoka)">UNILAG (Akoka - Next)</option>
                              <option value="UI (Ibadan)">UI (Ibadan)</option>
                              <option value="LASU (Ojo)">LASU (Ojo)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              Category
                            </label>
                            <select
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-full bg-[#161719] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                            >
                              <option value="Party & Rave">Party & Rave</option>
                              <option value="Concert & Live Show">Concert & Live Show</option>
                              <option value="Gala & Department Dinner">Gala & Department Dinner</option>
                              <option value="Department Week">Department Week</option>
                              <option value="Hangout & Beach">Hangout & Beach</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Venue / Hall
                          </label>
                          <input
                            type="text"
                            value={venue}
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="e.g. Ago-Iwoye Sports Complex or Otunba Gbenga Koya Hall"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              Date
                            </label>
                            <input
                              type="date"
                              value={eventDate}
                              onChange={(e) => setEventDate(e.target.value)}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              Time
                            </label>
                            <input
                              type="time"
                              value={eventTime}
                              onChange={(e) => setEventTime(e.target.value)}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveStep("tiers")}
                            className="spicy-btn px-5 py-2 rounded-full bg-white text-black text-xs font-mono font-semibold flex items-center gap-1.5"
                          >
                            <span>Next: Set Tiers</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Tiers & Pricing */}
                    {activeStep === "tiers" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              Regular Ticket (₦)
                            </label>
                            <input
                              type="number"
                              value={regularPrice}
                              onChange={(e) => setRegularPrice(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              Regular Capacity
                            </label>
                            <input
                              type="number"
                              value={regularCapacity}
                              onChange={(e) => setRegularCapacity(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              VIP Pass (₦)
                            </label>
                            <input
                              type="number"
                              value={vipPrice}
                              onChange={(e) => setVipPrice(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                              VIP Capacity
                            </label>
                            <input
                              type="number"
                              value={vipCapacity}
                              onChange={(e) => setVipCapacity(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                            />
                          </div>
                        </div>

                        {/* Live Revenue Forecast */}
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                            <span>GROSS REVENUE POTENTIAL:</span>
                            <span className="text-white font-bold">₦{grossPotential.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                            <span>PARTYPADI COMMISSION (0% LAUNCH):</span>
                            <span className="text-[#C5FF35] font-bold">₦0 (WAIVED)</span>
                          </div>
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white">
                            <span className="text-[#C5FF35] font-bold">ESTIMATED NET PAYOUT:</span>
                            <span className="text-[#C5FF35] text-sm font-bold">
                              ₦{netEarnings.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setActiveStep("essentials")}
                            className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs font-mono"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveStep("gate")}
                            className="spicy-btn px-5 py-2 rounded-full bg-white text-black text-xs font-mono font-semibold flex items-center gap-1.5"
                          >
                            <span>Next: Gate Scanner</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Gate Scanner */}
                    {activeStep === "gate" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Head Gate Marshall / Usher Email
                          </label>
                          <input
                            type="email"
                            value={scannerRepEmail}
                            onChange={(e) => setScannerRepEmail(e.target.value)}
                            placeholder="bouncers@campusparty.com"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                            required
                          />
                          <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                            They will receive a 1-tap offline scanner link valid for this event.
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#C5FF35] shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-xs font-mono font-semibold text-white block">
                                Anti-Duplicate Cryptographic Verification
                              </span>
                              <p className="text-xs text-neutral-400 leading-relaxed">
                                Screenshots forwarded on WhatsApp are blocked automatically. Every scan syncs locally across offline usher phones in &lt;0.8 seconds.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setActiveStep("tiers")}
                            className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs font-mono"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveStep("payout")}
                            className="spicy-btn px-5 py-2 rounded-full bg-white text-black text-xs font-mono font-semibold flex items-center gap-1.5"
                          >
                            <span>Next: Banking Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Banking Payout */}
                    {activeStep === "payout" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Settlement Bank
                          </label>
                          <select
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full bg-[#161719] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-sans"
                          >
                            <option value="GTBank (Guaranty Trust)">GTBank (Guaranty Trust)</option>
                            <option value="Access Bank PLC">Access Bank PLC</option>
                            <option value="Kuda Microfinance Bank">Kuda Microfinance Bank</option>
                            <option value="Zenith Bank">Zenith Bank</option>
                            <option value="Opay Digital Services">Opay Digital Services</option>
                            <option value="Moniepoint MFB">Moniepoint MFB</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Account Number
                          </label>
                          <input
                            type="text"
                            maxLength={10}
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35] font-mono tracking-wider"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Verified Beneficiary Name
                          </label>
                          <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white/90 font-mono"
                            readOnly
                          />
                          <p className="text-[11px] text-[#C5FF35] mt-1 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Beneficiary account verified for instant withdrawals</span>
                          </p>
                        </div>

                        <div className="pt-2 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setActiveStep("gate")}
                            className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-xs font-mono"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="spicy-btn px-6 py-2.5 rounded-full bg-[#C5FF35] text-black text-xs font-mono font-bold flex items-center gap-2 hover:bg-white transition-all shadow-[0_0_25px_rgba(197,255,53,0.35)]"
                          >
                            <span>Ready to Launch</span>
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Published Success Card */}
              {isPublished && (
                <div className="border border-[#C5FF35]/30 rounded-2xl bg-[#C5FF35]/10 p-6 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 text-[#C5FF35]">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-display font-bold text-lg">
                      Event Published Live on {selectedCampus.split(" ")[0]}!
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Your event page is live. Students can now purchase tickets directly on PartyPadi. Your door marshalls have been provisioned with cryptographic gate pass tokens.
                  </p>
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="truncate text-white/80">
                      partypadi.com/events/oou-freshers-rave-2026
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-1 bg-white/10 hover:bg-white text-white hover:text-black rounded-lg transition-colors shrink-0 ml-2"
                    >
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href="/events"
                      className="spicy-btn px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold"
                    >
                      View on Campus Feed →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsPublished(false)}
                      className="px-4 py-2.5 rounded-full border border-white/20 text-white/80 font-mono text-xs hover:bg-white/5"
                    >
                      Edit Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Canvas Controls (Exact match to Reference 1 bottom bar) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                {/* Metric pill with icon badge from Reference 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C5FF35]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-mono font-bold text-white">
                      More than ₦45M+
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Tickets Processed Daily on Campus
                    </div>
                  </div>
                </div>

                {/* Big White Capsule CTA Button from Reference 1 */}
                {!isPublished ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeStep !== "payout") {
                        setActiveStep("payout");
                      } else {
                        setIsPublished(true);
                      }
                    }}
                    className="spicy-btn w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-[#F5F5F0] rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 group transition-all"
                  >
                    <span>Publish your event now!</span>
                    <span className="text-base leading-none transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/events"
                    className="spicy-btn w-full sm:w-auto px-8 py-3.5 bg-[#C5FF35] text-black hover:bg-white rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(197,255,53,0.35)] flex items-center justify-center gap-2 group transition-all"
                  >
                    <span>Go to Campus Feed</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid beneath the Studio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C5FF35] uppercase">
              01 // ANTI-SCALPING
            </span>
            <h4 className="font-display font-medium text-lg text-white">
              Dynamic QR Tokens
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every pass is generated with rotating HMAC signatures that refresh every 30 seconds. Screenshots cannot be shared to gatecrash.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C5FF35] uppercase">
              02 // SPEED AT THE DOOR
            </span>
            <h4 className="font-display font-medium text-lg text-white">
              Sub-second Offline Check-in
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              When bad weather or 2,000 students jam the campus cell tower, PartyPadi’s offline local mesh scanner continues validating tickets instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#C5FF35] uppercase">
              03 // REAL-TIME VIRTUAL ACCOUNTS
            </span>
            <h4 className="font-display font-medium text-lg text-white">
              Instant Drop & Anytime Withdrawal
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ticket proceeds drop directly into your dedicated virtual account in real time. Withdraw your money to your Nigerian payout account anytime.
            </p>
          </div>
        </div>
        </div>
      </main>

      {/* Universal Footer */}
      <Footer onOpenHostModal={() => {}} />
    </div>
  );
}
