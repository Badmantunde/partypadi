"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HostEventModal } from "@/components/HostEventModal";
import { GiftSupportModal } from "@/components/GiftSupportModal";
import { GifterBadge } from "@/components/GifterBadge";
import {
  useAuth,
  GIFTER_LEVEL_INFO,
  getGifterLevel,
  getNextLevelProgress,
  getOrganizerMilestones,
} from "@/context/AuthContext";
import { GifterLevel, LeaderboardEntry } from "@/types";
import {
  Trophy,
  Heart,
  Crown,
  Sparkles,
  Calendar,
  Building2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Search,
} from "lucide-react";

export default function LeaderboardPage() {
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [period, setPeriod] = useState<"month" | "all_time">("month");
  const [selectedCampus, setSelectedCampus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentMonthLabel, setCurrentMonthLabel] = useState<string>("October 2026");

  useEffect(() => {
    try {
      setCurrentMonthLabel(
        new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      );
    } catch {
      // fallback preserved
    }
  }, []);

  // Gift modal state for direct organizer gifting from leaderboard
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [targetOrganizer, setTargetOrganizer] = useState<{
    name: string;
    id?: string;
  }>({ name: "FASSA Social Committee" });

  const {
    currentUser,
    getLeaderboard,
    openAuthModal,
    openProfileModal,
    gifts,
  } = useAuth();

  const leaderboard = getLeaderboard({
    period,
    campus: selectedCampus === "all" ? undefined : selectedCampus,
  });

  const filteredLeaderboard = leaderboard.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.name.toLowerCase().includes(q) ||
      (entry.username && entry.username.toLowerCase().includes(q))
    );
  });

  const top3 = filteredLeaderboard.slice(0, 3);
  const restOfLeaderboard = filteredLeaderboard.slice(3);

  // User's own position
  const myStandingIndex = currentUser
    ? leaderboard.findIndex(
        (e) =>
          e.userId === currentUser.id ||
          (e.username && e.username.toLowerCase() === currentUser.username.toLowerCase())
      )
    : -1;
  const myStanding = myStandingIndex >= 0 ? leaderboard[myStandingIndex] : null;
  const myProgress = currentUser ? getNextLevelProgress(currentUser.totalGifted || 0) : null;

  // Organizers Milestone telemetry
  const organizerShowcases = [
    {
      id: "fassa_execs",
      name: "FASSA Social Committee",
      role: "Faculty Executive Committee",
      campus: "Main Campus",
      avatar: "FS",
      totalReceived: gifts
        .filter(
          (g) =>
            g.organizerId === "fassa_execs" ||
            (g.organizerName && g.organizerName.includes("FASSA"))
        )
        .reduce((sum, g) => sum + g.amount, 0),
      uniqueSupporters: new Set(
        gifts
          .filter(
            (g) =>
              g.organizerId === "fassa_execs" ||
              (g.organizerName && g.organizerName.includes("FASSA"))
          )
          .map((g) => g.userId || g.gifterName)
      ).size,
    },
    {
      id: "vibe_tribe",
      name: "Vibe Tribe & Campus Socials",
      role: "Official Campus Promoter",
      campus: "Main Campus",
      avatar: "VT",
      totalReceived: gifts
        .filter(
          (g) =>
            g.organizerName && g.organizerName.includes("Vibe Tribe")
        )
        .reduce((sum, g) => sum + g.amount, 0),
      uniqueSupporters: new Set(
        gifts
          .filter(
            (g) =>
              g.organizerName && g.organizerName.includes("Vibe Tribe")
          )
          .map((g) => g.userId || g.gifterName)
      ).size,
    },
    {
      id: "soundhaus",
      name: "SoundHaus Collective",
      role: "Independent Sound Curators",
      campus: "Club Vegas & Garden",
      avatar: "SH",
      totalReceived: gifts
        .filter(
          (g) =>
            g.organizerName && g.organizerName.includes("SoundHaus")
        )
        .reduce((sum, g) => sum + g.amount, 0),
      uniqueSupporters: new Set(
        gifts
          .filter(
            (g) =>
              g.organizerName && g.organizerName.includes("SoundHaus")
          )
          .map((g) => g.userId || g.gifterName)
      ).size,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans selection:bg-[#C5FF35] selection:text-[#070809]">
      <Navbar onOpenHostModal={() => setHostModalOpen(true)} />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-white/10 overflow-hidden">
          {/* Ambient Radial Lights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-[#C5FF35]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-amber-300">
              <Trophy className="w-3.5 h-3.5 fill-amber-300" />
              <span>PADI GIFTER · CAMPUS HALL OF FAME</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white leading-tight">
              The People Backing Campus Vibes
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Voluntary patron rankings celebrating the most supportive students, squads, and benefactors funding sound rigs, DJs, and unforgettable nights.
            </p>

            {/* Filter Controls: Period & Campus */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              {/* Period Switcher (Monthly Primary) */}
              <div className="flex p-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPeriod("month")}
                  className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                    period === "month"
                      ? "bg-[#C5FF35] text-black font-bold shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>This Month ({currentMonthLabel})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod("all_time")}
                  className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                    period === "all_time"
                      ? "bg-[#C5FF35] text-black font-bold shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>All-Time Legends</span>
                </button>
              </div>

              {/* Campus Selector */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                <span className="text-neutral-400">Campus:</span>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0C0D0E] text-white">All Campuses</option>
                  <option value="Main Campus" className="bg-[#0C0D0E] text-white">Main Campus</option>
                  <option value="Mini Campus" className="bg-[#0C0D0E] text-white">Mini Campus</option>
                  <option value="Club Vegas & Garden" className="bg-[#0C0D0E] text-white">Club Vegas & Garden</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* User Standing Capsule (if logged in) */}
        {currentUser && myStanding && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0F1012] border border-amber-400/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#C5FF35] text-[#070809] flex items-center justify-center font-display font-black text-xl shadow-md">
                  #{myStanding.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-white">
                      {currentUser.fullName}
                    </span>
                    <GifterBadge level={myStanding.gifterLevel} size="sm" />
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    Rank #{myStanding.rank} {period === "month" ? "this month" : "all-time"} on campus · ₦{(currentUser.totalGifted || 0).toLocaleString()} contributed
                  </span>
                </div>
              </div>

              {myProgress && (
                <div className="flex-1 max-w-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>{myProgress.text}</span>
                    <span>{myProgress.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-[#C5FF35] rounded-full transition-all duration-300"
                      style={{ width: `${myProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={openProfileModal}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition-colors shrink-0"
              >
                My Gifter Profile →
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
          {/* TOP 3 PODIUM SHOWCASE */}
          {top3.length > 0 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  LEADERBOARD PODIUM
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
                  Top Campus Benefactors
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
                {/* 2nd Place (Left) */}
                {top3[1] && (
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-slate-300/30 text-center space-y-3 relative group hover:border-slate-300 transition-all order-2 md:order-1">
                    <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-mono font-bold text-sm mx-auto flex items-center justify-center shadow-md">
                      2
                    </div>
                    <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden relative border border-slate-300/40 p-2 bg-black/40">
                      <Image
                        src={GIFTER_LEVEL_INFO[top3[1].gifterLevel].imageUrl}
                        alt={top3[1].name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {top3[1].name}
                      </h3>
                      {top3[1].username && (
                        <span className="text-xs font-mono text-neutral-400">
                          @{top3[1].username}
                        </span>
                      )}
                    </div>
                    <div className="pt-1">
                      <GifterBadge level={top3[1].gifterLevel} size="sm" />
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                        Total Support
                      </span>
                      <span className="font-mono text-base font-bold text-white">
                        ₦{top3[1].totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* 1st Place (Center - Elevated & Gold) */}
                {top3[0] && (
                  <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-500/10 to-white/[0.04] border-2 border-amber-400/60 text-center space-y-4 relative shadow-[0_0_40px_rgba(245,158,11,0.2)] md:-translate-y-4 order-1 md:order-2">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <Crown className="w-3.5 h-3.5 fill-black" />
                      <span>#1 CAMPUS HEADLINER</span>
                    </div>

                    <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden relative border-2 border-amber-400/80 p-2 bg-black/60 shadow-xl mt-2">
                      <Image
                        src={GIFTER_LEVEL_INFO[top3[0].gifterLevel].imageUrl}
                        alt={top3[0].name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                        {top3[0].name}
                      </h3>
                      {top3[0].username && (
                        <span className="text-xs font-mono text-neutral-400">
                          @{top3[0].username}
                        </span>
                      )}
                    </div>

                    <div className="pt-1">
                      <GifterBadge level={top3[0].gifterLevel} size="md" />
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-center">
                      <span className="text-[10px] font-mono text-amber-300 block uppercase font-bold">
                        Verified Contributions
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-black text-[#C5FF35]">
                        ₦{top3[0].totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                        {top3[0].eventsSupportedCount} events · {top3[0].organizersSupportedCount} crews supported
                      </span>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Right) */}
                {top3[2] && (
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-amber-700/30 text-center space-y-3 relative group hover:border-amber-600 transition-all order-3">
                    <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-mono font-bold text-sm mx-auto flex items-center justify-center shadow-md">
                      3
                    </div>
                    <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden relative border border-amber-700/40 p-2 bg-black/40">
                      <Image
                        src={GIFTER_LEVEL_INFO[top3[2].gifterLevel].imageUrl}
                        alt={top3[2].name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {top3[2].name}
                      </h3>
                      {top3[2].username && (
                        <span className="text-xs font-mono text-neutral-400">
                          @{top3[2].username}
                        </span>
                      )}
                    </div>
                    <div className="pt-1">
                      <GifterBadge level={top3[2].gifterLevel} size="sm" />
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-center">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                        Total Support
                      </span>
                      <span className="font-mono text-base font-bold text-white">
                        ₦{top3[2].totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FULL RANKINGS TABLE */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-medium text-xl text-white">
                  Campus Supporter Standings
                </h3>
                <p className="text-xs text-neutral-400">
                  {period === "month"
                    ? `Showing verified rankings for ${currentMonthLabel}`
                    : "Showing all-time cumulative verified contributions"}
                </p>
              </div>

              {/* Search Supporter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search supporter or @handle..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0C0D0E] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      <th className="py-3.5 px-4 w-14">Rank</th>
                      <th className="py-3.5 px-4">Supporter</th>
                      <th className="py-3.5 px-4">Badge Tier</th>
                      <th className="py-3.5 px-4">Campus</th>
                      <th className="py-3.5 px-4 text-center">Events Backed</th>
                      <th className="py-3.5 px-4 text-right">Total Verified (₦)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400 font-mono text-xs">
                          No supporters found for this filter. Be the first to back an event!
                        </td>
                      </tr>
                    ) : (
                      filteredLeaderboard.map((entry) => (
                        <tr
                          key={`${entry.rank}-${entry.name}`}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold">
                            <span
                              className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                                entry.rank === 1
                                  ? "bg-amber-400 text-black font-black"
                                  : entry.rank === 2
                                  ? "bg-slate-200 text-slate-900"
                                  : entry.rank === 3
                                  ? "bg-amber-700 text-amber-100"
                                  : "text-neutral-400"
                              }`}
                            >
                              {entry.rank}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div>
                              <span className="font-display font-bold text-xs sm:text-sm text-white block">
                                {entry.name}
                              </span>
                              {entry.username && (
                                <span className="font-mono text-[10px] text-neutral-400">
                                  @{entry.username}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <GifterBadge level={entry.gifterLevel} size="sm" />
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                            {entry.campus}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-center text-neutral-300">
                            {entry.eventsSupportedCount}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-right text-[#C5FF35] text-sm">
                            ₦{entry.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ORGANIZER SUPPORT MILESTONES SHOWCASE */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-neutral-300">
                <Building2 className="w-3.5 h-3.5 text-[#C5FF35]" />
                <span>ORGANIZER SUPPORT MILESTONES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
                Campus Organizers & Support Achievements
              </h2>
              <p className="text-xs text-neutral-400 max-w-xl">
                Organizers unlock verified achievements as the student community backs their event production and student body initiatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {organizerShowcases.map((org) => {
                const milestones = getOrganizerMilestones(
                  org.totalReceived,
                  org.uniqueSupporters
                );

                return (
                  <div
                    key={org.id}
                    className="p-6 rounded-3xl bg-[#0C0D0E] border border-white/10 space-y-4 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                            {org.avatar}
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-white">
                              {org.name}
                            </h4>
                            <span className="text-[10px] font-mono text-neutral-400 block">
                              {org.role} · {org.campus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Milestones Badge Chips */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          UNLOCKED MILESTONES:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {milestones.map((m) => (
                            <div
                              key={m.id}
                              className={`p-2 rounded-xl border text-[10px] font-mono transition-all ${
                                m.unlocked
                                  ? "bg-amber-400/10 border-amber-400/30 text-amber-300 font-bold"
                                  : "bg-white/[0.02] border-white/5 text-neutral-500"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="shrink-0">
                                  {m.id === "first_gift" && <Sparkles className="w-3 h-3 text-emerald-400" />}
                                  {m.id === "crowd_favourite" && <Users className="w-3 h-3 text-amber-400" />}
                                  {m.id === "community_backed" && <ShieldCheck className="w-3 h-3 text-blue-400" />}
                                  {m.id === "campus_favourite" && <Crown className="w-3 h-3 text-purple-400" />}
                                </div>
                                <span className="truncate">{m.title}</span>
                              </div>
                              <span className="text-[9px] block text-neutral-400 truncate mt-0.5">
                                {m.unlocked ? "Unlocked" : m.requirement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial Telemetry */}
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-400">Total Support:</span>
                        <span className="font-bold text-[#C5FF35]">
                          ₦{org.totalReceived.toLocaleString()} ({org.uniqueSupporters} Patrons)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTargetOrganizer({ name: org.name, id: org.id });
                        setGiftModalOpen(true);
                      }}
                      className="spicy-btn w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all mt-3"
                    >
                      <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Gift {org.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GIFTER LEVEL SYSTEM GUIDE & PERKS */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF35] font-bold">
                TRANSPARENT RECOGNITION TIERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
                How Padi Gifter Levels Work
              </h2>
              <p className="text-xs text-neutral-400">
                Levels update automatically based on verified, completed contributions. Only confirmed transactions count.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {([1, 2, 3, 4, 5, 6] as GifterLevel[]).map((lvl) => {
                const info = GIFTER_LEVEL_INFO[lvl];
                return (
                  <div
                    key={lvl}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 hover:border-white/20 transition-all flex items-start gap-3.5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden shrink-0 p-1">
                      <Image
                        src={info.imageUrl}
                        alt={info.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-white">
                          {info.name}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-white/10 text-neutral-300">
                          Level {lvl}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#C5FF35] block">
                        {info.description}
                      </span>
                      <p className="text-[11px] text-neutral-400 leading-tight">
                        {info.meaning}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Host Modal */}
      <HostEventModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
      />

      {/* Direct Organizer Gift Modal */}
      <GiftSupportModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        organizerName={targetOrganizer.name}
        organizerId={targetOrganizer.id}
        initialType="direct_organizer_gift"
      />
    </div>
  );
}
