"use client";

import React, { useState } from "react";
import { X, Users, Calendar, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./Toast";
import { EVENTS } from "@/data/events";

export function PartyCircleModal() {
  const {
    circleModalOpen,
    closeCircleModal,
    createCircle,
    currentUser,
    activeTargetEventId,
    openAuthModal,
  } = useAuth();
  const { showToast } = useToast();

  const [circleName, setCircleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(activeTargetEventId || EVENTS[0]?.id || "");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  if (!circleModalOpen) return null;

  if (!currentUser) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeCircleModal}
      >
        <div
          className="relative w-full max-w-md bg-[#0C0D0E] border border-white/10 text-white rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeCircleModal}
            className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-full bg-white/5"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-[#C5FF35] text-[#0C0D0E] flex items-center justify-center mx-auto shadow-md">
            <Users className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl text-white">
              Create a Party Circle
            </h3>
            <p className="text-xs text-neutral-400">
              Sign in or create a partygoer profile to rally your friends and organize an event gathering.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              closeCircleModal();
              openAuthModal("signup", "partygoer");
            }}
            className="spicy-btn w-full py-3 bg-[#C5FF35] text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#b5f220] transition-all shadow-md"
          >
            Join PartyPadi to Start Circles →
          </button>
        </div>
      </div>
    );
  }

  const toggleFriend = (tag: string) => {
    if (selectedFriends.includes(tag)) {
      setSelectedFriends(selectedFriends.filter((f) => f !== tag));
    } else {
      setSelectedFriends([...selectedFriends, tag]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleName.trim()) {
      showToast({
        type: "error",
        title: "Circle Name Required",
        message: "Please give your gathering circle a name.",
      });
      return;
    }

    const created = createCircle({
      name: circleName,
      description,
      members: selectedFriends,
      targetEventId: selectedEventId || activeTargetEventId,
    });

    showToast({
      type: "success",
      title: "Party Circle Created!",
      message: `"${created.name}" is now active. Your friends have been notified.`,
    });

    closeCircleModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeCircleModal}
    >
      <div
        className="relative w-full max-w-lg bg-[#0C0D0E] border border-white/10 text-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeCircleModal}
          className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 pb-4 border-b border-white/10 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
            <span>MAKE PLANS WITH YOUR PEOPLE</span>
          </div>
          <h3 className="font-display font-medium text-2xl text-white">
            Start a Gathering Circle
          </h3>
          <p className="text-xs text-neutral-400">
            Organize a meetup point, coordinate tickets, and roll up to campus events together.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
          {/* Circle Name */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              CIRCLE NAME *
            </label>
            <input
              type="text"
              required
              value={circleName}
              onChange={(e) => setCircleName(e.target.value)}
              placeholder="e.g. Main Hall Sunset Crew, Law '26 Squad"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
            />
          </div>

          {/* Select Target Event */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              TARGET CAMPUS EVENT
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#141517] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5FF35]"
            >
              {EVENTS.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.shortDate}) · {ev.venue}
                </option>
              ))}
            </select>
          </div>

          {/* Invite Friends from Network */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
              INVITE PADI FRIENDS
            </label>
            {currentUser.friends.length === 0 ? (
              <p className="text-xs text-neutral-500 bg-white/5 p-3 rounded-xl">
                You haven&apos;t added any friends yet. You can invite friends by username after creating this circle.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentUser.friends.map((friendTag) => {
                  const isSelected = selectedFriends.includes(friendTag);
                  return (
                    <button
                      type="button"
                      key={friendTag}
                      onClick={() => toggleFriend(friendTag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? "bg-[#C5FF35] text-[#0C0D0E] font-bold border-[#C5FF35]"
                          : "bg-white/5 border-white/10 text-neutral-300 hover:text-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>@{friendTag}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Meetup / Gathering Note */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              MEETUP NOTES & PLANS (OPTIONAL)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Linking up at Faculty of Arts Quad lawn by 6:00 PM before moving to the venue."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] resize-none"
            />
          </div>

          <button
            type="submit"
            className="spicy-btn w-full py-3 bg-[#C5FF35] text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#b5f220] transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>Launch Circle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
