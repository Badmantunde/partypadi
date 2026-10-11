"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { EVENTS } from "@/data/events";
import {
  Users,
  Sparkles,
  Plus,
  Vote,
  CheckCircle2,
  ArrowRight,
  Share2,
  Compass,
  PartyPopper,
  Calendar,
  MapPin,
  AlertCircle,
  Hash,
} from "lucide-react";

export default function CirclesHubPage() {
  const router = useRouter();
  const { currentUser, circles, openCircleModal, openAuthModal, joinCircle } = useAuth();
  const { showToast } = useToast();

  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    if (!currentUser) {
      openAuthModal("signin");
      showToast({
        type: "info",
        title: "Sign In Required",
        message: "Please sign in or create an account to join this Circle.",
      });
      return;
    }

    setJoining(true);
    const result = joinCircle(inviteCodeInput.trim());
    setJoining(false);

    if (result.success && result.circle) {
      showToast({
        type: "success",
        title: "Joined Circle!",
        message: result.message,
      });
      router.push(`/circles/${result.circle.id}`);
    } else {
      showToast({
        type: "error",
        title: "Unable to Join",
        message: result.message,
      });
    }
  };

  // Find circles user is a member of
  const myCircles = currentUser
    ? circles.filter((c) =>
        c.members.some((m) => m.toLowerCase() === currentUser.username.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans selection:bg-[#C5FF35] selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 bg-[#0C0D0E] border-b border-white/10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C5FF35]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/90">
                <span className="w-2 h-2 rounded-full bg-[#C5FF35] animate-pulse" />
                <span>PADI CIRCLE · SOCIAL EVENT PLANNING</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-display font-medium tracking-tight text-white leading-[1.08]">
                Decide what to do with your friends. Together.
              </h1>

              <p className="text-base sm:text-lg text-neutral-400 font-sans leading-relaxed">
                No more arguing across 10 chaotic WhatsApp groups. Create a Circle for your roommates, coursemates, or party squad. Suggest events, vote on the best one, and secure your passes together.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openCircleModal()}
                  className="spicy-btn px-6 py-3.5 bg-[#C5FF35] text-[#0C0D0E] hover:bg-white rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(197,255,53,0.35)] flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create a Circle</span>
                </button>

                <form
                  onSubmit={handleJoinWithCode}
                  className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-full p-1 pl-4 focus-within:border-[#C5FF35] transition-all"
                >
                  <Hash className="w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter Invite Code (e.g. SUNSET26)"
                    className="bg-transparent text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none w-48 sm:w-56 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={joining}
                    className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full text-xs font-mono font-bold transition-all"
                  >
                    {joining ? "Joining..." : "Join"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* USER'S ACTIVE CIRCLES */}
          {currentUser && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                      Your Circles ({myCircles.length})
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    Groups you belong to and are actively planning with.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openCircleModal()}
                  className="px-4 py-2 rounded-full border border-white/20 hover:border-[#C5FF35] bg-white/5 text-xs font-mono text-white flex items-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5FF35]" />
                  <span>New Circle</span>
                </button>
              </div>

              {myCircles.length === 0 ? (
                <div className="rounded-3xl bg-[#0E1013] border border-white/10 p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-medium text-lg text-white">
                      You haven't joined or created any circles yet
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      Start a circle for your weekend squad, or enter an invite code from a friend above.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCircleModal()}
                    className="px-5 py-2.5 rounded-full bg-[#C5FF35] text-black text-xs font-mono font-bold hover:bg-white transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Circle</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCircles.map((circle) => {
                    const chosenEvent = circle.targetEventId
                      ? EVENTS.find((e) => e.id === circle.targetEventId)
                      : null;
                    const isOwner =
                      circle.createdBy.toLowerCase() === currentUser.username.toLowerCase();

                    return (
                      <Link
                        key={circle.id}
                        href={`/circles/${circle.id}`}
                        className="group relative rounded-3xl bg-[#0E1013] border border-white/10 hover:border-[#C5FF35]/50 transition-all duration-300 p-6 flex flex-col justify-between space-y-5 hover:shadow-[0_0_30px_rgba(197,255,53,0.1)]"
                      >
                        <div className="space-y-3">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
                              {circle.members.length} MEMBERS
                            </span>
                            {isOwner ? (
                              <span className="px-2.5 py-1 rounded-full bg-[#C5FF35]/10 border border-[#C5FF35]/30 text-[10px] font-mono text-[#C5FF35] font-bold">
                                OWNER
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-neutral-400">
                                by @{circle.createdBy}
                              </span>
                            )}
                          </div>

                          {/* Circle Title & Description */}
                          <div className="space-y-1">
                            <h3 className="font-display font-bold text-xl text-white group-hover:text-[#C5FF35] transition-colors">
                              {circle.name}
                            </h3>
                            {circle.description && (
                              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                                {circle.description}
                              </p>
                            )}
                          </div>

                          {/* Plan Status Banner */}
                          {chosenEvent ? (
                            <div className="p-3 rounded-2xl bg-white/5 border border-[#C5FF35]/30 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C5FF35] uppercase font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>CHOSEN OFFICIAL PLAN</span>
                              </div>
                              <div className="font-display font-medium text-sm text-white line-clamp-1">
                                {chosenEvent.title}
                              </div>
                              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#C5FF35]" />
                                <span>{chosenEvent.shortDate} · {chosenEvent.venue}</span>
                              </div>
                            </div>
                          ) : circle.suggestions.length > 0 ? (
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase font-bold">
                                <Vote className="w-3.5 h-3.5" />
                                <span>VOTING IN PROGRESS</span>
                              </div>
                              <div className="text-xs text-neutral-300 font-mono">
                                {circle.suggestions.length} events suggested · Members voting
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-400">
                              No events suggested yet. Click to suggest!
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Members Avatars + Action */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {circle.members.slice(0, 4).map((m, i) => (
                              <div
                                key={m}
                                className="w-7 h-7 rounded-full bg-[#1A1D20] border-2 border-[#0E1013] text-[10px] font-bold text-white flex items-center justify-center uppercase font-mono"
                                title={`@${m}`}
                              >
                                {m.charAt(0)}
                              </div>
                            ))}
                            {circle.members.length > 4 && (
                              <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#0E1013] text-[9px] font-bold text-white flex items-center justify-center font-mono">
                                +{circle.members.length - 4}
                              </div>
                            )}
                          </div>

                          <div className="text-xs font-mono font-bold text-white group-hover:text-[#C5FF35] flex items-center gap-1">
                            <span>Open Room</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ALL CAMPUS CIRCLES / EXPLORE SQUADS */}
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5FF35]" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Live Campus Circles
                </h2>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Explore active campus circles, coordinate plans, or request to join.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circles.map((circle) => {
                const chosenEvent = circle.targetEventId
                  ? EVENTS.find((e) => e.id === circle.targetEventId)
                  : null;

                return (
                  <div
                    key={circle.id}
                    className="rounded-3xl bg-[#0E1013] border border-white/10 p-6 flex flex-col justify-between space-y-5 hover:border-white/20 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
                          {circle.members.length} SQUAD MEMBERS
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Invite: <strong className="text-white font-mono">{circle.inviteCode}</strong>
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display font-bold text-lg text-white">
                          {circle.name}
                        </h3>
                        {circle.description && (
                          <p className="text-xs text-neutral-400 line-clamp-2">
                            {circle.description}
                          </p>
                        )}
                      </div>

                      {chosenEvent && (
                        <div className="p-3 rounded-2xl bg-white/5 border border-[#C5FF35]/25 space-y-1 text-xs">
                          <span className="text-[10px] font-mono text-[#C5FF35] uppercase font-bold block">
                            TARGET EVENT
                          </span>
                          <span className="font-display font-medium text-white block truncate">
                            {chosenEvent.title}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="text-[11px] font-mono text-neutral-400">
                        Created by @{circle.createdBy}
                      </div>

                      <Link
                        href={`/circles/${circle.id}`}
                        className="spicy-btn px-4 py-2 rounded-full bg-white text-black hover:bg-[#C5FF35] text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>View Circle</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HOW PADI CIRCLE WORKS - 3 STEPS */}
          <div className="rounded-3xl lg:rounded-[36px] bg-[#0E1013] border border-white/10 p-8 sm:p-12 space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-mono text-[#C5FF35] uppercase font-bold tracking-widest">
                HOW IT WORKS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
                How friends go out together on PartyPadi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5FF35] text-black font-display font-black text-sm flex items-center justify-center">
                  01
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Create a Circle & Invite Your Crew
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Start a private planning space with a custom name. Share your unique invite link directly to your WhatsApp group chat.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white text-black font-display font-black text-sm flex items-center justify-center">
                  02
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Suggest Events & Cast Votes
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Browse PartyPadi listings and propose events to your group. Every member gets 1 vote with live tallies to see what everyone actually wants.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5FF35] text-black font-display font-black text-sm flex items-center justify-center">
                  03
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Confirm Plan & Check Passes
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The Circle owner confirms the final event. Each friend buys their individual ticket, and the group checklist tracks who has secured their pass.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
