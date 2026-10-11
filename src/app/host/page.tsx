"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { CreatorTicketTier } from "@/types";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Lock,
  UserCheck,
  Building2,
  AlertCircle,
  Clock,
  Ticket,
} from "lucide-react";

type HostStep = "essentials" | "tiers" | "gate" | "payout";

interface PresetBanner {
  id: string;
  name: string;
  url: string;
}

const PRESET_BANNERS: PresetBanner[] = [
  {
    id: "fluid-art",
    name: "Chromatic Fluid",
    url: "/images/iridescent_fluid_host_art.jpg",
  },
  {
    id: "concert",
    name: "Concert Rave",
    url: "/images/concert-live.jpg",
  },
  {
    id: "dinner",
    name: "Gala & Dinner",
    url: "/images/dinner-gala.jpg",
  },
  {
    id: "linkup",
    name: "Campus Hangout",
    url: "/images/friends-linkup.jpg",
  },
];

export default function HostEventStudioPage() {
  const { currentUser, login, signup, openAuthModal } = useAuth();

  const [activeStep, setActiveStep] = useState<HostStep>("essentials");
  const [activeTabNav, setActiveTabNav] = useState("Overview");

  // Organizer auth gate state
  const [authGateTab, setAuthGateTab] = useState<"signin" | "register">("signin");
  const [gateEmailOrUser, setGateEmailOrUser] = useState("");
  const [gateOrgName, setGateOrgName] = useState("");
  const [gateUsername, setGateUsername] = useState("");
  const [gateEmail, setGateEmail] = useState("");
  const [gateCampus, setGateCampus] = useState("OOU Ago-Iwoye");
  const [gateBio, setGateBio] = useState("");
  const [authError, setAuthError] = useState("");

  // Event form states
  const [eventTitle, setEventTitle] = useState("OOU All-White Freshers Welcome Rave");
  const [selectedCampus, setSelectedCampus] = useState("OOU (Ago-Iwoye)");
  const [selectedCategory, setSelectedCategory] = useState("Party & Rave");
  const [venue, setVenue] = useState("Club Vegas, Off-Campus Ring Road");
  const [eventDate, setEventDate] = useState("2026-11-20");
  const [eventTime, setEventTime] = useState("20:00");
  const [bannerImageUrl, setBannerImageUrl] = useState("/images/iridescent_fluid_host_art.jpg");
  const [customBannerFileName, setCustomBannerFileName] = useState<string | null>(null);

  // Dynamic ticket tiers
  const [ticketTiers, setTicketTiers] = useState<CreatorTicketTier[]>([
    { id: "tier-early", name: "Early Bird", price: 2500, capacity: 150, description: "Limited first access passes" },
    { id: "tier-regular", name: "Regular Entry", price: 3500, capacity: 500, description: "General floor access & free cup" },
    { id: "tier-vip", name: "VIP Experience", price: 10000, capacity: 60, description: "Lounge seating & bottle service" },
  ]);

  // Banking & Gate states
  const [bankName, setBankName] = useState("GTBank (Guaranty Trust)");
  const [accountNumber, setAccountNumber] = useState("0124982736");
  const [accountName, setAccountName] = useState("ADEKUNLE OLAOLUWA (STUDENT REP)");
  const [scannerRepEmail, setScannerRepEmail] = useState("headgate@ooufreshers.ng");
  const [isPublished, setIsPublished] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculation of Gross & Net Revenue across all dynamic tiers
  const grossPotential = ticketTiers.reduce((acc, tier) => acc + (tier.price || 0) * (tier.capacity || 0), 0);
  const platformFee = 0; // 0% Launch fee
  const netEarnings = grossPotential;

  // Banner file upload handler
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomBannerFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setBannerImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new ticket tier
  const handleAddTier = () => {
    const tierNumber = ticketTiers.length + 1;
    const newTier: CreatorTicketTier = {
      id: `tier-${Date.now()}`,
      name: `Tier ${tierNumber} Pass`,
      price: 5000,
      capacity: 100,
      description: "Access pass with custom perks",
    };
    setTicketTiers([...ticketTiers, newTier]);
  };

  // Update existing tier
  const handleUpdateTier = (id: string, field: keyof CreatorTicketTier, value: any) => {
    setTicketTiers(
      ticketTiers.map((tier) => {
        if (tier.id === id) {
          return { ...tier, [field]: value };
        }
        return tier;
      })
    );
  };

  // Remove tier
  const handleRemoveTier = (id: string) => {
    if (ticketTiers.length <= 1) return;
    setTicketTiers(ticketTiers.filter((tier) => tier.id !== id));
  };

  // Quick Organizer Demo Login
  const handleDemoOrganizerLogin = () => {
    const success = login("fassa_execs");
    if (success) {
      setAuthError("");
    }
  };

  // Handle Gate Sign In
  const handleGateSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!gateEmailOrUser.trim()) {
      setAuthError("Please enter your organizer email or username");
      return;
    }
    const success = login(gateEmailOrUser.trim());
    if (!success) {
      setAuthError("No account found with those credentials. Try '@fassa_execs' or register below.");
    }
  };

  // Handle Gate Register
  const handleGateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!gateOrgName.trim() || !gateUsername.trim() || !gateEmail.trim()) {
      setAuthError("Please complete all required fields.");
      return;
    }
    const success = signup({
      fullName: gateOrgName.trim(),
      username: gateUsername.trim().replace(/^@/, "").toLowerCase(),
      email: gateEmail.trim(),
      role: "organizer",
      campus: gateCampus,
      bio: gateBio.trim() || "Campus event organizer on PartyPadi",
    });
    if (!success) {
      setAuthError("Username or email already in use. Try logging in instead.");
    }
  };

  // Upgrade partygoer to organizer
  const handleUpgradeToOrganizer = () => {
    if (!currentUser) return;
    signup({
      fullName: currentUser.fullName,
      username: currentUser.username,
      email: currentUser.email,
      role: "organizer",
      campus: currentUser.campus,
      bio: currentUser.bio || "Campus event organizer on PartyPadi",
    });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublished(true);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isOrganizer = currentUser?.role === "organizer";

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans selection:bg-[#C5FF35] selection:text-black">
      {/* Standard Universal Top Navbar */}
      <Navbar onOpenHostModal={() => {}} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 bg-[#0C0D0E] text-white border-b border-white/10 mb-8 sm:mb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
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

            {currentUser && isOrganizer && (
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#C5FF35]/10 border border-[#C5FF35]/30 text-xs font-mono text-[#C5FF35]">
                <UserCheck className="w-4 h-4" />
                <span>
                  Authenticated as <strong>@{currentUser.username}</strong> ({currentUser.fullName}) · {currentUser.campus}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Main Studio Frame */}
        <div id="studio-canvas" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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

          {/* AUTHENTICATION GATE CHECK */}
          {!currentUser || !isOrganizer ? (
            <div className="rounded-3xl lg:rounded-[36px] bg-[#0E1013] border border-white/15 p-6 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5FF35]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-2xl mx-auto space-y-8 relative z-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-[#C5FF35] mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono tracking-widest uppercase text-[#C5FF35] font-bold">
                    ORGANIZER ACCESS GATE
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
                    Sign in to access the Creator Studio
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                    To create events, add custom ticket tiers, and configure door scanner access, please sign in or register as an approved campus organizer.
                  </p>
                </div>

                {/* If user is already logged in as a partygoer */}
                {currentUser && currentUser.role === "partygoer" && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>CURRENTLY SIGNED IN AS PARTYGOER (@{currentUser.username})</span>
                    </div>
                    <p className="text-xs text-neutral-300">
                      You are signed in as a student attendee. Upgrade this profile to an Organizer account to host events, or switch to an organizer account below.
                    </p>
                    <button
                      type="button"
                      onClick={handleUpgradeToOrganizer}
                      className="px-4 py-2 bg-amber-400 text-black text-xs font-mono font-bold rounded-xl hover:bg-amber-300 transition-all"
                    >
                      Upgrade @{currentUser.username} to Organizer
                    </button>
                  </div>
                )}

                {/* Quick 1-Click Demo Login as Approved Campus Organizer */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C5FF35] text-[#0C0D0E] font-bold text-sm flex items-center justify-center">
                        FA
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm text-white">
                          FASSA Social Directorate
                        </div>
                        <div className="text-xs font-mono text-neutral-400">
                          @fassa_execs · Verified Organizer · OOU Ago-Iwoye
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoOrganizerLogin}
                      className="px-4 py-2 rounded-xl bg-[#C5FF35] text-[#0C0D0E] font-mono text-xs font-bold hover:bg-white transition-all shadow-md"
                    >
                      1-Click Demo Login
                    </button>
                  </div>
                </div>

                {/* Tabbed Organizer Sign In / Register Form */}
                <div className="border border-white/10 rounded-2xl bg-black/40 p-6 text-left space-y-5">
                  <div className="flex rounded-xl bg-white/5 p-1 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setAuthGateTab("signin")}
                      className={`flex-1 py-2 text-center rounded-lg transition-all ${
                        authGateTab === "signin"
                          ? "bg-white text-black font-bold shadow"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Organizer Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthGateTab("register")}
                      className={`flex-1 py-2 text-center rounded-lg transition-all ${
                        authGateTab === "register"
                          ? "bg-white text-black font-bold shadow"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Register New Organization
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400">
                      {authError}
                    </div>
                  )}

                  {authGateTab === "signin" ? (
                    <form onSubmit={handleGateSignIn} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                          Organizer Email or Username
                        </label>
                        <input
                          type="text"
                          value={gateEmailOrUser}
                          onChange={(e) => setGateEmailOrUser(e.target.value)}
                          placeholder="fassa_execs or social@fassa-oou.org"
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-white text-black font-mono text-xs font-bold rounded-xl hover:bg-[#F5F5F0] transition-all flex items-center justify-center gap-2"
                      >
                        <span>Sign In as Organizer</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleGateRegister} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                          Organization or Association Name
                        </label>
                        <input
                          type="text"
                          value={gateOrgName}
                          onChange={(e) => setGateOrgName(e.target.value)}
                          placeholder="e.g. Law Students Society Social Committee"
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Username
                          </label>
                          <input
                            type="text"
                            value={gateUsername}
                            onChange={(e) => setGateUsername(e.target.value)}
                            placeholder="law_soc_oou"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                            Official Email
                          </label>
                          <input
                            type="email"
                            value={gateEmail}
                            onChange={(e) => setGateEmail(e.target.value)}
                            placeholder="social@lawsociety.edu.ng"
                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                          Campus
                        </label>
                        <select
                          value={gateCampus}
                          onChange={(e) => setGateCampus(e.target.value)}
                          className="w-full bg-[#161719] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                        >
                          <option value="OOU Ago-Iwoye">OOU (Ago-Iwoye) - Launch Campus</option>
                          <option value="UNILAG Akoka">UNILAG (Akoka)</option>
                          <option value="UI Ibadan">UI (Ibadan)</option>
                          <option value="LASU Ojo">LASU (Ojo)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                          Bio or Mission
                        </label>
                        <input
                          type="text"
                          value={gateBio}
                          onChange={(e) => setGateBio(e.target.value)}
                          placeholder="Official committee organizing faculty dinners & concerts"
                          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#C5FF35] text-black font-mono text-xs font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>Create Organizer Account & Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Studio Bento Master Canvas */
            <div className="relative rounded-3xl lg:rounded-[36px] bg-[#0E1013] border border-white/10 shadow-2xl overflow-hidden">
              {/* Top Embedded Studio Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-4 sm:py-5 border-b border-white/10 bg-[#0E1013]/90 backdrop-blur-md">
                {/* Left: Star Mark & Pills */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5FF35]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm tracking-tight text-white block">
                        PartyPadi Studio
                      </span>
                      <span className="text-[10px] font-mono text-[#C5FF35]">
                        @{currentUser.username} · Organizer
                      </span>
                    </div>
                  </div>

                  {/* Capsule Navigation Pills */}
                  <div className="hidden sm:inline-flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono">
                    {["Overview", "Ticket Tiers", "Gate Scanner", "Bank Payouts"].map((tab) => {
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
                    })}
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
                    href="/circles"
                    className="text-xs font-mono px-3.5 py-1.5 rounded-full border border-white/20 text-[#C5FF35] hover:bg-white/10 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Padi Circles</span>
                  </Link>
                </div>
              </div>

              {/* Two-Column Master Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
                {/* Left Side: Live Banner Preview + Glassmorphic Hero Card */}
                <div className="lg:col-span-6 relative min-h-[480px] lg:min-h-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                  {/* Dynamic Banner Preview Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={bannerImageUrl}
                      alt="Event Banner Live Preview"
                      fill
                      className="object-cover object-center scale-105 filter brightness-90 transition-all duration-300"
                      priority
                      unoptimized={bannerImageUrl.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />
                  </div>

                  {/* Top Card Floating Indicator */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[11px] font-mono text-white/90">
                      <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-pulse" />
                      <span>LIVE PREVIEW: {selectedCampus.split(" ")[0]} PASS</span>
                    </div>
                    <div className="text-[11px] font-mono text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                      {ticketTiers.length} ACTIVE TIERS
                    </div>
                  </div>

                  {/* Floating Glassmorphism Hero Card */}
                  <div className="relative z-10 mt-auto rounded-3xl p-6 sm:p-8 bg-black/50 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-4">
                    {/* Organizer Meta */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#C5FF35] text-black font-display font-black text-xs flex items-center justify-center">
                        {currentUser.fullName.charAt(0)}
                      </div>
                      <span className="text-xs font-mono text-white/90">
                        Hosted by <strong>@{currentUser.username}</strong>
                      </span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5FF35] font-semibold">
                        CURRENT EVENT DRAFT
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight leading-snug line-clamp-2">
                        {eventTitle || "Welcome to our Campus Event"}
                      </h3>
                    </div>

                    {/* Event Location & Date */}
                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono text-white/80 border-t border-white/10">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#C5FF35] shrink-0" />
                        <span className="truncate">{venue || "Venue not set"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C5FF35] shrink-0" />
                        <span>{eventDate} · {eventTime}</span>
                      </div>
                    </div>

                    {/* Tiers Preview Strip */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {ticketTiers.map((t) => (
                          <div
                            key={t.id}
                            className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] font-mono text-white/90 flex items-center gap-1.5"
                          >
                            <span className="font-bold">{t.name}:</span>
                            <span className="text-[#C5FF35]">₦{t.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Settlement Meta */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                        <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
                        <span>Instant Virtual Account Settlement</span>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Step-by-Step Interactive Studio Form */}
                <div className="lg:col-span-6 bg-[#0C0D0E] p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  {/* Step Selector Pills */}
                  {!isPublished && (
                    <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-4 sm:p-6 space-y-6">
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
                          1. Essentials
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
                          2. Tiers ({ticketTiers.length})
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

                      {/* STAGE 1: Essentials & Event Banner */}
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
                              placeholder="e.g. Club Vegas, Off-Campus Ring Road"
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

                          {/* EVENT BANNER UPLOAD & PRESET SELECTOR */}
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <label className="block text-xs font-mono text-neutral-400 uppercase">
                              Event Banner Artwork
                            </label>

                            {/* Preset Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {PRESET_BANNERS.map((preset) => {
                                const isSelected = bannerImageUrl === preset.url;
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => {
                                      setBannerImageUrl(preset.url);
                                      setCustomBannerFileName(null);
                                    }}
                                    className={`relative p-2 rounded-xl border text-left transition-all ${
                                      isSelected
                                        ? "border-[#C5FF35] bg-[#C5FF35]/10 shadow-sm"
                                        : "border-white/10 bg-white/5 hover:border-white/30"
                                    }`}
                                  >
                                    <div className="h-10 rounded-lg overflow-hidden relative mb-1.5">
                                      <Image
                                        src={preset.url}
                                        alt={preset.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="text-[11px] font-mono text-white/90 truncate font-semibold">
                                      {preset.name}
                                    </div>
                                    {isSelected && (
                                      <span className="text-[9px] font-mono text-[#C5FF35] block">
                                        ● Selected
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Custom File Upload Input */}
                            <div className="mt-2">
                              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-[#C5FF35] bg-white/[0.02] cursor-pointer text-xs font-mono text-neutral-300 hover:text-white transition-all">
                                <Upload className="w-4 h-4 text-[#C5FF35]" />
                                <span>
                                  {customBannerFileName ? `Uploaded: ${customBannerFileName}` : "Upload Custom Banner (PNG, JPG, WebP)"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBannerFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setActiveStep("tiers")}
                              className="spicy-btn px-5 py-2.5 rounded-full bg-white text-black text-xs font-mono font-semibold flex items-center gap-1.5"
                            >
                              <span>Next: Configure Tiers</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 2: Dynamic Ticket Tiers */}
                      {activeStep === "tiers" && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-neutral-400 uppercase">
                              Ticket Tiers ({ticketTiers.length})
                            </span>
                            <button
                              type="button"
                              onClick={handleAddTier}
                              className="px-3 py-1.5 rounded-full bg-[#C5FF35] text-black text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-white transition-all shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add More Ticket Tier</span>
                            </button>
                          </div>

                          {/* Dynamic Tier Cards List */}
                          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                            {ticketTiers.map((tier, idx) => (
                              <div
                                key={tier.id}
                                className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[10px] flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={tier.name}
                                      onChange={(e) => handleUpdateTier(tier.id, "name", e.target.value)}
                                      placeholder="Tier Name (e.g. Table for 5)"
                                      className="bg-transparent border-b border-white/20 focus:border-[#C5FF35] text-xs font-mono text-white px-1 py-0.5 w-full focus:outline-none"
                                      required
                                    />
                                  </div>
                                  {ticketTiers.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTier(tier.id)}
                                      className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                                      title="Delete Tier"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                  <div>
                                    <label className="text-[10px] text-neutral-400 block mb-1">
                                      Price (₦)
                                    </label>
                                    <input
                                      type="number"
                                      value={tier.price}
                                      onChange={(e) => handleUpdateTier(tier.id, "price", Number(e.target.value))}
                                      className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5FF35]"
                                      min={0}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-neutral-400 block mb-1">
                                      Max Capacity
                                    </label>
                                    <input
                                      type="number"
                                      value={tier.capacity}
                                      onChange={(e) => handleUpdateTier(tier.id, "capacity", Number(e.target.value))}
                                      className="w-full bg-white/5 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5FF35]"
                                      min={1}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                                  <span>Tier Revenue Potential:</span>
                                  <span className="text-white font-bold">
                                    ₦{(tier.price * tier.capacity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Live Combined Revenue Forecast */}
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                              <span>COMBINED GROSS POTENTIAL:</span>
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
                              className="spicy-btn px-5 py-2.5 rounded-full bg-white text-black text-xs font-mono font-semibold flex items-center gap-1.5"
                            >
                              <span>Next: Gate Scanner</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 3: Gate Scanner */}
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
                              className="spicy-btn px-5 py-2.5 rounded-full bg-white text-black text-xs font-mono font-semibold flex items-center gap-1.5"
                            >
                              <span>Next: Banking Details</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STAGE 4: Banking Payout & Virtual Account */}
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

                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs font-mono text-neutral-300">
                            <div className="text-white font-bold flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-[#C5FF35]" />
                              <span>Instant Virtual Account Settlement</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                              When partygoers purchase tickets, proceeds drop immediately into your virtual organizer account. Withdraw to your Nigerian bank anytime.
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
                              type="button"
                              onClick={() => setIsPublished(true)}
                              className="spicy-btn px-6 py-2.5 rounded-full bg-[#C5FF35] text-black text-xs font-mono font-bold flex items-center gap-2 hover:bg-white transition-all shadow-[0_0_25px_rgba(197,255,53,0.35)]"
                            >
                              <span>Publish Event Now</span>
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
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
                        Your event page is live. Students can now purchase tickets directly on PartyPadi and suggest it in Padi Circles. Your door marshalls have been provisioned with cryptographic gate pass tokens.
                      </p>
                      <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono">
                        <span className="truncate text-white/80">
                          partypadi.ng/events/{eventTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}
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

                  {/* Bottom Canvas Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
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
          )}

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
