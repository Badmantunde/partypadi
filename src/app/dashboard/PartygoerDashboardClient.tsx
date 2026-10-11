"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CampusEvent,
  EventCategory,
  CampusOption,
  UserProfile,
} from "@/types";
import { useAuth, GIFTER_LEVEL_INFO, getNextLevelProgress } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { PartyPadiLogo } from "@/components/PartyPadiLogo";
import { GifterBadge } from "@/components/GifterBadge";
import { TicketModal } from "@/components/TicketModal";
import { PartyCircleModal } from "@/components/PartyCircleModal";
import { GiftSupportModal } from "@/components/GiftSupportModal";
import { getPublicUrl } from "@/lib/urls";
import {
  Sparkles,
  Compass,
  Grid,
  Users2,
  Ticket,
  Bookmark,
  Gift,
  User,
  Settings,
  LogOut,
  Search,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  QrCode,
  CheckCircle2,
  Share2,
  ChevronRight,
  Filter,
  Flame,
  ShieldCheck,
  TrendingUp,
  Tag,
  SlidersHorizontal,
  Home,
  Check,
  Building2,
  ExternalLink,
  X,
} from "lucide-react";

interface PartygoerDashboardClientProps {
  initialEvents: CampusEvent[];
  campusOptions: CampusOption[];
}

type DashboardTab =
  | "for_you"
  | "discover"
  | "categories"
  | "circles"
  | "tickets"
  | "saved"
  | "gifter"
  | "profile"
  | "settings";

