"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth, GIFTER_LEVEL_INFO, getOrganizerMilestones } from "@/context/AuthContext";
import { GifterBadge } from "@/components/GifterBadge";
import { CreatorTicketTier } from "@/types";
import { EVENTS } from "@/data/events";
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
  Search,
  Download,
  Check,
  Copy,
  Heart,
  Award,
  Filter,
  Eye,
  RefreshCw,
  Users,
  Crown,
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
  const {
    currentUser,
    login,
    signup,
    openAuthModal,
    attendees,
    gifts,
    getEventAttendees,
    getEventGifts,
    promoteWaitlistAttendee,
    checkInAttendee,
  } = useAuth();

  const [activeStep, setActiveStep] = useState<HostStep>("essentials");
  const [activeTabNav, setActiveTabNav] = useState("Overview");

  // Organizer metrics table states
  const [selectedEventId, setSelectedEventId] = useState("after-class-sunset");
  const [metricsSearch, setMetricsSearch] = useState("");
  const [metricsFilter, setMetricsFilter] = useState<"all" | "paid" | "waitlist" | "checked_in" | "gifts">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const handleCopyCode = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleExportCsv = () => {
    const currentList = getEventAttendees(selectedEventId);
    const headers = "ID,Name,Username,Email,Phone,Tier,AmountPaid,TicketCode,Status,GifterLevel\n";
    const rows = currentList
      .map(
        (a) =>
          `"${a.id}","${a.name}","@${a.username || ""}","${a.email}","${a.phone || ""}","${a.ticketTier}","${a.amountPaid}","${a.ticketCode}","${a.status}","${a.gifterLevel || ""}"`
      )
      .join("\n");
    const csvContent = headers + rows;

    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(csvContent);
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2500);
    }
  };

  const handlePromoteAttendee = (attendeeId: string) => {
    promoteWaitlistAttendee(attendeeId);
  };

  const handleCheckInAttendee = (attendeeId: string) => {
    checkInAttendee(attendeeId);
  };

  // Live Metrics Calculations for the Organizer Dashboard
  const currentEventAttendees = getEventAttendees(selectedEventId);
  const currentEventGifts = getEventGifts(selectedEventId);
  const targetEvent = EVENTS.find((e) => e.id === selectedEventId) || EVENTS[0];

  const paidAttendees = currentEventAttendees.filter(
    (a) => a.status === "paid" || a.status === "checked_in"
  );
  const checkedInAttendees = currentEventAttendees.filter((a) => a.status === "checked_in");
  const waitlistAttendees = currentEventAttendees.filter((a) => a.status === "waitlist");
  const grossTicketRevenue = currentEventAttendees.reduce((acc, a) => acc + (a.amountPaid || 0), 0);
  const totalGiftsReceived = currentEventGifts.reduce((acc, g) => acc + (g.amount || 0), 0);
  const totalCompanions = currentEventAttendees.reduce((acc, a) => acc + (a.companionsCount || 0), 0);
  const checkInRate =
    paidAttendees.length > 0
      ? Math.round((checkedInAttendees.length / paidAttendees.length) * 100)
      : 0;

  // Filtered attendees based on search and tab filter
  const filteredAttendees = currentEventAttendees.filter((item) => {
    if (metricsFilter === "paid" && item.status !== "paid") return false;
    if (metricsFilter === "waitlist" && item.status !== "waitlist") return false;
    if (metricsFilter === "checked_in" && item.status !== "checked_in") return false;

    if (metricsSearch.trim()) {
      const q = metricsSearch.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchUsername = item.username?.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchCode = item.ticketCode.toLowerCase().includes(q);
      const matchTier = item.ticketTier.toLowerCase().includes(q);
      return matchName || matchUsername || matchEmail || matchCode || matchTier;
    }
    return true;
  });

  const filteredGifts = currentEventGifts.filter((g) => {
    if (metricsSearch.trim()) {
      const q = metricsSearch.toLowerCase().trim();
      return (
        g.gifterName.toLowerCase().includes(q) ||
        g.gifterUsername?.toLowerCase().includes(q) ||
        g.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Organizer auth gate state
  const [authGateTab, setAuthGateTab] = useState<"signin" | "register">("signin");
  const [gateEmailOrUser, setGateEmailOrUser] = useState("");
  const [gateOrgName, setGateOrgName] = useState("");
  const [gateUsername, setGateUsername] = useState("");
  const [gateEmail, setGateEmail] = useState("");
  const [gateCampus, setGateCampus] = useState("Main Campus");
  const [gateBio, setGateBio] = useState("");
  const [authError, setAuthError] = useState("");

  // Event form states
  const [eventTitle, setEventTitle] = useState("All-White Campus Rave & Music Fest");
  const [selectedCampus, setSelectedCampus] = useState("Main Campus");
  const [selectedCategory, setSelectedCategory] = useState("Party & Rave");
  const [venue, setVenue] = useState("Club Vegas, Off-Campus Boulevard");
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
  const [accountName, setAccountName] = useState("ADEKUNLE OLAOLUWA (ORGANIZER)");
  const [scannerRepEmail, setScannerRepEmail] = useState("gate@campusparty.com");
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
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C5FF35] text-[#0C0D0E] font-bold text-sm flex items-center justify-center shrink-0">
                        FA
                      </div>
                      <div>
                        <div className="font-display font-bold text-sm text-white">
                          FASSA Social Directorate
                        </div>
                        <div className="text-xs font-mono text-neutral-400">
                          @fassa_execs · Verified Campus Organizer
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoOrganizerLogin}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#C5FF35] text-[#0C0D0E] font-mono text-xs font-bold hover:bg-white transition-all shadow-md shrink-0 text-center"
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
                          placeholder="fassa_execs or events@partypadi.com"
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
                          placeholder="e.g. Campus Rave Society, AfroVibes Collective"
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
                            placeholder="rave_collective"
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
                            placeholder="events@ravecollective.com"
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
                          <option value="Main Campus">Main Campus / General</option>
                          <option value="UNILAG Akoka">UNILAG (Akoka)</option>
                          <option value="OOU Ago-Iwoye">OOU (Ago-Iwoye)</option>
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
                  <div className="flex overflow-x-auto no-scrollbar items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono max-w-full">
                    {[
                      { id: "Overview", label: `Live Metrics (${currentEventAttendees.length})` },
                      { id: "Event Studio", label: "Event Studio" },
                      { id: "Ticket Tiers", label: `Tiers (${ticketTiers.length})` },
                      { id: "Gate Scanner", label: "Scanner" },
                      { id: "Bank Payouts", label: "Payouts" },
                    ].map((tab) => {
                      const isActive =
                        activeTabNav === tab.id ||
                        (activeTabNav === "Event Studio" &&
                          ((tab.id === "Ticket Tiers" && activeStep === "tiers") ||
                            (tab.id === "Gate Scanner" && activeStep === "gate") ||
                            (tab.id === "Bank Payouts" && activeStep === "payout")));
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            if (tab.id === "Ticket Tiers") {
                              setActiveTabNav("Event Studio");
                              setActiveStep("tiers");
                            } else if (tab.id === "Gate Scanner") {
                              setActiveTabNav("Event Studio");
                              setActiveStep("gate");
                            } else if (tab.id === "Bank Payouts") {
                              setActiveTabNav("Event Studio");
                              setActiveStep("payout");
                            } else {
                              setActiveTabNav(tab.id);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                            isActive
                              ? "bg-white text-black font-semibold shadow-sm"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {tab.label}
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

              {activeTabNav === "Overview" ? (
                /* Organizer Live Metrics & Attendee Table View */
                <div className="p-4 sm:p-8 space-y-7 animate-in fade-in duration-200">
                  {/* Event Selector & Telemetry Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#C5FF35] text-[#0C0D0E] flex items-center justify-center font-display font-black text-sm shrink-0">
                        PP
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono uppercase text-neutral-400">EVENT TELEMETRY:</span>
                          <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="bg-[#141517] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-display font-bold focus:outline-none focus:border-[#C5FF35]"
                          >
                            {EVENTS.map((ev) => (
                              <option key={ev.id} value={ev.id}>
                                {ev.title} ({ev.campus})
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 block mt-0.5">
                          {targetEvent?.date} · {targetEvent?.venue}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end md:self-auto">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>GATE TELEMETRY: REAL-TIME</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTabNav("Event Studio")}
                        className="spicy-btn px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition-all shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Event Studio</span>
                      </button>
                    </div>
                  </div>

                  {/* Top 5 KPI Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    {/* KPI 1: Gross Ticket Revenue */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                          GROSS TICKET REVENUE
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-[#C5FF35]/15 text-[#C5FF35] flex items-center justify-center">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                        ₦{grossTicketRevenue.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-mono text-[#C5FF35] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>0% Commission · ₦0 platform fee</span>
                      </div>
                    </div>

                    {/* KPI 2: Paid Attendees */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                          PAID ATTENDEES
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-sky-400/15 text-sky-400 flex items-center justify-center">
                          <Ticket className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                        {paidAttendees.length}{" "}
                        <span className="text-xs text-neutral-400 font-normal">/ 500</span>
                      </div>
                      <div className="text-[10px] font-mono text-sky-400">
                        +{totalCompanions} plus-ones & squad passes
                      </div>
                    </div>

                    {/* KPI 3: Waitlist Queue */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                          WAITLIST QUEUE
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-amber-400/15 text-amber-400 flex items-center justify-center">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                        {waitlistAttendees.length}
                      </div>
                      <div className="text-[10px] font-mono text-amber-400">
                        {waitlistAttendees.length > 0 ? "1-Click promotion ready" : "No pending waitlist"}
                      </div>
                    </div>

                    {/* KPI 4: Check-in Velocity */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                          GATE CHECK-IN
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                        {checkedInAttendees.length}{" "}
                        <span className="text-xs text-neutral-400 font-normal">
                          ({checkInRate}%)
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        Sub-second door turnstile
                      </div>
                    </div>

                    {/* KPI 5: Gifts & Support */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                          GIFTS & PATRONAGE
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-rose-400/15 text-rose-400 flex items-center justify-center">
                          <Heart className="w-3.5 h-3.5 fill-rose-400" />
                        </div>
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                        ₦{totalGiftsReceived.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-mono text-rose-400">
                        {currentEventGifts.length} campus supporters backed
                      </div>
                    </div>
                  </div>

                  {/* Attendees Management Toolbar */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Filter Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => setMetricsFilter("all")}
                          className={`px-3 py-1.5 rounded-xl transition-all ${
                            metricsFilter === "all"
                              ? "bg-white text-black font-bold shadow-sm"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          All ({currentEventAttendees.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetricsFilter("paid")}
                          className={`px-3 py-1.5 rounded-xl transition-all ${
                            metricsFilter === "paid"
                              ? "bg-sky-400 text-black font-bold shadow-sm"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Paid ({paidAttendees.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetricsFilter("waitlist")}
                          className={`px-3 py-1.5 rounded-xl transition-all ${
                            metricsFilter === "waitlist"
                              ? "bg-amber-400 text-black font-bold shadow-sm"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Waitlist ({waitlistAttendees.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetricsFilter("checked_in")}
                          className={`px-3 py-1.5 rounded-xl transition-all ${
                            metricsFilter === "checked_in"
                              ? "bg-emerald-400 text-black font-bold shadow-sm"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Checked In ({checkedInAttendees.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setMetricsFilter("gifts")}
                          className={`px-3 py-1.5 rounded-xl transition-all ${
                            metricsFilter === "gifts"
                              ? "bg-rose-400 text-black font-bold shadow-sm"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          Gifts & Support ({currentEventGifts.length})
                        </button>
                      </div>

                      {/* Search & Export Buttons */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-64">
                          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={metricsSearch}
                            onChange={(e) => setMetricsSearch(e.target.value)}
                            placeholder="Search attendee, tag, or code..."
                            className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] font-mono"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleExportCsv}
                          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono flex items-center gap-1.5 border border-white/15 transition-all shrink-0"
                          title="Export roster as CSV"
                        >
                          {copiedCsv ? <Check className="w-3.5 h-3.5 text-[#C5FF35]" /> : <Download className="w-3.5 h-3.5" />}
                          <span>{copiedCsv ? "Copied CSV!" : "Export CSV"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Table Container */}
                    <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl">
                      {metricsFilter !== "gifts" ? (
                        /* Attendee Roster Table */
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                <th className="py-3.5 px-4">Attendee</th>
                                <th className="py-3.5 px-4">Pass Tier</th>
                                <th className="py-3.5 px-4">Paid (₦)</th>
                                <th className="py-3.5 px-4">Ticket Code</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Gifter Badge</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                              {filteredAttendees.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-mono text-xs">
                                    No attendees found matching filter.
                                  </td>
                                </tr>
                              ) : (
                                filteredAttendees.map((att) => {
                                  const gifterBadge = att.gifterLevel ? GIFTER_LEVEL_INFO[att.gifterLevel] : null;

                                  return (
                                    <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                                      {/* Attendee */}
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-8 h-8 rounded-xl bg-white/10 text-white font-display font-bold flex items-center justify-center text-xs shrink-0">
                                            {att.name.charAt(0)}
                                          </div>
                                          <div className="min-w-0">
                                            <span className="font-display font-bold text-xs text-white block truncate">
                                              {att.name}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                                              {att.username && <span className="text-[#C5FF35]">@{att.username}</span>}
                                              <span className="truncate">{att.email}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Tier */}
                                      <td className="py-3 px-4 font-mono text-neutral-300">
                                        <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px]">
                                          {att.ticketTier}
                                        </span>
                                      </td>

                                      {/* Amount Paid */}
                                      <td className="py-3 px-4 font-mono font-bold">
                                        {att.amountPaid > 0 ? (
                                          <span className="text-[#C5FF35]">₦{att.amountPaid.toLocaleString()}</span>
                                        ) : (
                                          <span className="text-amber-400">Waitlist (₦0)</span>
                                        )}
                                      </td>

                                      {/* Ticket Code */}
                                      <td className="py-3 px-4 font-mono">
                                        <button
                                          type="button"
                                          onClick={() => handleCopyCode(att.ticketCode)}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors text-[11px]"
                                          title="Copy code"
                                        >
                                          <span>{att.ticketCode}</span>
                                          {copiedCode === att.ticketCode ? (
                                            <Check className="w-3 h-3 text-[#C5FF35]" />
                                          ) : (
                                            <Copy className="w-3 h-3 text-neutral-400" />
                                          )}
                                        </button>
                                      </td>

                                      {/* Status */}
                                      <td className="py-3 px-4 font-mono">
                                        {att.status === "checked_in" && (
                                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                                            <Check className="w-3 h-3 text-emerald-400" />
                                            <span>Checked In</span>
                                            {att.checkedInAt && (
                                              <span className="text-neutral-400 text-[9px]">
                                                ({att.checkedInAt.split(" ")[1] || att.checkedInAt})
                                              </span>
                                            )}
                                          </span>
                                        )}
                                        {att.status === "paid" && (
                                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-bold">
                                            <Ticket className="w-3 h-3 text-sky-400" />
                                            <span>Paid Pass</span>
                                          </span>
                                        )}
                                        {att.status === "waitlist" && (
                                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                                            <Clock className="w-3 h-3 text-amber-400" />
                                            <span>Waitlist</span>
                                          </span>
                                        )}
                                      </td>

                                      {/* Gifter Badge */}
                                      <td className="py-3 px-4 font-mono">
                                        {gifterBadge ? (
                                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px]">
                                            <div className="w-3.5 h-3.5 rounded-full overflow-hidden relative shrink-0">
                                              <Image src={gifterBadge.imageUrl} alt={gifterBadge.name} fill className="object-contain" />
                                            </div>
                                            <span>{gifterBadge.badge}</span>
                                          </span>
                                        ) : (
                                          <span className="text-neutral-600">—</span>
                                        )}
                                      </td>

                                      {/* Actions */}
                                      <td className="py-3 px-4 text-right">
                                        {att.status === "waitlist" && (
                                          <button
                                            type="button"
                                            onClick={() => handlePromoteAttendee(att.id)}
                                            className="px-3 py-1.5 rounded-xl bg-[#C5FF35] text-black font-mono text-[11px] font-bold hover:bg-white transition-all shadow-sm"
                                          >
                                            Promote to Ticket
                                          </button>
                                        )}
                                        {att.status === "paid" && (
                                          <button
                                            type="button"
                                            onClick={() => handleCheckInAttendee(att.id)}
                                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] border border-white/20 transition-all"
                                          >
                                            Check In Gate
                                          </button>
                                        )}
                                        {att.status === "checked_in" && (
                                          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] font-semibold">
                                            <Check className="w-3 h-3 text-emerald-400" />
                                            <span>Verified</span>
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* Gifts & Support Telemetry View */
                        <div className="space-y-6">
                          {(() => {
                            const totalSupport = filteredGifts.reduce((s, g) => s + g.amount, 0);
                            const uniqueSupporters = new Set(filteredGifts.map((g) => g.userId || g.gifterName)).size;
                            const milestones = getOrganizerMilestones(totalSupport, uniqueSupporters);

                            return (
                              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-amber-400" />
                                    <span className="font-display font-bold text-sm text-white">
                                      Organizer Support Milestones
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-neutral-400">
                                    ₦{totalSupport.toLocaleString()} raised across {uniqueSupporters} campus patron{uniqueSupporters !== 1 ? "s" : ""}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                  {milestones.map((m) => (
                                    <div
                                      key={m.id}
                                      className={`p-2.5 rounded-xl border text-[11px] font-mono transition-all space-y-1 ${
                                        m.unlocked
                                          ? "bg-amber-400/10 border-amber-400/30 text-amber-300 font-bold"
                                          : "bg-white/[0.02] border-white/5 text-neutral-500"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="shrink-0">
                                          {m.id === "first_gift" && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                                          {m.id === "crowd_favourite" && <Users className="w-3.5 h-3.5 text-amber-400" />}
                                          {m.id === "community_backed" && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                                          {m.id === "campus_favourite" && <Crown className="w-3.5 h-3.5 text-purple-400" />}
                                        </div>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10">
                                          {m.unlocked ? "UNLOCKED" : `${m.progress}%`}
                                        </span>
                                      </div>
                                      <span className="block truncate text-white">{m.title}</span>
                                      <span className="text-[9px] text-neutral-400 block truncate">
                                        {m.requirement}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Gifts Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                  <th className="py-3.5 px-4">Patron Supporter</th>
                                  <th className="py-3.5 px-4">Giving Type</th>
                                  <th className="py-3.5 px-4">Badge Tier</th>
                                  <th className="py-3.5 px-4">Amount (₦)</th>
                                  <th className="py-3.5 px-4">Cheer Message</th>
                                  <th className="py-3.5 px-4">Timestamp</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 font-sans">
                                {filteredGifts.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="py-12 text-center text-neutral-400 font-mono text-xs">
                                      No gift contributions recorded yet.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredGifts.map((gift) => {
                                    return (
                                      <tr key={gift.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-4">
                                          <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-300 font-bold flex items-center justify-center text-xs">
                                              {gift.gifterName.charAt(0)}
                                            </div>
                                            <div>
                                              <span className="font-display font-bold text-xs text-white block">
                                                {gift.gifterName}
                                              </span>
                                              {gift.gifterUsername && (
                                                <span className="font-mono text-[10px] text-neutral-400">
                                                  @{gift.gifterUsername}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </td>

                                        <td className="py-3 px-4 font-mono">
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/10 text-neutral-300">
                                            {gift.type === "direct_organizer_gift"
                                              ? "Organizer Gift"
                                              : "Event Sponsor"}
                                          </span>
                                        </td>

                                        <td className="py-3 px-4">
                                          <GifterBadge level={gift.level} size="sm" />
                                        </td>

                                        <td className="py-3 px-4 font-mono font-bold text-[#C5FF35]">
                                          ₦{gift.amount.toLocaleString()}
                                        </td>

                                        <td className="py-3 px-4 text-neutral-300 max-w-xs">
                                          {gift.message ? (
                                            <span className="italic">&ldquo;{gift.message}&rdquo;</span>
                                          ) : (
                                            <span className="text-neutral-600">—</span>
                                          )}
                                        </td>

                                        <td className="py-3 px-4 font-mono text-[10px] text-neutral-400">
                                          {new Date(gift.createdAt).toLocaleDateString()} ·{" "}
                                          {new Date(gift.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Two-Column Master Canvas */
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
                                <option value="Main Campus">Main Campus / General</option>
                                <option value="UNILAG (Akoka)">UNILAG (Akoka)</option>
                                <option value="OOU (Ago-Iwoye)">OOU (Ago-Iwoye)</option>
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
                              placeholder="e.g. Club Vegas, Off-Campus Boulevard, Grand Amphitheatre"
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
            )}
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
