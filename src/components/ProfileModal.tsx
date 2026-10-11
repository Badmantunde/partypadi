"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  User,
  Users,
  Calendar,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
  ArrowUpRight,
  LogOut,
  Check,
  Award,
  Sparkles,
  Heart,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  useAuth,
  GIFTER_LEVEL_INFO,
  getGifterLevel,
  getNextLevelProgress,
} from "@/context/AuthContext";
import { GifterBadge } from "./GifterBadge";
import { useToast } from "./Toast";
import { EVENTS } from "@/data/events";

export function ProfileModal() {
  const {
    currentUser,
    profileModalOpen,
    closeProfileModal,
    logout,
    addFriend,
    removeFriend,
    circles,
    openCircleModal,
    rsvpEvent,
    allUsers,
    gifts,
    getLeaderboard,
    updatePrivacySettings,
  } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"friends" | "circles" | "tickets" | "gifter">("friends");
  const [newFriendTag, setNewFriendTag] = useState("");

  if (!profileModalOpen || !currentUser) return null;

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendTag.trim()) return;

    const clean = newFriendTag.trim().replace(/^@/, "");
    const foundUser = allUsers.find((u) => u.username.toLowerCase() === clean.toLowerCase());

    if (!foundUser) {
      showToast({
        type: "error",
        title: "User Not Found",
        message: `@${clean} is not registered yet. Invite them to join PartyPadi!`,
      });
      return;
    }

    const added = addFriend(clean);
    if (added) {
      showToast({
        type: "success",
        title: "Padi Connected!",
        message: `You and @${clean} can now see each other's event radar and party circles.`,
      });
      setNewFriendTag("");
    } else {
      showToast({
        type: "info",
        title: "Already Friends",
        message: `@${clean} is already in your circle.`,
      });
    }
  };

  const handleTogglePrivacy = (eventId: string, currentSetting: boolean, code?: string) => {
    rsvpEvent(eventId, !currentSetting, code || "PP-PASS");
    showToast({
      type: "info",
      title: "Privacy Updated",
      message: !currentSetting
        ? "Your friends can now see you are attending this event."
        : "Event attendance hidden from friends radar.",
    });
  };

  const myCircles = circles.filter(
    (c) =>
      c.createdBy === currentUser.username ||
      c.members.includes(currentUser.username)
  );

  const gifterBadge = currentUser.gifterLevel
    ? GIFTER_LEVEL_INFO[currentUser.gifterLevel]
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeProfileModal}
    >
      <div
        className="relative w-full max-w-lg bg-[#0C0D0E] border border-white/10 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header (Tight Mobile Layout) */}
        <div className="flex items-start gap-3 sm:gap-4 pb-4 border-b border-white/10 shrink-0">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#C5FF35] text-[#0C0D0E] flex items-center justify-center font-display font-black text-xl sm:text-2xl shrink-0 shadow-lg">
            {currentUser.fullName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-[160px] sm:max-w-none">
                {currentUser.fullName}
              </h3>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#C5FF35]/15 text-[#C5FF35] font-bold border border-[#C5FF35]/30">
                @{currentUser.username}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 uppercase">
                {currentUser.role}
              </span>
            </div>

            {/* Gifter Badge Pill */}
            {gifterBadge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden relative shrink-0">
                  <Image
                    src={gifterBadge.imageUrl}
                    alt={gifterBadge.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{gifterBadge.badge}</span>
                <span className="text-neutral-400 font-normal">· {gifterBadge.name}</span>
              </div>
            )}

            <p className="text-[11px] sm:text-xs text-neutral-400 leading-tight line-clamp-2">
              {currentUser.bio}
            </p>
            <p className="text-[10px] font-mono text-neutral-500 truncate">
              {currentUser.campus} · {currentUser.email}
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="grid grid-cols-4 p-1 bg-white/5 border border-white/10 rounded-full my-3 text-[10px] sm:text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("friends")}
            className={`py-1.5 sm:py-2 rounded-full transition-all text-center font-bold flex items-center justify-center gap-1 ${
              activeTab === "friends"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Users className="w-3 h-3" />
            <span className="truncate">Padis ({currentUser.friends.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("circles")}
            className={`py-1.5 sm:py-2 rounded-full transition-all text-center font-bold flex items-center justify-center gap-1 ${
              activeTab === "circles"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span className="truncate">Circles ({myCircles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`py-1.5 sm:py-2 rounded-full transition-all text-center font-bold flex items-center justify-center gap-1 ${
              activeTab === "tickets"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span className="truncate">Passes ({currentUser.eventsAttending.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gifter")}
            className={`py-1.5 sm:py-2 rounded-full transition-all text-center font-bold flex items-center justify-center gap-1 ${
              activeTab === "gifter"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Heart className="w-3 h-3" />
            <span className="truncate">Gifter</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
          {/* TAB 1: FRIENDS */}
          {activeTab === "friends" && (
            <div className="space-y-3">
              {/* Add Friend Form (Mobile Tightened) */}
              <form onSubmit={handleAddFriend} className="flex gap-1.5 sm:gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    value={newFriendTag}
                    onChange={(e) => setNewFriendTag(e.target.value)}
                    placeholder="Enter @username..."
                    className="w-full pl-7 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="spicy-btn px-3 sm:px-4 py-2 bg-[#C5FF35] text-[#0C0D0E] rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#b5f220] transition-colors shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              </form>

              {/* Friends List */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  YOUR CONNECTED PADI RADAR
                </span>

                {currentUser.friends.length === 0 ? (
                  <div className="p-5 text-center bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                    <p className="text-xs text-neutral-400">No friends connected yet.</p>
                    <p className="text-[11px] text-neutral-500">
                      Search <span className="text-[#C5FF35]">@tade_vibes</span> or{" "}
                      <span className="text-[#C5FF35]">@fola_vibes</span> to test!
                    </p>
                  </div>
                ) : (
                  currentUser.friends.map((friendTag) => {
                    const friendProfile = allUsers.find(
                      (u) => u.username.toLowerCase() === friendTag.toLowerCase()
                    );
                    const attendingEvents = friendProfile?.eventsAttending
                      .filter((att) => att.allowFriendsToSee)
                      .map((att) => EVENTS.find((e) => e.id === att.eventId))
                      .filter(Boolean);

                    const friendBadge = friendProfile?.gifterLevel
                      ? GIFTER_LEVEL_INFO[friendProfile.gifterLevel]
                      : null;

                    return (
                      <div
                        key={friendTag}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-2.5 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {friendProfile ? friendProfile.fullName.charAt(0) : friendTag.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-display font-bold text-xs text-white truncate max-w-[120px] sm:max-w-none">
                                {friendProfile?.fullName || friendTag}
                              </span>
                              <span className="font-mono text-[10px] text-[#C5FF35]">
                                @{friendTag}
                              </span>
                              {friendBadge && (
                                <span
                                  className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-amber-400/40 text-amber-300"
                                  title={friendBadge.badge}
                                >
                                  {friendBadge.icon} L{friendProfile?.gifterLevel}
                                </span>
                              )}
                            </div>
                            {attendingEvents && attendingEvents.length > 0 ? (
                              <p className="text-[10px] text-neutral-400 truncate">
                                Going: <span className="text-white">{attendingEvents[0]?.title}</span>
                              </p>
                            ) : (
                              <p className="text-[10px] text-neutral-500 truncate">
                                No public event RSVPs
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFriend(friendTag)}
                          className="p-1 text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                          title="Remove connection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CIRCLES */}
          {activeTab === "circles" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  CAMPUS GATHERING CIRCLES
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeProfileModal();
                    openCircleModal();
                  }}
                  className="px-2.5 py-1 bg-[#C5FF35] text-[#0C0D0E] rounded-full text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#b5f220] transition-colors"
                >
                  + Create Circle
                </button>
              </div>

              {myCircles.length === 0 ? (
                <div className="p-5 text-center bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                  <p className="text-xs text-neutral-400">No active gathering circles.</p>
                  <p className="text-[11px] text-neutral-500">
                    Create a circle to rally your friends before heading to an event!
                  </p>
                </div>
              ) : (
                myCircles.map((circle) => {
                  const targetEv = circle.targetEventId
                    ? EVENTS.find((e) => e.id === circle.targetEventId)
                    : null;

                  return (
                    <div
                      key={circle.id}
                      className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                            {circle.name}
                          </h4>
                          {circle.description && (
                            <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                              {circle.description}
                            </p>
                          )}
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-[#C5FF35]/20 text-[#C5FF35] rounded-full font-bold shrink-0">
                          {circle.members.length} Members
                        </span>
                      </div>

                      {targetEv && (
                        <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                          <span className="text-neutral-400 text-[10px]">Event:</span>
                          <span className="font-bold text-white truncate text-[11px] max-w-[180px]">
                            {targetEv.title}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        <span className="text-[9px] font-mono text-neutral-500">MEMBERS:</span>
                        {circle.members.map((m) => (
                          <span
                            key={m}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-neutral-300"
                          >
                            @{m}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: TICKETS & PASSES */}
          {activeTab === "tickets" && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                MY EVENT PASSES & SOCIAL PRIVACY
              </span>

              {currentUser.eventsAttending.length === 0 ? (
                <div className="p-5 text-center bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                  <p className="text-xs text-neutral-400">No event passes reserved yet.</p>
                  <p className="text-[11px] text-neutral-500">
                    Book tickets for upcoming campus events and manage who sees you are going!
                  </p>
                </div>
              ) : (
                currentUser.eventsAttending.map((att) => {
                  const ev = EVENTS.find((e) => e.id === att.eventId);
                  if (!ev) return null;

                  return (
                    <div
                      key={att.eventId}
                      className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-white/20 transition-all"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[9px] font-mono text-[#C5FF35] tracking-wider uppercase block">
                          CODE: {att.ticketCode || "PP-PASS"} · {ev.shortDate}
                        </span>
                        <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                          {ev.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 truncate">{ev.venue}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <button
                          type="button"
                          onClick={() => handleTogglePrivacy(att.eventId, att.allowFriendsToSee, att.ticketCode)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 transition-colors border ${
                            att.allowFriendsToSee
                              ? "bg-[#C5FF35]/15 border-[#C5FF35] text-[#C5FF35]"
                              : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {att.allowFriendsToSee ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Public Radar</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Private Radar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4: PADI GIFTER & PATRON STATUS */}
          {activeTab === "gifter" && (
            <div className="space-y-4">
              {(() => {
                const totalGifted = currentUser.totalGifted || 0;
                const level = getGifterLevel(totalGifted);
                const progress = getNextLevelProgress(totalGifted);
                const isShowPublic = currentUser.showPublicGifts !== false;

                const myGifts = gifts.filter(
                  (g) =>
                    g.userId === currentUser.id ||
                    (g.gifterUsername &&
                      g.gifterUsername.toLowerCase() === currentUser.username.toLowerCase())
                );

                const eventsBacked = new Set(
                  myGifts.filter((g) => g.eventId).map((g) => g.eventId)
                ).size;
                const organizersBacked = new Set(
                  myGifts
                    .filter((g) => g.organizerId || g.organizerName)
                    .map((g) => g.organizerId || g.organizerName)
                ).size;

                const monthlyBoard = getLeaderboard({ period: "month" });
                const monthlyRankIndex = monthlyBoard.findIndex(
                  (e) =>
                    e.userId === currentUser.id ||
                    (e.username &&
                      e.username.toLowerCase() === currentUser.username.toLowerCase())
                );
                const monthlyRank = monthlyRankIndex >= 0 ? monthlyRankIndex + 1 : null;

                return (
                  <div className="space-y-4">
                    {/* Badge Hero Card */}
                    <div className="relative p-5 rounded-3xl bg-white/[0.04] border border-white/10 flex flex-col items-center text-center space-y-3">
                      <GifterBadge level={level} size="lg" />

                      {/* Next Level Milestone Progress */}
                      <div className="w-full pt-2 border-t border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                          <span>{progress.text}</span>
                          <span>{progress.percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-[#C5FF35] rounded-full transition-all duration-300"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Stats Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          Lifetime Contributions
                        </span>
                        <span className="font-mono text-base font-bold text-[#C5FF35]">
                          ₦{totalGifted.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          Monthly Campus Rank
                        </span>
                        <span className="font-mono text-base font-bold text-amber-300">
                          {monthlyRank ? `#${monthlyRank} this month` : "Unranked"}
                        </span>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          Events Supported
                        </span>
                        <span className="font-mono text-base font-bold text-white">
                          {eventsBacked} Event{eventsBacked !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                          Organizers Supported
                        </span>
                        <span className="font-mono text-base font-bold text-white">
                          {organizersBacked} Crew{organizersBacked !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Privacy Settings Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="text-xs text-white block font-medium">
                          Show Lifetime Support on Leaderboard
                        </span>
                        <span className="text-[10px] text-neutral-400 block leading-tight">
                          {isShowPublic
                            ? "Your badge and total support appear on public campus leaderboards."
                            : "Private mode: You appear as 'Anonymous Padi' on all public rankings."}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updatePrivacySettings(!isShowPublic);
                          showToast({
                            type: "info",
                            title: "Privacy Updated",
                            message: !isShowPublic
                              ? "Your contributions are now visible on campus leaderboards."
                              : "Your contributions are now private on campus leaderboards.",
                          });
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                          isShowPublic ? "bg-[#C5FF35]" : "bg-white/20"
                        }`}
                        aria-label="Toggle public leaderboard display"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-[#0C0D0E] transition-transform ${
                            isShowPublic ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Recent Giving History */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        <span>MY GIVING HISTORY</span>
                        <span>
                          {myGifts.length} Contribution{myGifts.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {myGifts.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                          <p className="text-xs text-neutral-400">
                            No support contributions recorded yet.
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            Back an event or gift an organizer to earn your verified badge!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                          {myGifts.map((gift) => (
                            <div
                              key={gift.id}
                              className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-[#C5FF35] mr-1.5 uppercase font-bold">
                                    {gift.type === "direct_organizer_gift"
                                      ? "Organizer Gift"
                                      : "Event Sponsor"}
                                  </span>
                                  <span className="font-bold text-white">
                                    {gift.eventTitle || gift.organizerName || "Campus Event"}
                                  </span>
                                </div>
                                <span className="font-mono font-bold text-[#C5FF35]">
                                  ₦{gift.amount.toLocaleString()}
                                </span>
                              </div>
                              {gift.message && (
                                <p className="text-[11px] text-neutral-400 italic">
                                  &ldquo;{gift.message}&rdquo;
                                </p>
                              )}
                              <span className="text-[9px] font-mono text-neutral-500 block">
                                {new Date(gift.createdAt).toLocaleDateString()} ·{" "}
                                {gift.isPublic ? "Public Wall" : "Anonymous"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Leaderboard Link Button */}
                    <div className="pt-1">
                      <Link
                        href="/leaderboard"
                        onClick={closeProfileModal}
                        className="w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>View Campus Gifter Leaderboards</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer with Logout */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[9px] font-mono text-neutral-500">
            0% COMMISSION · FREE STUDENT NETWORK
          </span>
          <button
            type="button"
            onClick={() => {
              logout();
              closeProfileModal();
              showToast({
                type: "info",
                title: "Signed Out",
                message: "You have signed out of your PartyPadi profile.",
              });
            }}
            className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