export function PartygoerDashboardClient({
  initialEvents,
  campusOptions,
}: PartygoerDashboardClientProps) {
  const {
    currentUser,
    allUsers,
    circles,
    gifts,
    savedEvents,
    toggleSaveEvent,
    isEventSaved,
    rsvpEvent,
    getFriendsAttendingEvent,
    switchRole,
    logout,
    openCircleModal,
  } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<DashboardTab>("for_you");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");
  const [selectedCampusId, setSelectedCampusId] = useState<string>("oou");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  // Modals & Active Event selection
  const [ticketModalEvent, setTicketModalEvent] = useState<CampusEvent | null>(null);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [activeGiftTarget, setActiveGiftTarget] = useState<{
    eventId?: string;
    eventTitle?: string;
    organizerName?: string;
  }>({});
  const [qrCodeModalEvent, setQrCodeModalEvent] = useState<{
    event: CampusEvent;
    ticketCode: string;
    status: string;
  } | null>(null);

  // Persistent Player / Vibe Bar state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(32); // percentage for visual scrubber

  // Fallback demo user if not logged in
  const user = currentUser || {
    id: "user-1",
    username: "tade_vibes",
    fullName: "Tade Adeyemi",
    email: "tade@gmail.com",
    role: "partygoer" as const,
    roles: ["partygoer" as const],
    campus: "Main Campus",
    bio: "Main Hall vibes & sunset sessions lover",
    gifterLevel: 1 as const,
    totalGifted: 3500,
    friends: ["fola_vibes", "chioma_k"],
    savedEventIds: ["fassa-dinner-awards", "campus-unplugged"],
    eventsAttending: [
      {
        eventId: "after-class-sunset",
        allowFriendsToSee: true,
        ticketCode: "PP-829141",
        purchasedAt: "2026-10-09",
      },
      {
        eventId: "green-room-sessions",
        allowFriendsToSee: true,
        ticketCode: "PP-194012",
        purchasedAt: "2026-10-10",
      },
    ],
  };

  // Find user's upcoming tickets
  const userTickets = useMemo(() => {
    return user.eventsAttending
      .map((att) => {
        const ev = initialEvents.find((e) => e.id === att.eventId);
        if (!ev) return null;
        return {
          event: ev,
          ticketCode: att.ticketCode || "PP-CONFIRMED",
          purchasedAt: att.purchasedAt,
          allowFriendsToSee: att.allowFriendsToSee,
        };
      })
      .filter(Boolean) as Array<{
      event: CampusEvent;
      ticketCode: string;
      purchasedAt: string;
      allowFriendsToSee: boolean;
    }>;
  }, [user.eventsAttending, initialEvents]);

  // Featured event for persistent player / bar
  const activeUpcomingPass = userTickets[0] || null;
  const headlineEvent = initialEvents[0];

  // User's saved events
  const userSavedEventsList = useMemo(() => {
    return initialEvents.filter((e) => isEventSaved(e.id));
  }, [initialEvents, isEventSaved]);

  // Filtered events based on search, category, campus, price
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      if (selectedCategory !== "all" && event.category !== selectedCategory) {
        return false;
      }
      if (priceFilter === "free" && !event.isFree && event.priceStartingFrom > 0) {
        return false;
      }
      if (priceFilter === "paid" && (event.isFree || event.priceStartingFrom === 0)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = event.title.toLowerCase().includes(q);
        const matchSubtitle = event.subtitle.toLowerCase().includes(q);
        const matchVenue = event.venue.toLowerCase().includes(q);
        const matchOrg = event.organizer.name.toLowerCase().includes(q);
        const matchCategory = event.categoryLabel.toLowerCase().includes(q);
        return matchTitle || matchSubtitle || matchVenue || matchOrg || matchCategory;
      }
      return true;
    });
  }, [initialEvents, selectedCategory, priceFilter, searchQuery]);

  // Friends attending specific events
  const friendsAttendingMap = useMemo(() => {
    const map = new Map<string, Array<{ username: string; fullName: string }>>();
    for (const ev of initialEvents) {
      map.set(ev.id, getFriendsAttendingEvent(ev.id));
    }
    return map;
  }, [initialEvents, getFriendsAttendingEvent]);

  // Gifter level progress
  const levelProgress = getNextLevelProgress(user.totalGifted || 0);

  const handleToggleFavorite = (eventId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newlySaved = toggleSaveEvent(eventId);
    showToast({
      type: newlySaved ? "success" : "info",
      title: newlySaved ? "Event Bookmarked" : "Removed from Saved",
      message: newlySaved
        ? "Saved to your Partygoer library."
        : "Removed from your saved events list.",
    });
  };

  const handleOpenTicket = (event: CampusEvent, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTicketModalEvent(event);
  };

  const handleOpenGiftSupport = (event: CampusEvent, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveGiftTarget({
      eventId: event.id,
      eventTitle: event.title,
      organizerName: event.organizer.name,
    });
    setGiftModalOpen(true);
  };

  const handleSwitchToOrganizer = () => {
    switchRole("organizer");
    showToast({
      type: "info",
      title: "Switched Workspace",
      message: "Entering Organizer Studio mode.",
    });
  };

  const categoriesList: { id: EventCategory; label: string; count: number }[] = [
    { id: "all", label: "All Events", count: initialEvents.length },
    {
      id: "parties",
      label: "Parties & Nightlife",
      count: initialEvents.filter((e) => e.category === "parties").length,
    },
    {
      id: "concerts",
      label: "Concerts & Live Sets",
      count: initialEvents.filter((e) => e.category === "concerts").length,
    },
    {
      id: "dinners",
      label: "Dinners & Galas",
      count: initialEvents.filter((e) => e.category === "dinners").length,
    },
    {
      id: "cultural",
      label: "Cultural & Games",
      count: initialEvents.filter((e) => e.category === "cultural").length,
    },
    {
      id: "networking",
      label: "Department & Tech",
      count: initialEvents.filter((e) => e.category === "networking").length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans selection:bg-[#00D54B] selection:text-black">
      {/* Top Application Canvas Frame */}
      <div className="flex-1 flex w-full max-w-[1680px] mx-auto min-h-screen">
        {/* ========================================================================= */}
        {/* DESKTOP PERSISTENT SIDEBAR (INSPIRED BY REFERENCE IMAGE)                  */}
        {/* ========================================================================= */}
        <aside
          className="hidden lg:flex w-64 xl:w-72 flex-col shrink-0 border-r border-white/10 bg-[#0C0D0E] p-5 h-screen sticky top-0 justify-between select-none"
          aria-label="Partygoer Navigation"
        >
          {/* Top Brand & Profile */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setActiveTab("for_you")}
                className="flex items-center gap-2 group transition-transform text-left cursor-pointer"
                title="Dashboard Overview"
              >
                <PartyPadiLogo theme="dark" size="md" />
              </button>
              <span className="px-2 py-0.5 rounded-full bg-[#00D54B]/15 text-[#00D54B] border border-[#00D54B]/30 text-[10px] font-mono font-bold tracking-wider uppercase">
                Partygoer
              </span>
            </div>

            {/* User Profile Mini Badge */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#00D54B] text-[#0C0D0E] font-display font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {user.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold text-white truncate">
                    @{user.username}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D54B]" />
                    <span>{user.campus}</span>
                  </div>
                </div>
              </div>
              <GifterBadge level={user.gifterLevel || 1} size="sm" showLabel={false} />
            </div>

            {/* Primary Navigation Menu */}
            <nav className="space-y-1.5" aria-label="Main App Sections">
              {[
                { id: "for_you" as DashboardTab, label: "For You", icon: Home, badge: null },
                {
                  id: "discover" as DashboardTab,
                  label: "Discover Events",
                  icon: Compass,
                  badge: initialEvents.length,
                },
                { id: "categories" as DashboardTab, label: "Categories", icon: Grid, badge: null },
                {
                  id: "circles" as DashboardTab,
                  label: "Padi Circle",
                  icon: Users2,
                  badge: circles.length,
                },
                {
                  id: "tickets" as DashboardTab,
                  label: "My Tickets",
                  icon: Ticket,
                  badge: userTickets.length > 0 ? userTickets.length : null,
                  badgeColor: "bg-[#00D54B] text-black",
                },
                {
                  id: "saved" as DashboardTab,
                  label: "Saved Events",
                  icon: Bookmark,
                  badge: savedEvents.length > 0 ? savedEvents.length : null,
                },
                { id: "gifter" as DashboardTab, label: "Padi Gifter", icon: Gift, badge: null },
                { id: "profile" as DashboardTab, label: "Profile", icon: User, badge: null },
                { id: "settings" as DashboardTab, label: "Settings", icon: Settings, badge: null },
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
                          isActive ? "text-[#00D54B]" : "text-neutral-400 group-hover:text-white"
                        }`}
                      />
                      <span className={isActive ? "text-white" : "text-neutral-300"}>
                        {item.label}
                      </span>
                    </div>

                    {item.badge !== null && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          item.badgeColor || "bg-white/10 text-neutral-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Utility Actions */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            {/* Switch to Organizer view */}
            <button
              onClick={handleSwitchToOrganizer}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#D7F23A] bg-[#D7F23A]/10 hover:bg-[#D7F23A]/20 border border-[#D7F23A]/25 transition-all group"
              title="Enter Organizer Studio"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#D7F23A]" />
                <span className="font-semibold">Organizer Studio</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Back to Public Marketing Site */}
            <Link
              href={getPublicUrl("/")}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            {/* Logout */}
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
        {/* MAIN APPLICATION CONTENT AREA                                             */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#070809] pb-32 lg:pb-28">
          {/* Top Bar Header (Desktop & Mobile) */}
          <header className="sticky top-0 z-30 bg-[#0C0D0E]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
            {/* Mobile Brand & Logo */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("for_you")}
                className="text-left cursor-pointer"
                title="Dashboard Overview"
              >
                <PartyPadiLogo theme="dark" size="sm" />
              </button>
            </div>

            {/* Greeting & Campus Selector */}
            <div className="hidden sm:flex flex-col">
              <div className="text-sm sm:text-base font-display font-medium text-white flex items-center gap-2">
                <span>Welcome back, {user.fullName.split(" ")[0]}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#00D54B]" />
              </div>
              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                <span>{user.campus}</span>
                <span>•</span>
                <span className="text-[#00D54B]">Active Semester Wave</span>
              </div>
            </div>

            {/* Live Search Input with Instant Filtering */}
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events, venues, vibes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00D54B] focus:ring-1 focus:ring-[#00D54B] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Top Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Campus Selector Dropdown Pill */}
              <select
                value={selectedCampusId}
                onChange={(e) => setSelectedCampusId(e.target.value)}
                className="hidden md:inline-flex px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white focus:outline-none cursor-pointer"
              >
                {campusOptions.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0C0D0E] text-white">
                    {c.shortName} ({c.name.split(" ")[0]})
                  </option>
                ))}
              </select>

              {/* Gifter Progress Chip */}
              <button
                onClick={() => setActiveTab("gifter")}
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-[#D7F23A] transition-all"
                title="View Gifter Tier Status"
              >
                <Flame className="w-3.5 h-3.5 text-[#D7F23A]" />
                <span>Level {user.gifterLevel || 1} Gifter</span>
              </button>

              {/* Mobile Profile Trigger */}
              <button
                onClick={() => setActiveTab("profile")}
                className="lg:hidden w-8 h-8 rounded-full bg-[#00D54B] text-black font-display font-bold text-xs flex items-center justify-center shrink-0"
              >
                {user.fullName.charAt(0)}
              </button>
            </div>
          </header>

          {/* Tab View Switcher Content */}
          <div className="p-4 sm:p-8 space-y-8 max-w-[1536px] w-full mx-auto">
            {/* ========================================================================= */}
            {/* VIEW 1: FOR YOU (MAIN PERSONALIZED EVENT DISCOVERY EXPERIENCE)            */}
            {/* ========================================================================= */}
            {activeTab === "for_you" && (
              <div className="space-y-10 animate-in fade-in duration-200">
                {/* 1. TOP FEATURED CARDS (SIDE-BY-SIDE INSPIRATION FROM REFERENCE) */}
                <section aria-label="Featured Campus Events" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00D54B]" />
                      FEATURED CAMPUS HEADLINERS
                    </span>
                    <button
                      onClick={() => setActiveTab("discover")}
                      className="text-xs font-mono text-[#00D54B] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {/* Featured Card 1: Vibrant Yellow / Lime Glow (#D7F23A) with Ink typography */}
                    {headlineEvent && (
                      <div className="relative rounded-3xl bg-[#D7F23A] text-black p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-lg group transition-transform hover:-translate-y-0.5 min-h-[260px]">
                        {/* Top Meta Pill */}
                        <div className="flex items-center justify-between z-10">
                          <span className="px-3 py-1 rounded-full bg-black/15 text-black text-xs font-mono font-bold backdrop-blur-xs">
                            {headlineEvent.statusBadge || "Selling Fast"} • {headlineEvent.shortDate}
                          </span>
                          <button
                            onClick={(e) => handleToggleFavorite(headlineEvent.id, e)}
                            className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-black transition-colors"
                            aria-label="Save event"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isEventSaved(headlineEvent.id) ? "fill-black" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Title & Info */}
                        <div className="my-4 z-10 space-y-1">
                          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight">
                            {headlineEvent.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-black/80 font-sans line-clamp-2 max-w-md">
                            {headlineEvent.subtitle}
                          </p>
                          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-black/70">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {headlineEvent.venue}
                            </span>
                            <span>•</span>
                            <span>From ₦{headlineEvent.priceStartingFrom.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between z-10 pt-2">
                          <button
                            onClick={(e) => handleOpenTicket(headlineEvent, e)}
                            className="spicy-btn px-5 py-2.5 rounded-full bg-black text-[#D7F23A] font-mono text-xs font-bold hover:bg-neutral-900 transition-all shadow-md flex items-center gap-2"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>Get Ticket Pass</span>
                          </button>
                          <Link
                            href={`/events/${headlineEvent.id}`}
                            className="text-xs font-mono font-bold text-black underline underline-offset-4 hover:opacity-80"
                          >
                            Details →
                          </Link>
                        </div>

                        {/* Decorative Background Artwork / Overlay */}
                        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-15 pointer-events-none mix-blend-multiply flex items-end justify-end p-4">
                          <Ticket className="w-48 h-48 -mr-10 -mb-10" />
                        </div>
                      </div>
                    )}

                    {/* Featured Card 2: Vibrant Violet / Coral Theme (#7B3FFF) */}
                    {initialEvents[1] && (
                      <div className="relative rounded-3xl bg-[#7B3FFF] text-white p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-lg group transition-transform hover:-translate-y-0.5 min-h-[260px]">
                        {/* Top Meta Pill */}
                        <div className="flex items-center justify-between z-10">
                          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold backdrop-blur-xs">
                            {initialEvents[1].statusBadge || "Campus Pick"} • {initialEvents[1].shortDate}
                          </span>
                          <button
                            onClick={(e) => handleToggleFavorite(initialEvents[1].id, e)}
                            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                            aria-label="Save event"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isEventSaved(initialEvents[1].id) ? "fill-white" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Title & Info */}
                        <div className="my-4 z-10 space-y-1">
                          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight">
                            {initialEvents[1].title}
                          </h2>
                          <p className="text-xs sm:text-sm text-white/85 font-sans line-clamp-2 max-w-md">
                            {initialEvents[1].subtitle}
                          </p>
                          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-white/80">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {initialEvents[1].venue}
                            </span>
                            <span>•</span>
                            <span>From ₦{initialEvents[1].priceStartingFrom.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between z-10 pt-2">
                          <button
                            onClick={(e) => handleOpenTicket(initialEvents[1], e)}
                            className="spicy-btn px-5 py-2.5 rounded-full bg-white text-[#7B3FFF] font-mono text-xs font-bold hover:bg-neutral-100 transition-all shadow-md flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Reserve Seat</span>
                          </button>
                          <Link
                            href={`/events/${initialEvents[1].id}`}
                            className="text-xs font-mono font-bold text-white underline underline-offset-4 hover:opacity-80"
                          >
                            View Lineup →
                          </Link>
                        </div>

                        {/* Decorative Background Overlay */}
                        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-15 pointer-events-none mix-blend-screen flex items-end justify-end p-4">
                          <Sparkles className="w-48 h-48 -mr-10 -mb-10 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* 2. COMPACT INFORMATION ROWS (BASED ON YOUR INTERESTS - MATCHING REFERENCE IMAGE) */}
                <section aria-label="Based on your interests" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                      Based on your interests
                    </h3>
                    <button
                      onClick={() => setActiveTab("discover")}
                      className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 group"
                    >
                      <span>View more</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  {/* Compact list rows (thumbnail, title/artist, category, time/price, favorite) */}
                  <div className="space-y-2">
                    {initialEvents.slice(2, 6).map((item) => {
                      const friendsGoing = friendsAttendingMap.get(item.id) || [];
                      const saved = isEventSaved(item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
                          onClick={() => handleOpenTicket(item)}
                        >
                          {/* Left: Thumbnail & Title Info */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Artwork Thumbnail */}
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-white/10">
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <h4 className="font-display font-bold text-sm sm:text-base text-white truncate group-hover:text-[#00D54B] transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-xs text-neutral-400 truncate">
                                {item.organizer.name} • {item.venue}
                              </p>
                              {friendsGoing.length > 0 && (
                                <p className="text-[11px] font-mono text-[#D7F23A] flex items-center gap-1 truncate">
                                  <span>@{friendsGoing[0].username}</span>
                                  {friendsGoing.length > 1 && (
                                    <span>+{friendsGoing.length - 1} going</span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Center: Category badge (hidden on tiny screens) */}
                          <div className="hidden md:flex items-center shrink-0">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-xs font-mono">
                              {item.categoryLabel}
                            </span>
                          </div>

                          {/* Right: Date, Price & Actions */}
                          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                            <div className="text-right">
                              <span className="text-xs sm:text-sm font-mono font-bold text-white block">
                                {item.isFree ? "Free" : `₦${item.priceStartingFrom.toLocaleString()}`}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-400 block">
                                {item.shortDate}
                              </span>
                            </div>

                            {/* Heart / Bookmark toggle */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(item.id, e)}
                              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                              aria-label="Save to favorites"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  saved ? "fill-[#00D54B] text-[#00D54B]" : ""
                                }`}
                              />
                            </button>

                            {/* Quick Pass button */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenTicket(item, e)}
                              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#00D54B] hover:text-black font-mono text-xs font-bold transition-all"
                            >
                              Get Ticket
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 3. CATEGORY PILL FILTER STRIP (MATCHING REFERENCE ROW) */}
                <section aria-label="Event Categories" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {categoriesList.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all ${
                            selectedCategory === cat.id
                              ? "bg-white text-black font-bold shadow-sm"
                              : "bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveTab("categories")}
                      className="hidden sm:flex text-xs font-mono text-neutral-400 hover:text-white items-center gap-1 shrink-0 ml-4"
                    >
                      <span>All categories</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* 4. GRID OF VIBRANT EVENT CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredEvents.map((event) => {
                      const isSaved = isEventSaved(event.id);
                      const friendsGoing = friendsAttendingMap.get(event.id) || [];
                      return (
                        <div
                          key={event.id}
                          className="flex flex-col justify-between rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                        >
                          {/* Event Image Banner with Badge */}
                          <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-900">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Top Badge & Favorite Button */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/10">
                                {event.shortDate}
                              </span>
                              <button
                                onClick={(e) => handleToggleFavorite(event.id, e)}
                                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-[#00D54B] transition-colors"
                                aria-label="Toggle favorite"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${
                                    isSaved ? "fill-[#00D54B] text-[#00D54B]" : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Bottom Location */}
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90">
                              <span className="truncate flex items-center gap-1 max-w-[70%]">
                                <MapPin className="w-3 h-3 text-[#00D54B] shrink-0" />
                                <span className="truncate">{event.venue}</span>
                              </span>
                              <span className="font-bold text-[#D7F23A]">
                                {event.isFree ? "Free" : `From ₦${event.priceStartingFrom.toLocaleString()}`}
                              </span>
                            </div>
                          </div>

                          {/* Event Details Content */}
                          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                {event.categoryLabel}
                              </span>
                              <h4 className="font-display font-bold text-base text-white group-hover:text-[#00D54B] transition-colors line-clamp-1">
                                {event.title}
                              </h4>
                              <p className="text-xs text-neutral-400 line-clamp-2">
                                {event.subtitle}
                              </p>
                            </div>

                            {/* Friends attending or sponsor progress */}
                            {friendsGoing.length > 0 && (
                              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-[#00D54B]">
                                <Users2 className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">
                                  @{friendsGoing[0].username} is attending
                                </span>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                              <button
                                onClick={(e) => handleOpenTicket(event, e)}
                                className="spicy-btn flex-1 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all text-center"
                              >
                                Get Pass
                              </button>
                              <button
                                onClick={(e) => handleOpenGiftSupport(event, e)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                                title="Support Event / Sponsor"
                              >
                                <Gift className="w-4 h-4 text-[#D7F23A]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: DISCOVER EVENTS CATALOG (FULL SEARCH & ADVANCED FILTERS)          */}
            {/* ========================================================================= */}
            {activeTab === "discover" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Campus Event Catalog
                  </h2>
                  <p className="text-sm text-neutral-400 max-w-2xl">
                    Every approved rave, sound clash, faculty gala, and builder meet across Nigerian universities.
                  </p>
                </div>

                {/* Filter Matrix */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#00D54B]" />
                      <span className="text-xs font-mono font-bold uppercase text-white">
                        Filter By:
                      </span>
                    </div>

                    {/* Price filter chips */}
                    <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                      {(["all", "free", "paid"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPriceFilter(p)}
                          className={`px-3 py-1 rounded-lg capitalize transition-all ${
                            priceFilter === p
                              ? "bg-[#00D54B] text-black font-bold"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          {p === "all" ? "All Prices" : p === "free" ? "Free Only" : "Paid"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                          selectedCategory === cat.id
                            ? "bg-white text-black font-bold"
                            : "bg-white/5 hover:bg-white/10 text-neutral-400 border border-white/10"
                        }`}
                      >
                        {cat.label} ({cat.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 overflow-hidden flex flex-col justify-between transition-all group"
                    >
                      <div className="relative aspect-16/10 w-full overflow-hidden">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => handleToggleFavorite(event.id, e)}
                            className="p-2 rounded-full bg-black/60 text-white"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isEventSaved(event.id) ? "fill-[#00D54B] text-[#00D54B]" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            {event.categoryLabel}
                          </span>
                          <h4 className="font-display font-bold text-base text-white truncate">
                            {event.title}
                          </h4>
                          <p className="text-xs text-neutral-400 line-clamp-2">{event.subtitle}</p>
                          <div className="pt-2 text-xs font-mono text-neutral-300 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#00D54B]">
                            {event.isFree ? "Free Entry" : `₦${event.priceStartingFrom.toLocaleString()}`}
                          </span>
                          <button
                            onClick={(e) => handleOpenTicket(event, e)}
                            className="px-4 py-1.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all"
                          >
                            Get Pass
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 3: CATEGORIES BROWSER                                                */}
            {/* ========================================================================= */}
            {activeTab === "categories" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Event Categories & Campus Vibes
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Explore campus nightlife and cultural activities curated by type.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoriesList
                    .filter((c) => c.id !== "all")
                    .map((cat) => {
                      const sampleEvent = initialEvents.find((e) => e.category === cat.id);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setActiveTab("discover");
                          }}
                          className="p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00D54B]/40 transition-all cursor-pointer space-y-4 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="w-10 h-10 rounded-2xl bg-[#00D54B]/15 text-[#00D54B] flex items-center justify-center font-display font-bold">
                              #
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/10 font-mono text-xs text-white">
                              {cat.count} Events
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-display font-bold text-xl text-white group-hover:text-[#00D54B] transition-colors">
                              {cat.label}
                            </h3>
                            <p className="text-xs text-neutral-400">
                              {cat.id === "parties" &&
                                "Late night sound clashes, amapiano raves, and courtyard link-ups."}
                              {cat.id === "concerts" &&
                                "Live campus bands, acoustic sessions, and student festivals."}
                              {cat.id === "dinners" &&
                                "Black-tie faculty awards, departmental galas, and recognition banquets."}
                              {cat.id === "cultural" &&
                                "Pan-African culture showcases, fashion pageants, and drum competitions."}
                              {cat.id === "networking" &&
                                "Student founder pitch nights, builder meetups, and mentor mixers."}
                            </p>
                          </div>

                          <div className="pt-2 flex items-center text-xs font-mono text-[#00D54B] font-bold gap-1">
                            <span>Browse category</span>
                            <span>→</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 4: PADI CIRCLE SQUAD HUB                                             */}
            {/* ========================================================================= */}
            {activeTab === "circles" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                      Padi Circles & Squad Plans
                    </h2>
                    <p className="text-sm text-neutral-400">
                      Coordinate with friends, vote on weekend events, and get tickets together.
                    </p>
                  </div>

                  <button
                    onClick={() => openCircleModal()}
                    className="spicy-btn px-5 py-2.5 rounded-full bg-[#00D54B] text-black font-mono text-xs font-bold hover:bg-[#D7F23A] transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
                  >
                    <Users2 className="w-4 h-4" />
                    <span>Create New Circle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {circles.map((circle) => {
                    const targetEvent = initialEvents.find((e) => e.id === circle.targetEventId);
                    return (
                      <div
                        key={circle.id}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display font-bold text-xl text-white">
                              {circle.name}
                            </h3>
                            <span className="text-xs font-mono text-neutral-400">
                              Created by @{circle.createdBy} • Code:{" "}
                              <strong className="text-[#00D54B]">{circle.inviteCode}</strong>
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white">
                            {circle.members.length} Members
                          </span>
                        </div>

                        {circle.description && (
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            {circle.description}
                          </p>
                        )}

                        {targetEvent ? (
                          <div className="p-4 rounded-2xl bg-white/5 border border-[#00D54B]/30 flex items-center justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-mono text-[#00D54B] font-bold uppercase">
                                SELECTED CIRCLE PLAN:
                              </span>
                              <div className="font-display font-bold text-sm text-white">
                                {targetEvent.title}
                              </div>
                              <div className="text-xs font-mono text-neutral-400">
                                {targetEvent.date} • {targetEvent.venue}
                              </div>
                            </div>
                            <button
                              onClick={() => handleOpenTicket(targetEvent)}
                              className="px-4 py-2 rounded-xl bg-[#00D54B] text-black font-mono text-xs font-bold shrink-0"
                            >
                              Get Ticket
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center justify-between">
                            <span>Voting currently open for this circle</span>
                            <span className="text-neutral-400">
                              {circle.suggestions.length} suggestions
                            </span>
                          </div>
                        )}

                        {/* Member avatars */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-neutral-400">
                          <div className="flex items-center gap-1.5">
                            {circle.members.map((m) => (
                              <span
                                key={m}
                                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[10px] flex items-center justify-center font-bold"
                                title={`@${m}`}
                              >
                                {m.charAt(0).toUpperCase()}
                              </span>
                            ))}
                          </div>

                          <Link
                            href={`/circles/${circle.id}`}
                            className="text-[#00D54B] hover:underline"
                          >
                            Open Circle Discussion →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 5: MY TICKETS WALLET                                                 */}
            {/* ========================================================================= */}
            {activeTab === "tickets" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    My Campus Ticket Passes
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Instant gate QR access passes. Verified offline gate sync with zero paper delays.
                  </p>
                </div>

                {userTickets.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4 max-w-xl mx-auto">
                    <Ticket className="w-12 h-12 text-neutral-500 mx-auto" />
                    <h3 className="font-display font-bold text-lg text-white">No active passes yet</h3>
                    <p className="text-xs text-neutral-400">
                      Ready to turn up? Discover live events happening on campus this weekend.
                    </p>
                    <button
                      onClick={() => setActiveTab("for_you")}
                      className="px-6 py-2.5 rounded-full bg-[#00D54B] text-black font-mono text-xs font-bold"
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userTickets.map(({ event, ticketCode, purchasedAt }) => (
                      <div
                        key={ticketCode}
                        className="rounded-3xl bg-white/5 border border-white/15 p-6 flex flex-col justify-between space-y-5 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#00D54B]/20 text-[#00D54B] border border-[#00D54B]/30 text-[10px] font-mono font-bold">
                              CONFIRMED GATE PASS
                            </span>
                            <h3 className="font-display font-bold text-xl text-white">
                              {event.title}
                            </h3>
                            <p className="text-xs text-neutral-400">
                              {event.date} • {event.time}
                            </p>
                            <p className="text-xs font-mono text-neutral-300">
                              Venue: {event.venue}
                            </p>
                          </div>

                          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                            <QrCode className="w-full h-full text-black" />
                          </div>
                        </div>

                        {/* Pass Code Barcode Area */}
                        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                              TICKET CODE
                            </span>
                            <span className="font-mono font-bold text-base text-[#00D54B]">
                              {ticketCode}
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              setQrCodeModalEvent({
                                event,
                                ticketCode,
                                status: "Confirmed",
                              })
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all"
                          >
                            View QR Pass
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-2 border-t border-white/10">
                          <span>Issued: {purchasedAt}</span>
                          <Link href={`/events/${event.id}`} className="text-[#00D54B] hover:underline">
                            Event Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 6: SAVED EVENTS LIBRARY                                              */}
            {/* ========================================================================= */}
            {activeTab === "saved" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Saved Events ({userSavedEventsList.length})
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Events bookmarked to keep on your radar.
                  </p>
                </div>

                {userSavedEventsList.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4 max-w-xl mx-auto">
                    <Bookmark className="w-12 h-12 text-neutral-500 mx-auto" />
                    <h3 className="font-display font-bold text-lg text-white">No saved events yet</h3>
                    <p className="text-xs text-neutral-400">
                      Tap the heart icon on any event card or row to save it here.
                    </p>
                    <button
                      onClick={() => setActiveTab("for_you")}
                      className="px-6 py-2.5 rounded-full bg-[#00D54B] text-black font-mono text-xs font-bold"
                    >
                      Explore Events
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userSavedEventsList.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-neutral-400 uppercase">
                              {event.categoryLabel}
                            </span>
                            <button
                              onClick={(e) => handleToggleFavorite(event.id, e)}
                              className="text-[#00D54B] text-xs font-mono hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <h3 className="font-display font-bold text-lg text-white">
                            {event.title}
                          </h3>
                          <p className="text-xs text-neutral-400">{event.subtitle}</p>
                          <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span>{event.date}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#00D54B]">
                            {event.isFree ? "Free" : `From ₦${event.priceStartingFrom.toLocaleString()}`}
                          </span>
                          <button
                            onClick={(e) => handleOpenTicket(event, e)}
                            className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all"
                          >
                            Get Pass
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 7: PADI GIFTER STATUS & COMMUNITY BADGES                             */}
            {/* ========================================================================= */}
            {activeTab === "gifter" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Padi Gifter Status & Campus Sponsorship
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Level up your campus status by supporting student organizers, DJ rigs, and event sound engineering.
                  </p>
                </div>

                {/* Gifter Level Progression Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-white/10 via-[#0C0D0E] to-black border border-white/15 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <GifterBadge level={user.gifterLevel || 1} size="lg" showLabel={false} />
                      <div>
                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                          CURRENT GIFTER TIER
                        </span>
                        <h3 className="text-2xl font-display font-bold text-white">
                          Level {user.gifterLevel || 1} — {GIFTER_LEVEL_INFO[user.gifterLevel || 1].name}
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {GIFTER_LEVEL_INFO[user.gifterLevel || 1].meaning}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs font-mono text-neutral-400 block">
                        TOTAL SUPPORT GIVEN
                      </span>
                      <span className="text-2xl font-mono font-bold text-[#D7F23A]">
                        ₦{(user.totalGifted || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar to next level */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-neutral-400">
                      <span>{levelProgress.text}</span>
                      <span>{levelProgress.percent}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00D54B] to-[#D7F23A] transition-all duration-500"
                        style={{ width: `${levelProgress.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* All 6 Tiers Explanation */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white">The 6 Gifter Tiers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {([1, 2, 3, 4, 5, 6] as const).map((lvl) => {
                      const info = GIFTER_LEVEL_INFO[lvl];
                      const isCurrent = (user.gifterLevel || 1) === lvl;
                      return (
                        <div
                          key={lvl}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCurrent
                              ? "bg-[#00D54B]/10 border-[#00D54B]/40 shadow-sm"
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-bold text-base text-white">
                              Level {lvl}: {info.name}
                            </span>
                            <span className="text-xs font-mono text-neutral-400">
                              {info.description}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400">{info.meaning}</p>
                          {isCurrent && (
                            <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#00D54B]">
                              <Check className="w-3 h-3" /> Current Level
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 8: STUDENT PROFILE                                                   */}
            {/* ========================================================================= */}
            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in duration-200 max-w-2xl">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Student Profile
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Your campus identity, matriculation details, and friend connections.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#00D54B] text-black font-display font-black text-2xl flex items-center justify-center">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-white">{user.fullName}</h3>
                      <div className="text-xs font-mono text-[#00D54B]">@{user.username}</div>
                      <div className="text-xs text-neutral-400">{user.campus}</div>
                    </div>
                  </div>

                  {user.bio && (
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-300">
                      &quot;{user.bio}&quot;
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-neutral-500 block">CAMPUS FRIENDS</span>
                      <span className="text-base font-bold text-white">
                        {user.friends.length} Connected
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-neutral-500 block">EVENTS ATTENDED</span>
                      <span className="text-base font-bold text-white">
                        {user.eventsAttending.length} Verified
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-neutral-400 block font-bold">
                      Campus Friends List
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {user.friends.map((f) => (
                        <span
                          key={f}
                          className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono text-neutral-300 border border-white/10"
                        >
                          @{f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 9: SETTINGS                                                          */}
            {/* ========================================================================= */}
            {activeTab === "settings" && (
              <div className="space-y-8 animate-in fade-in duration-200 max-w-2xl">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                    Account & Experience Settings
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Manage campus location, notification preferences, and account roles.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  {/* Role Switcher */}
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-white">
                      Account Experience
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Are you also hosting events on campus? Switch directly to the Organizer Studio.
                    </p>
                    <button
                      onClick={handleSwitchToOrganizer}
                      className="px-4 py-2 rounded-xl bg-[#D7F23A] text-black font-mono text-xs font-bold hover:bg-white transition-all flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Switch to Organizer Studio</span>
                    </button>
                  </div>

                  {/* Campus Default */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <h3 className="font-display font-bold text-base text-white">Primary Campus</h3>
                    <select
                      value={selectedCampusId}
                      onChange={(e) => {
                        setSelectedCampusId(e.target.value);
                        showToast({
                          type: "success",
                          title: "Campus Updated",
                          message: "Default campus preference saved.",
                        });
                      }}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white"
                    >
                      {campusOptions.map((c) => (
                        <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                          {c.name} ({c.shortName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Public Website */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">Public Website</h4>
                      <p className="text-xs text-neutral-400">
                        View Party Padi as an unauthenticated visitor.
                      </p>
                    </div>
                    <Link
                      href="/"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold"
                    >
                      Go to Landing Page
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-mono text-xs font-bold transition-all"
                    >
                      Sign Out of Party Padi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* PERSISTENT BOTTOM PLAYER / PARTY PASS BAR (INSPIRED BY REFERENCE IMAGE)   */}
      {/* ========================================================================= */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C0D0E]/98 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-3 shadow-2xl transition-all"
        aria-label="Upcoming Pass and Campus Vibe Player"
      >
        <div className="max-w-[1680px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Next upcoming pass or headline preview */}
          <div className="flex items-center gap-3 min-w-0 max-w-[35%] sm:max-w-sm">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/10">
              <Image
                src={
                  activeUpcomingPass
                    ? activeUpcomingPass.event.imageUrl
                    : headlineEvent.imageUrl
                }
                alt="Event cover"
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00D54B] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D54B] font-bold truncate">
                  {activeUpcomingPass ? "YOUR NEXT PASS" : "HEADLINE VIBE"}
                </span>
              </div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                {activeUpcomingPass ? activeUpcomingPass.event.title : headlineEvent.title}
              </h4>
              <p className="text-[11px] text-neutral-400 truncate hidden sm:block">
                {activeUpcomingPass
                  ? `${activeUpcomingPass.event.shortDate} • ${activeUpcomingPass.event.venue}`
                  : `${headlineEvent.shortDate} • ${headlineEvent.venue}`}
              </p>
            </div>
          </div>

          {/* Center: Campus Sound Clash / DJ Audio Player Bar */}
          <div className="hidden md:flex flex-col items-center justify-center gap-1.5 flex-1 max-w-lg">
            {/* Player Controls */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPlayerProgress((p) => Math.max(0, p - 10))}
                className="text-neutral-400 hover:text-white transition-colors"
                title="Rewind"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-8 h-8 rounded-full bg-white text-black hover:scale-105 transition-transform flex items-center justify-center shadow-md"
                title={isPlayingAudio ? "Pause Preview" : "Play Campus DJ Mix"}
              >
                {isPlayingAudio ? (
                  <Pause className="w-4 h-4 fill-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setPlayerProgress((p) => Math.min(100, p + 10))}
                className="text-neutral-400 hover:text-white transition-colors"
                title="Forward"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber & Time (Yellow bar like reference!) */}
            <div className="w-full flex items-center gap-2.5 text-[10px] font-mono text-neutral-400">
              <span>11:32</span>
              <div
                className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = Math.round((clickX / rect.width) * 100);
                  setPlayerProgress(pct);
                }}
              >
                <div
                  className="h-full bg-[#D7F23A] rounded-full transition-all duration-150"
                  style={{ width: `${playerProgress}%` }}
                />
              </div>
              <span>35:05</span>
            </div>
          </div>

          {/* Right: Quick Ticket Pass Action / Volume */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeUpcomingPass ? (
              <button
                type="button"
                onClick={() =>
                  setQrCodeModalEvent({
                    event: activeUpcomingPass.event,
                    ticketCode: activeUpcomingPass.ticketCode,
                    status: "Confirmed Gate Pass",
                  })
                }
                className="spicy-btn px-3.5 sm:px-4 py-2 rounded-full bg-[#00D54B] text-black font-mono text-xs font-bold hover:bg-[#D7F23A] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pass:</span>
                <span>{activeUpcomingPass.ticketCode}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenTicket(headlineEvent)}
                className="spicy-btn px-4 py-2 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-[#00D54B] transition-all flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Get Pass</span>
              </button>
            )}

            {/* Audio Mute toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors hidden sm:inline-flex"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE PERSISTENT BOTTOM NAVIGATION BAR (APP EXPERIENCE)                  */}
      {/* ========================================================================= */}
      <nav
        className="lg:hidden fixed bottom-14 left-0 right-0 z-40 bg-[#0C0D0E]/98 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl"
        aria-label="Mobile Bottom App Bar"
      >
        {[
          { id: "for_you" as DashboardTab, label: "Home", icon: Home },
          { id: "discover" as DashboardTab, label: "Explore", icon: Compass },
          { id: "circles" as DashboardTab, label: "Circle", icon: Users2 },
          { id: "tickets" as DashboardTab, label: "Tickets", icon: Ticket },
          { id: "profile" as DashboardTab, label: "Profile", icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? "text-[#00D54B] font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-mono mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Digital QR Pass Modal */}
      {qrCodeModalEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setQrCodeModalEvent(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#0E1013] border border-white/20 p-6 text-center space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-[#00D54B]/20 text-[#00D54B] font-mono text-[10px] font-bold">
                OFFICIAL QR GATE PASS
              </span>
              <h3 className="font-display font-bold text-xl text-white">
                {qrCodeModalEvent.event.title}
              </h3>
              <p className="text-xs text-neutral-400">
                {qrCodeModalEvent.event.date} • {qrCodeModalEvent.event.time}
              </p>
            </div>

            <div className="w-56 h-56 mx-auto rounded-2xl bg-white p-4 flex items-center justify-center shadow-lg">
              <QrCode className="w-full h-full text-black" />
            </div>

            <div className="p-3 rounded-2xl bg-black/60 border border-white/10 font-mono">
              <span className="text-[10px] text-neutral-400 block uppercase">PASS CODE</span>
              <span className="text-xl font-bold text-[#00D54B]">
                {qrCodeModalEvent.ticketCode}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Show this QR code to the door scanner rep at {qrCodeModalEvent.event.venue}. Valid for verified admission.
            </p>

            <button
              onClick={() => setQrCodeModalEvent(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <TicketModal
        event={ticketModalEvent}
        isOpen={Boolean(ticketModalEvent)}
        onClose={() => setTicketModalEvent(null)}
      />

      <GiftSupportModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        eventId={activeGiftTarget.eventId}
        eventTitle={activeGiftTarget.eventTitle}
        organizerName={activeGiftTarget.organizerName}
      />
    </div>
  );
}
