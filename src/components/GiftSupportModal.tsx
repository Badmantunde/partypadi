"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Building2,
  Calendar,
  Lock,
  UserCheck,
} from "lucide-react";
import {
  useAuth,
  GIFTER_LEVEL_INFO,
  getGifterLevel,
  getNextLevelProgress,
} from "@/context/AuthContext";
import { useToast } from "./Toast";
import { GifterLevel, GiftType } from "@/types";
import { GifterBadge } from "./GifterBadge";

interface GiftSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  // If sponsoring an event
  eventId?: string;
  eventTitle?: string;
  // If gifting an organizer
  organizerId?: string;
  organizerName?: string;
  initialType?: GiftType;
  campus?: string;
}

const PRESET_AMOUNTS = [
  { amount: 2500, label: "₦2,500", level: 1 as GifterLevel, note: "Padi Support" },
  { amount: 7500, label: "₦7,500", level: 2 as GifterLevel, note: "Plug Booster" },
  { amount: 25000, label: "₦25,000", level: 3 as GifterLevel, note: "Hype Padi" },
  { amount: 50000, label: "₦50,000", level: 4 as GifterLevel, note: "Big Padi" },
  { amount: 100000, label: "₦100,000", level: 5 as GifterLevel, note: "Headliner" },
  { amount: 250000, label: "₦250,000", level: 6 as GifterLevel, note: "Campus Legend" },
];

