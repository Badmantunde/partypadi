"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { TicketModal } from "@/components/TicketModal";
import { EVENTS } from "@/data/events";
import { CampusEvent, PartyCircle } from "@/types";
import {
  Users,
  Sparkles,
  Plus,
  Vote,
  CheckCircle2,
  Calendar,
  MapPin,
  Share2,
  Lock,
  ArrowRight,
  UserCheck,
  UserX,
  RefreshCw,
  Edit3,
  Ticket,
  Clock,
  Search,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function CircleDetailClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const circleId = params?.id as string;
  const inviteCodeQuery = searchParams?.get("invite") || "";

  const {
    currentUser,
    circles,
    getCircle,
    joinCircle,
    leaveCircle,
    removeCircleMember,
    suggestEventToCircle,
    voteForEvent,
    selectFinalEvent,
    reopenVoting,
    getMemberTicketStatus,
    updateCircle,
    openAuthModal,
  } = useAuth();

  const { showToast } = useToast();

  // Local state for modals & interactions
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ticketModalEvent, setTicketModalEvent] = useState<CampusEvent | null>(null);

  // Search filter inside Suggest Modal
  const [eventSearchQuery, setEventSearchQuery] = useState("");

  // Edit Circle State
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Copy states
  const [copiedLink, setCopiedLink] = useState(false);

  // Retrieve current circle from context
  const circle = getCircle(circleId);

  useEffect(() => {
    if (circle) {
      setEditName(circle.name);
      setEditDescription(circle.description || "");
    }
  }, [circle?.name, circle?.description]);

  if (!circle) {
    return (
      <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Circle Not Found</h1>
          <p className="text-sm text-neutral-400">
            The Circle you are looking for does not exist or may have been deleted.
          </p>
          <Link
            href="/circles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5FF35] text-black font-mono text-xs font-bold rounded-full hover:bg-white transition-all shadow-md"
          >
            ← Back to Circles Hub
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isMember = currentUser
    ? circle.members.some((m) => m.toLowerCase() === currentUser.username.toLowerCase())
    : false;

  const isOwner = currentUser
    ? circle.createdBy.toLowerCase() === currentUser.username.toLowerCase()
    : false;

  // Selected final event
  const selectedOfficialEvent = circle.targetEventId
    ? EVENTS.find((e) => e.id === circle.targetEventId)
    : null;

  // Handle Joining from Invite Query or Button
  const handleJoinThisCircle = () => {
    if (!currentUser) {
      openAuthModal("signin");
      showToast({
        type: "info",
        title: "Sign In Required",
        message: "Sign in or register to join this circle with your friends.",
      });
      return;
    }

    const res = joinCircle(circle.inviteCode || circle.id);
    if (res.success) {
      showToast({
        type: "success",
        title: "Welcome to the Squad!",
        message: res.message,
      });
    } else {
      showToast({
        type: "info",
        title: "Notice",
        message: res.message,
      });
    }
  };

  // Handle Leave Circle
  const handleLeaveThisCircle = () => {
    if (!currentUser) return;
    if (confirm("Are you sure you want to leave this circle?")) {
      const ok = leaveCircle(circle.id);
      if (ok) {
        showToast({
          type: "info",
          title: "Left Circle",
          message: `You left "${circle.name}".`,
        });
        router.push("/circles");
      }
    }
  };

  // Handle Remove Member
  const handleRemoveMember = (memberUsername: string) => {
    if (!isOwner) return;
    if (confirm(`Remove @${memberUsername} from this circle?`)) {
      const ok = removeCircleMember(circle.id, memberUsername);
      if (ok) {
        showToast({
          type: "info",
          title: "Member Removed",
          message: `@${memberUsername} was removed.`,
        });
      }
    }
  };

  // Handle Regenerate Invite Code
  const handleRegenerateInviteCode = () => {
    if (!isOwner) return;
    const newCode = (
      circle.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4) +
      Math.floor(1000 + Math.random() * 9000)
    ).toUpperCase();
    updateCircle(circle.id, { inviteCode: newCode });
    showToast({
      type: "success",
      title: "New Invite Code Generated",
      message: `Updated to ${newCode}.`,
    });
  };

  // Handle Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner || !editName.trim()) return;
    updateCircle(circle.id, {
      name: editName.trim(),
      description: editDescription.trim(),
    });
    setEditModalOpen(false);
    showToast({
      type: "success",
      title: "Circle Updated",
      message: "Changes saved successfully.",
    });
  };

  // Handle Propose Event
  const handleProposeEvent = (eventId: string) => {
    if (!currentUser || !isMember) return;
    const ok = suggestEventToCircle(circle.id, eventId);
    if (ok) {
      setSuggestModalOpen(false);
      showToast({
        type: "success",
        title: "Event Suggested!",
        message: "Your suggestion has been added to the voting board.",
      });
    }
  };

  // Handle Vote
  const handleVote = (suggestionId: string) => {
    if (!currentUser || !isMember) return;
    voteForEvent(circle.id, suggestionId);
  };

  // Handle Owner Final Event Selection
  const handleSelectOfficialEvent = (eventId: string) => {
    if (!isOwner) return;
    selectFinalEvent(circle.id, eventId);
    showToast({
      type: "success",
      title: "Official Plan Confirmed! 🎉",
      message: "The circle plan has been updated. Members can now secure passes.",
    });
  };

  // Handle Reopen Voting
  const handleReopenVoting = () => {
    if (!isOwner) return;
    reopenVoting(circle.id);
    showToast({
      type: "info",
      title: "Voting Reopened",
      message: "Members can cast votes on suggested events again.",
    });
  };

  // Copy Invite Link
  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/circles/${circle.id}?invite=${circle.inviteCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast({
      type: "success",
      title: "Invite Link Copied!",
      message: "Share it on your WhatsApp squad group or DM your friends.",
    });
  };

  // Filter events in suggest modal
  const filteredEventsToSuggest = EVENTS.filter((e) =>
    e.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
    e.campus.toLowerCase().includes(eventSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col font-sans selection:bg-[#C5FF35] selection:text-black">
      <Navbar />

      <main className="flex-1">
        {/* NON-MEMBER INVITATION GATE */}
        {!isMember ? (
          <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
            <div className="rounded-3xl bg-[#0E1013] border border-white/15 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-[#C5FF35] text-black flex items-center justify-center mx-auto shadow-lg">
                <Users className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] animate-pulse" />
                  <span>YOU'VE BEEN INVITED TO JOIN</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-display font-medium text-white tracking-tight">
                  {circle.name}
                </h1>
                {circle.description && (
                  <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
                    {circle.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 py-2 font-mono text-xs text-neutral-300">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <UserCheck className="w-3.5 h-3.5 text-[#C5FF35]" />
                  <span>Hosted by @{circle.createdBy}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <Users className="w-3.5 h-3.5 text-[#C5FF35]" />
                  <span>{circle.members.length} Squad Members</span>
                </div>
              </div>

              {/* Private notice */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-xs text-neutral-400 font-mono flex items-center gap-2.5 text-left">
                <Lock className="w-4 h-4 text-[#C5FF35] shrink-0" />
                <span>
                  Circle suggestions, live voting tallies, and member ticket checklists are private to members.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleJoinThisCircle}
                  className="spicy-btn px-8 py-3.5 bg-[#C5FF35] text-[#0C0D0E] hover:bg-white rounded-full text-xs font-mono font-bold tracking-tight shadow-[0_0_25px_rgba(197,255,53,0.35)] inline-flex items-center gap-2 transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Join "{circle.name}" Now</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* FULL MEMBER CIRCLE PLANNING SPACE */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            {/* Top Breadcrumb & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Link href="/circles" className="hover:text-white transition-colors">
                    PADI CIRCLES
                  </Link>
                  <span>/</span>
                  <span className="text-white/60 truncate uppercase font-bold">{circle.name}</span>
                  {isOwner && (
                    <span className="bg-[#C5FF35]/10 text-[#C5FF35] px-2 py-0.5 rounded text-[10px] font-bold border border-[#C5FF35]/30">
                      OWNER
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-4xl font-display font-medium text-white tracking-tight">
                    {circle.name}
                  </h1>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(true)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      title="Edit Circle Name & Info"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {circle.description && (
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                    {circle.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(true)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C5FF35]" />
                  <span>Invite Friends</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSuggestModalOpen(true)}
                  className="spicy-btn px-4 py-2 bg-[#C5FF35] text-[#0C0D0E] hover:bg-white rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Suggest Event</span>
                </button>

                <button
                  type="button"
                  onClick={handleLeaveThisCircle}
                  className="px-3.5 py-2 text-neutral-400 hover:text-red-400 text-xs font-mono transition-colors"
                  title="Leave this circle"
                >
                  Leave Circle
                </button>
              </div>
            </div>

            {/* Two-Column Responsive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: Main Planning Stage */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. OFFICIALLY SELECTED EVENT SECTION */}
                {selectedOfficialEvent && (
                  <div className="rounded-3xl bg-[#0E1013] border-2 border-[#C5FF35]/40 p-6 sm:p-8 space-y-6 shadow-[0_0_35px_rgba(197,255,53,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#C5FF35] text-[#0C0D0E] px-4 py-1 text-[11px] font-mono font-black uppercase tracking-wider rounded-bl-2xl">
                      OFFICIAL SQUAD PLAN
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-56 h-48 md:h-auto rounded-2xl overflow-hidden relative shrink-0">
                        <Image
                          src={selectedOfficialEvent.imageUrl}
                          alt={selectedOfficialEvent.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C5FF35] uppercase font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>The Circle has chosen where we are going</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-display font-medium text-white leading-snug">
                          {selectedOfficialEvent.title}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C5FF35]" />
                            <span>{selectedOfficialEvent.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#C5FF35]" />
                            <span>{selectedOfficialEvent.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2">
                            <MapPin className="w-3.5 h-3.5 text-[#C5FF35] shrink-0" />
                            <span>{selectedOfficialEvent.fullLocation}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setTicketModalEvent(selectedOfficialEvent)}
                            className="spicy-btn w-full sm:w-auto px-6 py-3 bg-[#C5FF35] text-[#0C0D0E] hover:bg-white rounded-full text-xs font-mono font-black tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <Ticket className="w-4 h-4" />
                            <span>Get My Ticket (Individual Checkout)</span>
                          </button>

                          <Link
                            href={`/events/${selectedOfficialEvent.id}`}
                            className="w-full sm:w-auto text-center justify-center px-4 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/5 text-xs font-mono transition-all flex items-center gap-1.5"
                          >
                            <span>Event Details</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {isOwner && (
                            <button
                              type="button"
                              onClick={handleReopenVoting}
                              className="text-xs font-mono text-neutral-400 hover:text-white underline underline-offset-4 ml-auto"
                            >
                              Reopen Voting / Change Plan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Verified Member Ticket Checklist */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#C5FF35]" />
                          <span className="text-xs font-mono uppercase text-white font-bold">
                            Squad Attendance & Ticket Checklist
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400">
                          Verified automatically via PartyPadi
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {circle.members.map((memberUsername) => {
                          const hasTicket = getMemberTicketStatus(
                            selectedOfficialEvent.id,
                            memberUsername
                          );
                          const isMe =
                            currentUser &&
                            currentUser.username.toLowerCase() === memberUsername.toLowerCase();

                          return (
                            <div
                              key={memberUsername}
                              className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                                hasTicket
                                  ? "bg-[#C5FF35]/10 border-[#C5FF35]/30 text-white"
                                  : "bg-white/5 border-white/10 text-neutral-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs uppercase font-mono ${
                                    hasTicket
                                      ? "bg-[#C5FF35] text-black"
                                      : "bg-white/10 text-white"
                                  }`}
                                >
                                  {memberUsername.charAt(0)}
                                </div>
                                <div className="text-xs font-mono">
                                  <span className="font-bold">@{memberUsername}</span>
                                  {isMe && <span className="text-neutral-400 ml-1">(You)</span>}
                                </div>
                              </div>

                              <div>
                                {hasTicket ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C5FF35]/20 text-[#C5FF35] text-[10px] font-mono font-bold">
                                    <Check className="w-3 h-3" />
                                    <span>Ticket Secured</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono text-neutral-400">
                                    Hasn't secured ticket
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-[10px] font-mono text-neutral-400 pt-1">
                        * Individual purchases only. Other members never see your private QR codes, matric numbers, or transaction details.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. SUGGESTED EVENTS & LIVE VOTING BOARD */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Vote className="w-4 h-4 text-[#C5FF35]" />
                        <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                          Suggested Events & Voting Board ({circle.suggestions.length})
                        </h2>
                      </div>
                      <p className="text-xs font-mono text-neutral-400">
                        1 active vote per member. The group preferred pick will emerge in real time.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSuggestModalOpen(true)}
                      className="px-3 py-1.5 rounded-full border border-white/20 hover:border-[#C5FF35] bg-white/5 text-xs font-mono text-white flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C5FF35]" />
                      <span>Suggest Event</span>
                    </button>
                  </div>

                  {circle.suggestions.length === 0 ? (
                    <div className="rounded-3xl bg-[#0E1013] border border-white/10 p-8 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 mx-auto">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display font-medium text-lg text-white">
                          No events suggested yet
                        </h3>
                        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                          Be the first to suggest a party, dinner, or concert for the group to vote on!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSuggestModalOpen(true)}
                        className="px-5 py-2.5 rounded-full bg-[#C5FF35] text-black text-xs font-mono font-bold hover:bg-white transition-all shadow-md inline-flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Browse & Suggest an Event</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {circle.suggestions.map((suggestion) => {
                        const event = EVENTS.find((e) => e.id === suggestion.eventId);
                        if (!event) return null;

                        const voteCount = suggestion.votes.length;
                        const hasVotedForThis = currentUser
                          ? suggestion.votes.includes(currentUser.username)
                          : false;
                        const isOfficialSelected = circle.targetEventId === event.id;

                        return (
                          <div
                            key={suggestion.id}
                            className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                              isOfficialSelected
                                ? "bg-[#C5FF35]/5 border-[#C5FF35]/40"
                                : hasVotedForThis
                                ? "bg-white/[0.04] border-[#C5FF35]/40"
                                : "bg-[#0E1013] border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              {/* Left Thumbnail + Meta */}
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden relative shrink-0">
                                  <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                                      {event.title}
                                    </h3>
                                    {isOfficialSelected && (
                                      <span className="px-2 py-0.5 rounded-full bg-[#C5FF35] text-black text-[9px] font-mono font-bold">
                                        OFFICIAL PLAN
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
                                    <span>{event.shortDate}</span>
                                    <span>·</span>
                                    <span>{event.venue}</span>
                                    <span>·</span>
                                    <span className="text-[#C5FF35] font-bold">
                                      {event.isFree ? "Free Entry" : `From ₦${event.priceStartingFrom.toLocaleString()}`}
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-mono text-neutral-400">
                                    Suggested by @{suggestion.suggestedBy}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Vote Tally & Buttons */}
                              <div className="flex items-center gap-3 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div className="font-display font-bold text-base text-white">
                                      {voteCount} {voteCount === 1 ? "Vote" : "Votes"}
                                    </div>
                                    <div className="text-[10px] font-mono text-neutral-400 flex -space-x-1 justify-end">
                                      {suggestion.votes.map((v) => (
                                        <span
                                          key={v}
                                          className="w-4 h-4 rounded-full bg-white/10 text-[8px] flex items-center justify-center font-mono border border-black"
                                          title={`@${v}`}
                                        >
                                          {v.charAt(0)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleVote(suggestion.id)}
                                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                                    hasVotedForThis
                                      ? "bg-[#C5FF35] text-black shadow-[0_0_15px_rgba(197,255,53,0.3)] hover:bg-[#b8f525]"
                                      : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                                  }`}
                                >
                                  {hasVotedForThis ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Voted</span>
                                    </>
                                  ) : (
                                    <>
                                      <Vote className="w-3.5 h-3.5" />
                                      <span>Vote</span>
                                    </>
                                  )}
                                </button>

                                {isOwner && !isOfficialSelected && (
                                  <button
                                    type="button"
                                    onClick={() => handleSelectOfficialEvent(event.id)}
                                    className="px-3 py-2 rounded-full border border-white/20 hover:border-[#C5FF35] hover:text-[#C5FF35] text-xs font-mono text-white/80 transition-all"
                                    title="Choose this as the official group plan"
                                  >
                                    Select as Plan
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Squad Members & Live Activity Feed */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl bg-[#0E1013] border border-white/10 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C5FF35]" />
                      <h3 className="font-display font-bold text-base text-white">
                        Squad Members ({circle.members.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInviteModalOpen(true)}
                      className="text-xs font-mono text-[#C5FF35] hover:underline"
                    >
                      + Invite
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {circle.members.map((memberUsername) => {
                      const isSquadOwner =
                        circle.createdBy.toLowerCase() === memberUsername.toLowerCase();
                      const isMe =
                        currentUser &&
                        currentUser.username.toLowerCase() === memberUsername.toLowerCase();

                      return (
                        <div
                          key={memberUsername}
                          className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#16181A] border border-white/10 flex items-center justify-center font-bold text-xs uppercase font-mono text-[#C5FF35]">
                              {memberUsername.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                                <span>@{memberUsername}</span>
                                {isSquadOwner && (
                                  <span className="text-[9px] bg-[#C5FF35]/20 text-[#C5FF35] px-1.5 py-0.2 rounded font-mono">
                                    Owner
                                  </span>
                                )}
                              </div>
                              {isMe && (
                                <span className="text-[10px] text-neutral-400 font-mono">You</span>
                              )}
                            </div>
                          </div>

                          {isOwner && !isSquadOwner && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(memberUsername)}
                              className="text-neutral-500 hover:text-red-400 text-xs font-mono p-1"
                              title="Remove member"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setInviteModalOpen(true)}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-white flex items-center justify-center gap-2 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#C5FF35]" />
                      <span>Share Circle Invite Code</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#0E1013] border border-white/10 p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <MessageSquare className="w-4 h-4 text-[#C5FF35]" />
                    <h3 className="font-display font-bold text-base text-white">Circle Activity</h3>
                  </div>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {circle.activity.map((act) => (
                      <div key={act.id} className="text-xs space-y-1 border-l-2 border-white/15 pl-3 py-0.5">
                        <p className="text-neutral-200 leading-snug">{act.description}</p>
                        <span className="text-[10px] font-mono text-neutral-500 block">
                          {new Date(act.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          · {new Date(act.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: SUGGEST AN EVENT MODAL */}
      {suggestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSuggestModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0C0D0E] border border-white/15 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#C5FF35] uppercase font-bold tracking-wider">
                  PARTYPADI CATALOG
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  Suggest an Event to "{circle.name}"
                </h3>
              </div>
              <button
                onClick={() => setSuggestModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="py-4 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  placeholder="Search events, venues, or campus categories..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#C5FF35]"
                />
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {filteredEventsToSuggest.map((evt) => {
                const alreadySuggested = circle.suggestions.some((s) => s.eventId === evt.id);

                return (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0">
                        <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-display font-bold text-sm text-white truncate">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                          <span>{evt.shortDate}</span>
                          <span>·</span>
                          <span className="truncate">{evt.venue}</span>
                        </div>
                        <span className="text-xs font-mono text-[#C5FF35] font-bold block">
                          {evt.isFree ? "Free Entry" : `From ₦${evt.priceStartingFrom.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={alreadySuggested}
                      onClick={() => handleProposeEvent(evt.id)}
                      className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all shrink-0 ${
                        alreadySuggested
                          ? "bg-white/10 text-neutral-500 cursor-not-allowed"
                          : "bg-[#C5FF35] text-black hover:bg-white shadow-sm"
                      }`}
                    >
                      {alreadySuggested ? "Suggested" : "Propose to Squad"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INVITE FRIENDS MODAL */}
      {inviteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setInviteModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#0C0D0E] border border-white/15 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-0.5">
                <span className="text-[10px] font-mono text-[#C5FF35] uppercase font-bold tracking-wider">
                  INVITATION ACCESS
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  Invite Squad to Circle
                </h3>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 block uppercase">
                Circle Invite Code
              </label>
              <div className="p-3 bg-white/5 border border-white/15 rounded-xl flex items-center justify-between font-mono">
                <span className="text-lg font-bold text-[#C5FF35] tracking-widest">
                  {circle.inviteCode}
                </span>
                {isOwner && (
                  <button
                    type="button"
                    onClick={handleRegenerateInviteCode}
                    className="p-1 text-neutral-400 hover:text-white"
                    title="Regenerate code"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-400 block uppercase">
                Shareable Squad Link
              </label>
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="w-full p-3 bg-black/50 border border-white/15 rounded-xl flex items-center justify-between text-xs font-mono hover:border-[#C5FF35] transition-colors"
              >
                <span className="truncate text-neutral-300">
                  partypadi.ng/circles/{circle.id}?invite={circle.inviteCode}
                </span>
                <span className="text-[#C5FF35] font-bold shrink-0 ml-2">
                  {copiedLink ? "Copied!" : "Copy Link"}
                </span>
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Link up with our PartyPadi Circle "${circle.name}"! Vote on where we're going: ${typeof window !== "undefined" ? window.location.origin : ""}/circles/${circle.id}?invite=${circle.inviteCode}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="spicy-btn w-full py-3 bg-[#25D366] text-white rounded-full font-mono text-xs font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <span>Share on WhatsApp Group</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT CIRCLE MODAL (Owner Only) */}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#0C0D0E] border border-white/15 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-lg text-white">Edit Circle Details</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">
                  Circle Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1 uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#C5FF35]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-white/15 text-xs font-mono text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#C5FF35] text-black text-xs font-mono font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET CHECKOUT MODAL INTEGRATION */}
      <TicketModal
        event={ticketModalEvent}
        isOpen={Boolean(ticketModalEvent)}
        onClose={() => setTicketModalEvent(null)}
      />

      <Footer />
    </div>
  );
}
