"use client";

import React, { useState } from "react";
import { X, User, Users, Calendar, Eye, EyeOff, UserPlus, Trash2, ArrowUpRight, LogOut, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
  } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"friends" | "circles" | "tickets">("friends");
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
        message: `@${clean} is not registered yet. Share PartyPadi with them!`,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeProfileModal}
    >
      <div
        className="relative w-full max-w-xl bg-[#0C0D0E] border border-white/10 text-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-white/10 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-[#C5FF35] text-[#0C0D0E] flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-lg">
            {currentUser.fullName.charAt(0)}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display font-bold text-xl text-white">
                {currentUser.fullName}
              </h3>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#C5FF35]/20 text-[#C5FF35] font-bold border border-[#C5FF35]/30">
                @{currentUser.username}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-neutral-400">{currentUser.bio}</p>
            <p className="text-[10px] font-mono text-neutral-500">
              CAMPUS: <span className="text-neutral-300">{currentUser.campus}</span> · {currentUser.email}
            </p>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="grid grid-cols-3 p-1 bg-white/5 border border-white/10 rounded-full my-4 text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("friends")}
            className={`py-2 rounded-full transition-all text-center font-bold flex items-center justify-center gap-1.5 ${
              activeTab === "friends"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends ({currentUser.friends.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("circles")}
            className={`py-2 rounded-full transition-all text-center font-bold flex items-center justify-center gap-1.5 ${
              activeTab === "circles"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Circles ({myCircles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`py-2 rounded-full transition-all text-center font-bold flex items-center justify-center gap-1.5 ${
              activeTab === "tickets"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Passes ({currentUser.eventsAttending.length})</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: FRIENDS */}
          {activeTab === "friends" && (
            <div className="space-y-4">
              {/* Add Friend Form */}
              <form onSubmit={handleAddFriend} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    value={newFriendTag}
                    onChange={(e) => setNewFriendTag(e.target.value)}
                    placeholder="Enter friend's username (e.g. chioma_k)"
                    className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="spicy-btn px-4 py-2.5 bg-[#C5FF35] text-[#0C0D0E] rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#b5f220] transition-colors shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              </form>

              {/* Friends List */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  YOUR CONNECTED PADI NETWORK
                </span>

                {currentUser.friends.length === 0 ? (
                  <div className="p-6 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <p className="text-xs text-neutral-400">No friends connected yet.</p>
                    <p className="text-[11px] text-neutral-500">
                      Search usernames above like <span className="text-[#C5FF35]">@tade_oou</span> or <span className="text-[#C5FF35]">@fola_vibes</span> to see their event radar!
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

                    return (
                      <div
                        key={friendTag}
                        className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {friendProfile ? friendProfile.fullName.charAt(0) : friendTag.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-xs text-white truncate">
                                {friendProfile?.fullName || friendTag}
                              </span>
                              <span className="font-mono text-[10px] text-[#C5FF35]">
                                @{friendTag}
                              </span>
                            </div>
                            {attendingEvents && attendingEvents.length > 0 ? (
                              <p className="text-[10px] text-neutral-400 truncate">
                                Going to: <span className="text-white">{attendingEvents[0]?.title}</span>
                              </p>
                            ) : (
                              <p className="text-[10px] text-neutral-500 truncate">
                                No active public event RSVPs
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFriend(friendTag)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors shrink-0"
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
            <div className="space-y-4">
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
                  className="px-3 py-1 bg-[#C5FF35] text-[#0C0D0E] rounded-full text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#b5f220] transition-colors"
                >
                  + Create Circle
                </button>
              </div>

              {myCircles.length === 0 ? (
                <div className="p-6 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <p className="text-xs text-neutral-400">No active gathering circles.</p>
                  <p className="text-[11px] text-neutral-500">
                    Create a circle to rally your friends before heading into an event!
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
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2.5 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-display font-bold text-sm text-white">
                            {circle.name}
                          </h4>
                          {circle.description && (
                            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                              {circle.description}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#C5FF35]/20 text-[#C5FF35] rounded-full font-bold">
                          {circle.members.length} Members
                        </span>
                      </div>

                      {targetEv && (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                          <span className="text-neutral-400 text-[11px]">Gathering for:</span>
                          <span className="font-bold text-white truncate max-w-[200px]">
                            {targetEv.title}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono text-neutral-500">MEMBERS:</span>
                        {circle.members.map((m) => (
                          <span
                            key={m}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300"
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
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                MY EVENT PASSES & SOCIAL PRIVACY
              </span>

              {currentUser.eventsAttending.length === 0 ? (
                <div className="p-6 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <p className="text-xs text-neutral-400">No event passes reserved yet.</p>
                  <p className="text-[11px] text-neutral-500">
                    Book tickets for upcoming campus events and choose whether your friends see you are going!
                  </p>
                </div>
              ) : (
                currentUser.eventsAttending.map((att) => {
                  const ev = EVENTS.find((e) => e.id === att.eventId);
                  if (!ev) return null;

                  return (
                    <div
                      key={att.eventId}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-[9px] font-mono text-[#C5FF35] tracking-wider uppercase block">
                          CODE: {att.ticketCode || "PP-PASS"} · {ev.shortDate}
                        </span>
                        <h4 className="font-display font-bold text-sm text-white truncate">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 truncate">{ev.venue}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <button
                          type="button"
                          onClick={() => handleTogglePrivacy(att.eventId, att.allowFriendsToSee, att.ticketCode)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-mono flex items-center gap-1.5 transition-colors border ${
                            att.allowFriendsToSee
                              ? "bg-[#C5FF35]/15 border-[#C5FF35] text-[#C5FF35]"
                              : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {att.allowFriendsToSee ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Friends Can See</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hidden from Friends</span>
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
        </div>

        {/* Footer with Logout */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-neutral-500">
            0% COMMISSION · FREE STUDENT PLATFORM
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
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