export function GiftSupportModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  organizerId,
  organizerName = "Campus Organizer",
  initialType = "event_sponsorship",
  campus = "Main Campus",
}: GiftSupportModalProps) {
  const { currentUser, sendGift, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [giftType, setGiftType] = useState<GiftType>(
    eventId ? initialType : "direct_organizer_gift"
  );
  const [selectedAmount, setSelectedAmount] = useState<number>(7500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [guestName, setGuestName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentGiftAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const userCurrentLifetime = currentUser?.totalGifted || 0;
  const prospectiveLifetime = userCurrentLifetime + currentGiftAmount;
  const prospectiveLevel = getGifterLevel(prospectiveLifetime);
  const prospectiveBadge = GIFTER_LEVEL_INFO[prospectiveLevel];
  const progressInfo = getNextLevelProgress(prospectiveLifetime);

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setIsCustom(true);
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentGiftAmount < 500) {
      showToast({
        type: "error",
        title: "Minimum Support",
        message: "Minimum contribution amount is ₦500.",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmAndPay = () => {
    setIsSubmitting(true);

    try {
      const res = sendGift({
        type: giftType,
        eventId: giftType === "event_sponsorship" ? eventId : undefined,
        eventTitle: giftType === "event_sponsorship" ? eventTitle : undefined,
        organizerId,
        organizerName,
        amount: currentGiftAmount,
        message: message.trim() || undefined,
        isPublic,
        customName: !currentUser && guestName.trim() ? guestName.trim() : undefined,
        campus,
      });

      if (res.success) {
        const badge = GIFTER_LEVEL_INFO[res.newGifterLevel];
        showToast({
          type: "success",
          title: "Support Confirmed!",
          message: `You earned the ${badge.name} badge! Verified contribution attributed to ${
            giftType === "event_sponsorship" ? eventTitle : organizerName
          }.`,
        });
        setShowConfirmation(false);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0C0D0E] border border-white/10 text-white rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center pt-1 pb-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono uppercase tracking-wider text-amber-300">
            <Heart className="w-3 h-3 fill-amber-300" />
            <span>PADI GIFTER · CAMPUS SUPPORT</span>
          </div>

          <h3 className="font-display font-medium text-xl sm:text-2xl text-white">
            {giftType === "event_sponsorship" ? (
              <>Sponsor Event Vibe</>
            ) : (
              <>Gift {organizerName}</>
            )}
          </h3>

          <p className="text-xs text-neutral-400 max-w-md mx-auto truncate">
            {giftType === "event_sponsorship" && eventTitle ? (
              <>
                Contributing toward{" "}
                <strong className="text-white font-medium">{eventTitle}</strong>
              </>
            ) : (
              <>Direct appreciation gift to keep campus culture thriving</>
            )}
          </p>
        </div>

        {/* Optional Mode Switcher (if both event and organizer exist) */}
        {eventId && (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-3 shrink-0 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setGiftType("event_sponsorship");
                setShowConfirmation(false);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                giftType === "event_sponsorship"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sponsor Event</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setGiftType("direct_organizer_gift");
                setShowConfirmation(false);
              }}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                giftType === "direct_organizer_gift"
                  ? "bg-white text-black font-bold shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Gift Organizer</span>
            </button>
          </div>
        )}

        {!showConfirmation ? (
          /* Form Body */
          <form
            onSubmit={handleProceedToConfirm}
            className="overflow-y-auto space-y-4 pr-0.5 flex-1"
          >
            {/* Amount Presets */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                CHOOSE CONTRIBUTION AMOUNT (₦)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((preset) => {
                  const isSelected = !isCustom && selectedAmount === preset.amount;
                  return (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => handleSelectPreset(preset.amount)}
                      className={`p-2.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "bg-[#C5FF35] text-[#0C0D0E] border-[#C5FF35] font-bold shadow-md ring-2 ring-[#C5FF35]/30"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      <span className="font-mono text-xs block">{preset.label}</span>
                      <span
                        className={`text-[9px] block truncate ${
                          isSelected ? "text-[#0C0D0E]/80" : "text-neutral-400"
                        }`}
                      >
                        {preset.note}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Field */}
              <div className="pt-1.5">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Enter custom amount (min ₦500)"
                    className={`w-full pl-8 pr-3.5 py-2.5 bg-white/5 border rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none font-mono ${
                      isCustom ? "border-[#C5FF35] ring-1 ring-[#C5FF35]" : "border-white/10"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Live Gifter Level & Badge Preview */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GifterBadge level={prospectiveLevel} size="md" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                    Total Lifetime Support
                  </span>
                  <span className="font-mono text-sm text-[#C5FF35] font-bold">
                    ₦{prospectiveLifetime.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Milestone progress notice */}
              <div className="pt-1 border-t border-white/5 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>{progressInfo.text}</span>
                  <span>{progressInfo.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#C5FF35] transition-all duration-300"
                    style={{ width: `${progressInfo.percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Guest Name if not logged in */}
            {!currentUser && (
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  YOUR NAME / ALIAS (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Tunde Vibes or Favour K."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
                />
              </div>
            )}

            {/* Shoutout Message */}
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                CHEER MESSAGE / VIBE NOTE (OPTIONAL)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Drinks support for the sound engineering crew! Keep the energy high"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] resize-none"
              />
            </div>

            {/* Public vs Anonymous Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="text-xs text-white block font-medium">
                  {isPublic ? "Public Recognition" : "Anonymous Padi"}
                </span>
                <span className="text-[10px] text-neutral-400 block leading-tight">
                  {isPublic
                    ? "Display your name and badge on event walls and campus leaderboards."
                    : "Your support is verified, but your name appears as 'Anonymous Padi' everywhere."}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  isPublic ? "bg-[#C5FF35]" : "bg-white/20"
                }`}
                aria-label="Toggle public anonymity"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-[#0C0D0E] transition-transform ${
                    isPublic ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={currentGiftAmount < 500}
              className="spicy-btn w-full py-3.5 bg-[#C5FF35] text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#b5f220] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Heart className="w-4 h-4 fill-[#0C0D0E]" />
              <span>Review & Support ₦{currentGiftAmount.toLocaleString()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* Confirmation & Payment Verification Step */
          <div className="space-y-4 overflow-y-auto pr-0.5 flex-1">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                PAYMENT & RECIPIENT VERIFICATION
              </span>

              <div className="space-y-2 text-xs divide-y divide-white/5">
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Contribution Type</span>
                  <span className="text-white font-mono font-medium">
                    {giftType === "event_sponsorship" ? "Event Sponsorship" : "Direct Organizer Gift"}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Recipient</span>
                  <span className="text-white font-medium text-right max-w-[200px] truncate">
                    {giftType === "event_sponsorship" && eventTitle ? eventTitle : organizerName}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Organizer Credit</span>
                  <span className="text-neutral-300 font-mono">{organizerName}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Contribution Amount</span>
                  <span className="text-[#C5FF35] font-mono font-bold text-sm">
                    ₦{currentGiftAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Platform Processing Fee</span>
                  <span className="text-[#C5FF35] font-mono">₦0 (0% Launch Fee)</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Supporter Identity</span>
                  <span className="text-white font-medium">
                    {isPublic
                      ? currentUser?.fullName || guestName || "Campus Supporter"
                      : "Anonymous Padi (Private)"}
                  </span>
                </div>

                {message && (
                  <div className="py-1">
                    <span className="text-neutral-400 block mb-0.5">Cheer Note:</span>
                    <span className="text-neutral-300 italic text-[11px] block bg-white/5 p-2 rounded-xl">
                      &ldquo;{message}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Badge Unlocked Card */}
            <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center gap-3">
              <GifterBadge level={prospectiveLevel} size="sm" />
              <div className="text-xs">
                <span className="font-bold text-amber-300 block">
                  {prospectiveBadge.badgeStyle}
                </span>
                <span className="text-[11px] text-neutral-300">
                  {prospectiveBadge.meaning}
                </span>
              </div>
            </div>

            {/* Trust & Settlement Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-2xl bg-white/5 text-[11px] text-neutral-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-[#C5FF35] shrink-0 mt-0.5" />
              <span>
                Verified settlement directly to organizer account. 100% of your support funds campus sound, production, and event culture.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="w-1/3 py-3 rounded-full border border-white/20 text-white font-mono text-xs hover:bg-white/10 transition-colors"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={isSubmitting}
                className="spicy-btn flex-1 py-3 bg-[#C5FF35] text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#b5f220] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#0C0D0E]" />
                    <span>Confirm ₦{currentGiftAmount.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="pt-3 text-center shrink-0">
          <p className="text-[10px] text-neutral-500 font-mono">
            Direct instant settlement to event organizer · 0% platform fee · Bachs.io verified
          </p>
        </div>
      </div>
    </div>
  );
}
