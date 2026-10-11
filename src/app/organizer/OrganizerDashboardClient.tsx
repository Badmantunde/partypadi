"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CampusEvent,
  CreatorTicketTier,
  AttendeeMetricItem,
  EventGift,
  UserProfile,
} from "@/types";
import { useAuth, getOrganizerMilestones } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { PartyPadiLogo } from "@/components/PartyPadiLogo";
import { GifterBadge } from "@/components/GifterBadge";
import { getPublicUrl } from "@/lib/urls";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  TrendingUp,
  Gift,
  Building2,
  Settings,
  LogOut,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  Download,
  Copy,
  Check,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Filter,
  DollarSign,
  BarChart3,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  ChevronRight,
  RefreshCw,
  Award,
  Crown,
  MapPin,
} from "lucide-react";

interface OrganizerDashboardClientProps {
  initialEvents: CampusEvent[];
}

type OrganizerTab =
  | "overview"
  | "my_events"
  | "create_event"
  | "attendees"
  | "analytics"
  | "gifter_support"
  | "profile"
  | "settings";

export function OrganizerDashboardClient({
  initialEvents,
}: OrganizerDashboardClientProps) {
  const {
    currentUser,
    allUsers,
    attendees,
    gifts,
    organizerEvents,
    addOrganizerEvent,
    updateOrganizerEvent,
    getEventAttendees,
    getEventGifts,
    getOrganizerGifts,
    promoteWaitlistAttendee,
    checkInAttendee,
    switchRole,
    logout,
  } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<OrganizerTab>("overview");
  const [selectedEventId, setSelectedEventId] = useState<string>("after-class-sunset");

  // Attendees Search & Filters
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState<
    "all" | "paid" | "checked_in" | "waitlist"
  >("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Event Creation State
  const [createStep, setCreateStep] = useState<"essentials" | "tiers" | "gate" | "payout">("essentials");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<any>("parties");
  const [newCampus, setNewCampus] = useState("Main Campus");
  const [newVenue, setNewVenue] = useState("");
  const [newDate, setNewDate] = useState("2026-11-28");
  const [newTime, setNewTime] = useState("18:00");
  const [newDescription, setNewDescription] = useState("");
  const [newTiers, setNewTiers] = useState<CreatorTicketTier[]>([
    {
      id: "tier-regular",
      name: "Early Bird",
      price: 2500,
      capacity: 100,
      description: "Limited early student passes",
    },
    {
      id: "tier-vip",
      name: "VIP Table",
      price: 15000,
      capacity: 20,
      description: "Reserved high table with refreshments",
    },
  ]);
  const [bankName, setBankName] = useState("GTBank (Guaranty Trust)");
  const [accountNumber, setAccountNumber] = useState("0124982736");
  const [accountName, setAccountName] = useState("ADEKUNLE OLAOLUWA (ORGANIZER)");
  const [scannerRepEmail, setScannerRepEmail] = useState("gate@campusparty.com");

  // Fallback demo organizer if not logged in
  const organizerUser =
    currentUser && currentUser.role === "organizer"
      ? currentUser
      : {
          id: "user-5",
          username: "fassa_execs",
          fullName: "FASSA Social Committee",
          email: "social@fassa-events.org",
          role: "organizer" as const,
          roles: ["organizer" as const, "partygoer" as const],
          campus: "Main Campus",
          bio: "Official Social Directorate, Faculty Social Committee",
          friends: [],
          eventsAttending: [],
        };

  // Combine initialEvents with any newly created organizerEvents
  const allAvailableEvents = useMemo(() => {
    const map = new Map<string, CampusEvent>();
    for (const e of initialEvents) map.set(e.id, e);
    for (const e of organizerEvents) map.set(e.id, e);
    return Array.from(map.values());
  }, [initialEvents, organizerEvents]);

  // Selected Event Telemetry
  const activeEvent =
    allAvailableEvents.find((e) => e.id === selectedEventId) || allAvailableEvents[0];

  const eventAttendeesList = useMemo(() => {
    return getEventAttendees(activeEvent.id);
  }, [getEventAttendees, activeEvent.id]);

  const eventGiftsList = useMemo(() => {
    return getEventGifts(activeEvent.id);
  }, [getEventGifts, activeEvent.id]);

  const orgDirectGifts = useMemo(() => {
    return getOrganizerGifts(organizerUser.username);
  }, [getOrganizerGifts, organizerUser.username]);

  // Aggregated Real Metrics across all events
  const metrics = useMemo(() => {
    const paidList = eventAttendeesList.filter(
      (a) => a.status === "paid" || a.status === "checked_in"
    );
    const checkedInList = eventAttendeesList.filter((a) => a.status === "checked_in");
    const waitlistList = eventAttendeesList.filter((a) => a.status === "waitlist");

    const grossSales = eventAttendeesList.reduce(
      (acc, a) => acc + (a.amountPaid || 0),
      0
    );
    const platformFee = 0; // 0% Launch fee
    const refunds = 0;
    const netEarnings = grossSales - platformFee - refunds;

    const totalGiftAmount = eventGiftsList.reduce((acc, g) => acc + (g.amount || 0), 0);

    const checkInRate =
      paidList.length > 0 ? Math.round((checkedInList.length / paidList.length) * 100) : 0;

    return {
      totalTicketsSold: paidList.length,
      grossSales,
      platformFee,
      refunds,
      netEarnings,
      checkedInCount: checkedInList.length,
      waitlistCount: waitlistList.length,
      checkInRate,
      totalSponsorshipReceived: totalGiftAmount,
    };
  }, [eventAttendeesList, eventGiftsList]);

  // Filtered Attendees
  const filteredAttendees = useMemo(() => {
    return eventAttendeesList.filter((att) => {
      if (attendeeStatusFilter !== "all" && att.status !== attendeeStatusFilter) {
        return false;
      }
      if (attendeeSearch.trim()) {
        const q = attendeeSearch.toLowerCase().trim();
        const matchName = att.name.toLowerCase().includes(q);
        const matchEmail = att.email.toLowerCase().includes(q);
        const matchCode = att.ticketCode.toLowerCase().includes(q);
        const matchTier = att.ticketTier.toLowerCase().includes(q);
        const matchUser = att.username?.toLowerCase().includes(q);
        return matchName || matchEmail || matchCode || matchTier || matchUser;
      }
      return true;
    });
  }, [eventAttendeesList, attendeeStatusFilter, attendeeSearch]);

  // Milestone telemetry
  const milestones = getOrganizerMilestones(
    metrics.totalSponsorshipReceived,
    new Set(eventGiftsList.map((g) => g.gifterName)).size
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    showToast({
      type: "info",
      title: "Code Copied",
      message: `${code} copied to clipboard.`,
    });
  };

  const handleExportCsv = () => {
    const headers = "ID,Name,Username,Email,Phone,Tier,AmountPaid,TicketCode,Status\n";
    const rows = eventAttendeesList
      .map(
        (a) =>
          `"${a.id}","${a.name}","@${a.username || ""}","${a.email}","${a.phone || ""}","${a.ticketTier}","${a.amountPaid}","${a.ticketCode}","${a.status}"`
      )
      .join("\n");
    const csvContent = headers + rows;

    navigator.clipboard?.writeText(csvContent);
    showToast({
      type: "success",
      title: "Attendee CSV Copied",
      message: `${eventAttendeesList.length} attendee records copied to clipboard as CSV.`,
    });
  };

  const handlePromoteAttendee = (id: string) => {
    const success = promoteWaitlistAttendee(id);
    if (success) {
      showToast({
        type: "success",
        title: "Attendee Promoted",
        message: "Waitlist attendee confirmed and issued official gate pass.",
      });
    }
  };

  const handleCheckIn = (id: string) => {
    const success = checkInAttendee(id);
    if (success) {
      showToast({
        type: "success",
        title: "Checked In at Gate",
        message: "Attendee entry logged successfully.",
      });
    }
  };

  const handleCreateNewEvent = (status: "published" | "draft") => {
    if (!newTitle.trim() || !newVenue.trim()) {
      showToast({
        type: "error",
        title: "Required Fields Missing",
        message: "Please enter event title and venue.",
      });
      return;
    }

    const newEvent: CampusEvent = {
      id: `ev-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newDescription.trim() || "Exclusive campus gathering",
      category: newCategory,
      categoryLabel: "Parties & Nightlife",
      date: newDate,
      shortDate: newDate.slice(5).replace("-", " "),
      time: newTime,
      venue: newVenue.trim(),
      campus: newCampus,
      fullLocation: `${newVenue.trim()}, ${newCampus}`,
      priceStartingFrom: newTiers[0]?.price || 0,
      statusBadge: status === "published" ? "Campus Pick" : undefined,
      status: status,
      organizer: {
        name: organizerUser.fullName,
        role: "Verified Campus Organizer",
        verified: true,
      },
      imageUrl: "/images/iridescent_fluid_host_art.jpg",
      fallbackGradient: "from-zinc-900 via-neutral-900 to-black",
      description: newDescription.trim() || "Event hosted on PartyPadi.",
      highlights: ["Instant gate scanning", "100% verified student passes"],
      ticketTiers: newTiers.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        description: t.description || "General admission",
        available: true,
      })),
    };

    addOrganizerEvent(newEvent);
    setSelectedEventId(newEvent.id);
    showToast({
      type: "success",
      title: status === "published" ? "Event Published!" : "Draft Saved",
      message: `"${newTitle}" has been saved to your organizer studio.`,
    });
    setActiveTab("my_events");
  };

  const handleSwitchToPartygoer = () => {
    switchRole("partygoer");
    showToast({
      type: "info",
      title: "Switched Experience",
      message: "Entering Partygoer discovery feed.",
    });
  };

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans selection:bg-[#00D54B] selection:text-black">
      <div className="flex-1 flex w-full max-w-[1680px] mx-auto min-h-screen">
        {/* ========================================================================= */}
        {/* DESKTOP PERSISTENT ORGANIZER SIDEBAR                                      */}
        {/* ========================================================================= */}
        <aside
          className="hidden lg:flex w-64 xl:w-72 flex-col shrink-0 border-r border-white/10 bg-[#0C0D0E] p-5 h-screen sticky top-0 justify-between select-none"
          aria-label="Organizer Studio Navigation"
        >
          <div className="space-y-6">
            {/* Brand Logo & Studio Badge */}
            <div className="flex items-center justify-between pt-1">
              <Link href={getPublicUrl("/")} className="flex items-center gap-2 group transition-transform" title="Party Padi">
                <PartyPadiLogo theme="dark" size="md" />
              </Link>
              <span className="px-2 py-0.5 rounded-full bg-[#D7F23A]/15 text-[#D7F23A] border border-[#D7F23A]/30 text-[10px] font-mono font-bold tracking-wider uppercase">
                Studio
              </span>
            </div>

            {/* Organizer Profile Snippet */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D7F23A] text-[#0C0D0E] font-display font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {organizerUser.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-display font-bold text-xs text-white truncate">
                    {organizerUser.fullName}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 truncate">
                    @{organizerUser.username}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-neutral-400">
                <span className="flex items-center gap-1 text-[#00D54B]">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Host
                </span>
                <span>{organizerUser.campus}</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5" aria-label="Organizer Sections">
              {[
                { id: "overview" as OrganizerTab, label: "Overview", icon: LayoutDashboard },
                {
                  id: "my_events" as OrganizerTab,
                  label: "My Events",
                  icon: Calendar,
                  badge: allAvailableEvents.length,
                },
                { id: "create_event" as OrganizerTab, label: "Create Event", icon: PlusCircle },
                {
                  id: "attendees" as OrganizerTab,
                  label: "Orders & Attendees",
                  icon: Users,
                  badge: eventAttendeesList.length,
                },
                { id: "analytics" as OrganizerTab, label: "Analytics", icon: TrendingUp },
                {
                  id: "gifter_support" as OrganizerTab,
                  label: "Gifter & Support",
                  icon: Gift,
                  badge: eventGiftsList.length > 0 ? eventGiftsList.length : null,
                },
                { id: "profile" as OrganizerTab, label: "Organizer Profile", icon: Building2 },
                { id: "settings" as OrganizerTab, label: "Settings", icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all group ${
                      isActive
                        ? "bg-white/15 text-white font-bold border border-white/20 shadow-xs"
                        : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-[#D7F23A]" : "text-neutral-400 group-hover:text-white"
                        }`}
                      />
                      <span className={isActive ? "text-white" : "text-neutral-300"}>
                        {item.label}
                      </span>
                    </div>

                    {item.badge !== undefined && item.badge !== null && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-white/10 text-neutral-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              onClick={handleSwitchToPartygoer}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#00D54B] bg-[#00D54B]/10 hover:bg-[#00D54B]/20 border border-[#00D54B]/25 transition-all group"
            >
              <span>Student Partygoer Hub</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              href={getPublicUrl("/")}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* MAIN ORGANIZER CONTENT AREA                                               */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#070809] pb-24">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 bg-[#0C0D0E]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Link href={getPublicUrl("/")}>
                  <PartyPadiLogo theme="dark" size="sm" />
                </Link>
              </div>

              <div>
                <h1 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
                  <span>Organizer Workspace</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#00D54B]/20 text-[#00D54B] font-mono">
                    Live
                  </span>
                </h1>
                <p className="text-[11px] font-mono text-neutral-400">
                  Telemetry for: <strong>{activeEvent.title}</strong>
                </p>
              </div>
            </div>

            {/* Event Selector Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-full text-xs font-mono">
                <span className="text-neutral-400">Managing:</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer max-w-[200px] truncate"
                >
                  {allAvailableEvents.map((ev) => (
                    <option key={ev.id} value={ev.id} className="bg-[#0C0D0E] text-white">
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setActiveTab("create_event")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D7F23A] text-black font-mono text-xs font-bold hover:bg-white transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Event</span>
              </button>
            </div>
          </header>

          {/* View Container */}
          <div className="p-4 sm:p-8 space-y-8 max-w-[1536px] w-full mx-auto">
            {/* ========================================================================= */}
            {/* VIEW 1: ORGANIZER OVERVIEW (EXECUTIVE METRICS & RECENT ACTIVITY)          */}
            {/* ========================================================================= */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* 1. EXECUTIVE KPI SUMMARY CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Total Tickets Sold */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                      <span>TICKETS SOLD</span>
                      <Users className="w-4 h-4 text-[#00D54B]" />
                    </div>
                    <div className="text-3xl font-display font-black text-white">
                      {metrics.totalTicketsSold}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400">
                      {metrics.checkedInCount} verified at gate • {metrics.waitlistCount} on waitlist
                    </div>
                  </div>

                  {/* Gross Ticket Sales Revenue */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                      <span>GROSS TICKET SALES</span>
                      <DollarSign className="w-4 h-4 text-[#D7F23A]" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#D7F23A]">
                      ₦{metrics.grossSales.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-[#00D54B]">
                      0% Launch Fee (₦0 fee deducted)
                    </div>
                  </div>

                  {/* Net Earnings & Payout Status */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                      <span>NET ORGANIZER BALANCE</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-display font-black text-white">
                      ₦{metrics.netEarnings.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Disbursement Pending Gate Close</span>
                    </div>
                  </div>

                  {/* Community Sponsorship / Gifts */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
                      <span>CAMPUS SPONSORSHIP</span>
                      <Gift className="w-4 h-4 text-[#7B3FFF]" />
                    </div>
                    <div className="text-3xl font-display font-black text-[#7B3FFF]">
                      ₦{metrics.totalSponsorshipReceived.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400">
                      {eventGiftsList.length} verified campus backers
                    </div>
                  </div>
                </div>

                {/* 2. RECENT ATTENDEE ORDERS & GATE CHECK-IN ACTIVITY */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                        Recent Attendee Orders & Gate Telemetry
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Live pass registrations for {activeEvent.title}.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportCsv}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("attendees")}
                        className="px-3.5 py-1.5 rounded-xl bg-[#00D54B] text-black font-mono text-xs font-bold hover:bg-[#D7F23A] transition-all"
                      >
                        View All ({eventAttendeesList.length})
                      </button>
                    </div>
                  </div>

                  {/* Compact Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                        <tr>
                          <th className="pb-3">Attendee Name</th>
                          <th className="pb-3">Ticket Tier</th>
                          <th className="pb-3">Pass Code</th>
                          <th className="pb-3">Amount Paid</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Gate Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {eventAttendeesList.slice(0, 5).map((att) => (
                          <tr key={att.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 font-sans font-medium text-white">
                              <div>{att.name}</div>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                @{att.username || "attendee"}
                              </span>
                            </td>
                            <td className="py-3 text-neutral-300">{att.ticketTier}</td>
                            <td className="py-3 text-[#00D54B] font-bold">{att.ticketCode}</td>
                            <td className="py-3 text-white">₦{att.amountPaid.toLocaleString()}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                  att.status === "checked_in"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : att.status === "paid"
                                    ? "bg-[#00D54B]/20 text-[#00D54B] border border-[#00D54B]/30"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {att.status === "checked_in"
                                  ? "Checked In"
                                  : att.status === "paid"
                                  ? "Confirmed"
                                  : "Waitlist"}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {att.status === "paid" && (
                                <button
                                  onClick={() => handleCheckIn(att.id)}
                                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#00D54B] hover:text-black text-white text-[11px] font-bold transition-all"
                                >
                                  Check In
                                </button>
                              )}
                              {att.status === "waitlist" && (
                                <button
                                  onClick={() => handlePromoteAttendee(att.id)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-black text-[11px] font-bold hover:bg-amber-300 transition-all"
                                >
                                  Promote
                                </button>
                              )}
                              {att.status === "checked_in" && (
                                <span className="text-[11px] text-neutral-400 inline-flex items-center gap-1">
                                  <Check className="w-3 h-3 text-[#00D54B]" /> At Venue
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. EVENT PERFORMANCE & CHECK-IN VELOCITY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gate Check-In Velocity */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-base text-white">
                        Door Scanner Telemetry
                      </h4>
                      <span className="text-xs font-mono text-[#00D54B]">
                        {metrics.checkInRate}% In Venue
                      </span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#00D54B] transition-all duration-500"
                        style={{ width: `${metrics.checkInRate}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>{metrics.checkedInCount} Checked In</span>
                      <span>{metrics.totalTicketsSold - metrics.checkedInCount} Yet to Arrive</span>
                    </div>
                  </div>

                  {/* Financial Settlement Breakdown */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <h4 className="font-display font-bold text-base text-white">
                      Payout & Settlement Schedule
                    </h4>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-neutral-300">
                        <span>Receiving Bank:</span>
                        <strong className="text-white">{bankName}</strong>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span>Account Number:</span>
                        <strong className="text-white">{accountNumber}</strong>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span>Settlement Window:</span>
                        <span className="text-[#00D54B]">T+1 Post Event Gate Close</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: MY EVENTS (PUBLISHED & DRAFTS)                                     */}
            {/* ========================================================================= */}
            {activeTab === "my_events" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                      My Hosted Events ({allAvailableEvents.length})
                    </h2>
                    <p className="text-sm text-neutral-400">
                      Manage published event pages, view ticket tiers, and track attendee sales.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("create_event")}
                    className="px-5 py-2.5 rounded-full bg-[#D7F23A] text-black font-mono text-xs font-bold hover:bg-white transition-all flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Event</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allAvailableEvents.map((event) => {
                    const eventAtts = getEventAttendees(event.id);
                    const paidCount = eventAtts.filter((a) => a.status === "paid" || a.status === "checked_in").length;
                    const eventRevenue = eventAtts.reduce((acc, a) => acc + (a.amountPaid || 0), 0);
                    return (
                      <div
                        key={event.id}
                        className="rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 p-5 space-y-4 flex flex-col justify-between transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono text-neutral-300">
                              {event.categoryLabel}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#00D54B]/20 text-[#00D54B] border border-[#00D54B]/30 text-[10px] font-mono font-bold">
                              {event.status === "draft" ? "Draft" : "Published"}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-xl text-white">
                            {event.title}
                          </h3>
                          <p className="text-xs text-neutral-400 line-clamp-2">{event.subtitle}</p>

                          <div className="space-y-1 text-xs font-mono text-neutral-300">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span>{event.date} • {event.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          </div>
                        </div>

                        {/* Event Sales Stats */}
                        <div className="pt-3 border-t border-white/10 space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <span className="text-[10px] text-neutral-400 block">TICKETS</span>
                              <strong className="text-white">{paidCount} sold</strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <span className="text-[10px] text-neutral-400 block">SALES</span>
                              <strong className="text-[#D7F23A]">₦{eventRevenue.toLocaleString()}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedEventId(event.id);
                                setActiveTab("overview");
                              }}
                              className="flex-1 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all"
                            >
                              Manage Telemetry
                            </button>
                            <Link
                              href={`/events/${event.id}`}
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                              title="Preview Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 3: CREATE EVENT STUDIO                                               */}
            {/* ========================================================================= */}
            {activeTab === "create_event" && (
              <div className="space-y-8 animate-in fade-in duration-200 max-w-3xl">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Create New Campus Event
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Define ticket tiers, set capacity, configure gate scanners, and publish live to students.
                  </p>
                </div>

                {/* Multi-step selector */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto text-xs font-mono">
                  {[
                    { id: "essentials" as const, label: "1. Event Essentials" },
                    { id: "tiers" as const, label: "2. Ticket Tiers" },
                    { id: "gate" as const, label: "3. Gate Scanner" },
                    { id: "payout" as const, label: "4. Bank Settlement" },
                  ].map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setCreateStep(step.id)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                        createStep === step.id
                          ? "bg-white text-black font-bold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  {/* Step 1: Essentials */}
                  {createStep === "essentials" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-neutral-400">
                          Event Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. All-White Campus Rave & Sound Clash"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-[#00D54B]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-neutral-400">
                            Campus
                          </label>
                          <input
                            type="text"
                            value={newCampus}
                            onChange={(e) => setNewCampus(e.target.value)}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-neutral-400">
                            Venue Location *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Mini Stadium Lawn"
                            value={newVenue}
                            onChange={(e) => setNewVenue(e.target.value)}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-[#00D54B]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-neutral-400">Date</label>
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-neutral-400">Time</label>
                          <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-neutral-400">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tell students about the music, dress code, DJs, and energy..."
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                        />
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setCreateStep("tiers")}
                          className="px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all"
                        >
                          Continue to Tiers →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Ticket Tiers */}
                  {createStep === "tiers" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-base text-white">
                          Configure Ticket Tiers
                        </h4>
                        <button
                          onClick={() =>
                            setNewTiers([
                              ...newTiers,
                              {
                                id: `tier-${Date.now()}`,
                                name: `Tier ${newTiers.length + 1}`,
                                price: 5000,
                                capacity: 50,
                                description: "Custom student pass",
                              },
                            ])
                          }
                          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Tier</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {newTiers.map((tier, index) => (
                          <div
                            key={tier.id}
                            className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={tier.name}
                                onChange={(e) => {
                                  const updated = [...newTiers];
                                  updated[index].name = e.target.value;
                                  setNewTiers(updated);
                                }}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                                placeholder="Tier Name"
                              />
                              <input
                                type="number"
                                value={tier.price}
                                onChange={(e) => {
                                  const updated = [...newTiers];
                                  updated[index].price = Number(e.target.value);
                                  setNewTiers(updated);
                                }}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                                placeholder="Price in NGN"
                              />
                              <input
                                type="number"
                                value={tier.capacity}
                                onChange={(e) => {
                                  const updated = [...newTiers];
                                  updated[index].capacity = Number(e.target.value);
                                  setNewTiers(updated);
                                }}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                                placeholder="Max Capacity"
                              />
                            </div>

                            {newTiers.length > 1 && (
                              <button
                                onClick={() => setNewTiers(newTiers.filter((_, i) => i !== index))}
                                className="text-red-400 hover:text-red-300 p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-between">
                        <button
                          onClick={() => setCreateStep("essentials")}
                          className="text-xs font-mono text-neutral-400 hover:text-white"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => setCreateStep("gate")}
                          className="px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all"
                        >
                          Continue to Gate Setup →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Gate Setup */}
                  {createStep === "gate" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-neutral-400">
                          Gate Scanner Representative Email
                        </label>
                        <input
                          type="email"
                          value={scannerRepEmail}
                          onChange={(e) => setScannerRepEmail(e.target.value)}
                          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none"
                        />
                        <p className="text-[11px] text-neutral-400">
                          This email will receive sub-second offline scanner credentials to validate tickets at the door.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#00D54B]/10 border border-[#00D54B]/20 text-xs text-neutral-300 space-y-1">
                        <strong className="text-[#00D54B] block font-mono">
                          Offline QR Sync Enabled
                        </strong>
                        <span>
                          Gate scanners operate even if campus cell network drops. Passes validate instantly.
                        </span>
                      </div>

                      <div className="pt-2 flex justify-between">
                        <button
                          onClick={() => setCreateStep("tiers")}
                          className="text-xs font-mono text-neutral-400 hover:text-white"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => setCreateStep("payout")}
                          className="px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all"
                        >
                          Continue to Settlement →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Payout Settlement */}
                  {createStep === "payout" && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-neutral-400">
                          Nigerian Bank Name
                        </label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-neutral-400">
                            10-Digit NUBAN Account Number
                          </label>
                          <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-neutral-400">
                            Account Name
                          </label>
                          <input
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => handleCreateNewEvent("draft")}
                          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all"
                        >
                          Save as Draft
                        </button>

                        <button
                          onClick={() => handleCreateNewEvent("published")}
                          className="spicy-btn px-6 py-2.5 rounded-full bg-[#D7F23A] text-black font-mono text-xs font-bold hover:bg-white transition-all shadow-md"
                        >
                          Publish Live to Campus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 4: ORDERS & ATTENDEES (SEARCHABLE ROSTER & GATE CHECK-IN)            */}
            {/* ========================================================================= */}
            {activeTab === "attendees" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                      Orders & Attendee Roster
                    </h2>
                    <p className="text-sm text-neutral-400">
                      Roster for <strong>{activeEvent.title}</strong> ({eventAttendeesList.length} registered).
                    </p>
                  </div>

                  <button
                    onClick={handleExportCsv}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Copy Roster CSV</span>
                  </button>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex-1 max-w-sm relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search attendee, ticket code, email..."
                      value={attendeeSearch}
                      onChange={(e) => setAttendeeSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    {(["all", "paid", "checked_in", "waitlist"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setAttendeeStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg capitalize transition-all ${
                          attendeeStatusFilter === st
                            ? "bg-[#D7F23A] text-black font-bold"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {st === "all"
                          ? "All"
                          : st === "paid"
                          ? "Confirmed"
                          : st === "checked_in"
                          ? "Checked In"
                          : "Waitlist"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table View */}
                <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="border-b border-white/10 bg-white/5 text-neutral-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-4">Attendee Details</th>
                          <th className="p-4">Contact</th>
                          <th className="p-4">Ticket Tier</th>
                          <th className="p-4">Pass Code</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Gate Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredAttendees.map((att) => (
                          <tr key={att.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div className="font-sans font-bold text-white text-sm">
                                {att.name}
                              </div>
                              <div className="text-[11px] text-neutral-400 font-mono">
                                @{att.username || "attendee"}
                              </div>
                            </td>
                            <td className="p-4 text-neutral-300">
                              <div>{att.email}</div>
                              {att.phone && <div className="text-[10px] text-neutral-400">{att.phone}</div>}
                            </td>
                            <td className="p-4 text-neutral-200">{att.ticketTier}</td>
                            <td className="p-4">
                              <button
                                onClick={() => handleCopyCode(att.ticketCode)}
                                className="font-bold text-[#00D54B] hover:underline flex items-center gap-1"
                                title="Click to copy"
                              >
                                <span>{att.ticketCode}</span>
                                <Copy className="w-3 h-3 opacity-60" />
                              </button>
                            </td>
                            <td className="p-4 font-bold text-white">
                              ₦{att.amountPaid.toLocaleString()}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                  att.status === "checked_in"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : att.status === "paid"
                                    ? "bg-[#00D54B]/20 text-[#00D54B] border border-[#00D54B]/30"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {att.status === "checked_in"
                                  ? "Checked In"
                                  : att.status === "paid"
                                  ? "Confirmed"
                                  : "Waitlist"}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {att.status === "paid" && (
                                <button
                                  onClick={() => handleCheckIn(att.id)}
                                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#00D54B] hover:text-black text-white font-mono text-xs font-bold transition-all"
                                >
                                  Mark In Gate
                                </button>
                              )}
                              {att.status === "waitlist" && (
                                <button
                                  onClick={() => handlePromoteAttendee(att.id)}
                                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-black font-mono text-xs font-bold hover:bg-amber-300 transition-all"
                                >
                                  Promote to Paid
                                </button>
                              )}
                              {att.status === "checked_in" && (
                                <span className="text-[11px] text-neutral-400 inline-flex items-center gap-1">
                                  <Check className="w-3 h-3 text-[#00D54B]" /> In Venue ({att.checkedInAt || "Verified"})
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 5: ANALYTICS & AUDIENCE BREAKDOWN                                    */}
            {/* ========================================================================= */}
            {activeTab === "analytics" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Event Performance & Analytics
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Real metrics for <strong>{activeEvent.title}</strong> computed from verified attendee records.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gate Check-In Rate */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      ATTENDANCE VELOCITY
                    </span>
                    <div className="text-4xl font-display font-black text-[#00D54B]">
                      {metrics.checkInRate}%
                    </div>
                    <p className="text-xs text-neutral-400">
                      {metrics.checkedInCount} of {metrics.totalTicketsSold} ticket holders verified at the gate.
                    </p>
                  </div>

                  {/* Average Ticket Yield */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      AVERAGE TICKET YIELD
                    </span>
                    <div className="text-4xl font-display font-black text-white">
                      ₦
                      {metrics.totalTicketsSold > 0
                        ? Math.round(metrics.grossSales / metrics.totalTicketsSold).toLocaleString()
                        : "0"}
                    </div>
                    <p className="text-xs text-neutral-400">
                      Revenue per student across regular and VIP squad allocations.
                    </p>
                  </div>

                  {/* Fee Efficiency */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      PLATFORM FEE RATE
                    </span>
                    <div className="text-4xl font-display font-black text-[#D7F23A]">
                      0.0%
                    </div>
                    <p className="text-xs text-neutral-400">
                      PartyPadi Campus Launch Promotion: 100% net earnings to organizers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 6: GIFTER & SUPPORT SPONSORSHIPS                                     */}
            {/* ========================================================================= */}
            {activeTab === "gifter_support" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Campus Sponsorships & Direct Gifts
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Community support received from alumni, patrons, and student supporters.
                  </p>
                </div>

                {/* Organizer Milestones */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  <h3 className="font-display font-bold text-lg text-white">Organizer Milestones</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {milestones.map((ms) => (
                      <div
                        key={ms.id}
                        className={`p-4 rounded-2xl border ${
                          ms.unlocked
                            ? "bg-[#00D54B]/10 border-[#00D54B]/30"
                            : "bg-white/5 border-white/10 opacity-70"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-display font-bold text-sm text-white">
                            {ms.title}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#00D54B] inline-flex items-center gap-1">
                            {ms.unlocked ? (
                              <>
                                <Check className="w-3 h-3" /> Unlocked
                              </>
                            ) : (
                              `${ms.progress}%`
                            )}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">{ms.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporter List */}
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-lg text-white">
                    Verified Supporters ({eventGiftsList.length})
                  </h3>

                  {eventGiftsList.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-neutral-400">
                      No sponsorships recorded for this event yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {eventGiftsList.map((g) => (
                        <div
                          key={g.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="font-display font-bold text-sm text-white flex items-center gap-2">
                              <span>{g.gifterName}</span>
                              <GifterBadge level={g.level} size="sm" showLabel={true} />
                            </div>
                            {g.message && (
                              <p className="text-xs text-neutral-300 italic">
                                &quot;{g.message}&quot;
                              </p>
                            )}
                          </div>

                          <div className="text-right font-mono font-bold text-[#D7F23A] text-sm shrink-0">
                            +₦{g.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 7: ORGANIZER PROFILE                                                 */}
            {/* ========================================================================= */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in duration-200 max-w-2xl">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Organizer Profile & Brand Identity
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Your official host brand displayed on event detail pages and tickets.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#D7F23A] text-black font-display font-black text-2xl flex items-center justify-center">
                      {organizerUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-white">
                        {organizerUser.fullName}
                      </h3>
                      <div className="text-xs font-mono text-[#00D54B]">
                        @{organizerUser.username} • Verified Campus Host
                      </div>
                      <div className="text-xs text-neutral-400">{organizerUser.campus}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-mono uppercase text-neutral-400 block font-bold">
                      Official Contact Email
                    </span>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-neutral-300">
                      {organizerUser.email}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-mono uppercase text-neutral-400 block font-bold">
                      Bio & Organization Scope
                    </span>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-neutral-300">
                      {organizerUser.bio}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 8: SETTINGS & SETTLEMENT CONFIGURATION                               */}
            {/* ========================================================================= */}
            {activeTab === "settings" && (
              <div className="space-y-8 animate-in fade-in duration-200 max-w-2xl">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Organizer Settings & Bank Payouts
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Manage virtual accounts, payout bank information, and gate scanner team access.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-base text-white">
                      Payout Bank Account
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-neutral-400 block mb-1">
                          Account Name
                        </label>
                        <input
                          type="text"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <h3 className="font-display font-bold text-base text-white">Switch Mode</h3>
                    <p className="text-xs text-neutral-400">
                      Switch to Partygoer mode to discover events as an attendee.
                    </p>
                    <button
                      onClick={handleSwitchToPartygoer}
                      className="px-4 py-2 rounded-xl bg-[#00D54B] text-black font-mono text-xs font-bold hover:bg-[#D7F23A] transition-all"
                    >
                      Switch to Partygoer Hub
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-mono text-xs font-bold transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation for Organizer */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0D0E]/98 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl"
        aria-label="Organizer Mobile Bottom Navigation"
      >
        {[
          { id: "overview" as OrganizerTab, label: "Overview", icon: LayoutDashboard },
          { id: "my_events" as OrganizerTab, label: "Events", icon: Calendar },
          { id: "create_event" as OrganizerTab, label: "Create", icon: PlusCircle },
          { id: "attendees" as OrganizerTab, label: "Attendees", icon: Users },
          { id: "settings" as OrganizerTab, label: "Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? "text-[#D7F23A] font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-mono mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
