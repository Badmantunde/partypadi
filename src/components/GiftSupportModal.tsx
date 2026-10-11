"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Heart, Sparkles, Award, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useAuth, GIFTER_LEVEL_INFO, getGifterLevel } from "@/context/AuthContext";
import { useToast } from "./Toast";
import { GifterLevel } from "@/types";

interface GiftSupportModalProps {
  eventId: string;
  eventTitle: string;
  organizerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [
  { amount: 1000, label: "₦1,000", level: 1 as GifterLevel },
  { amount: 5000, label: "₦5,000", level: 2 as GifterLevel },
  { amount: 15000, label: "₦15,000", level: 3 as GifterLevel },
  { amount: 35000, label: "₦35,000", level: 4 as GifterLevel },
  { amount: 75000, label: "₦75,000", level: 5 as GifterLevel },
  { amount: 150000, label: "₦150,000", level: 6 as GifterLevel },
];

export function GiftSupportModal({
  eventId,
  eventTitle,
  organizerName,
  isOpen,
  onClose,
}: GiftSupportModalProps) {
  const { currentUser, sendGiftToEvent, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [guestName, setGuestName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentGiftAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const unlockedLevel = getGifterLevel(currentGiftAmount);
  const levelInfo = GIFTER_LEVEL_INFO[unlockedLevel];

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setIsCustom(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentGiftAmount < 500) {
      showToast({
        type: "error",
        title: "Minimum Support",
        message: "Minimum gift amount is ₦500.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = sendGiftToEvent({
        eventId,
        amount: currentGiftAmount,
        message: message.trim() || undefined,
        isPublic,
        customName: !currentUser && guestName.trim() ? guestName.trim() : undefined,
      });

      if (res.success) {
        const badge = GIFTER_LEVEL_INFO[res.newGifterLevel];
        showToast({
          type: "success",
          title: `Gift Sent! ${badge.icon}`,
          message: `You earned the ${badge.badge} badge (${badge.name})! Thank you for supporting ${organizerName}.`,
        });
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0C0D0E] border border-white/10 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

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
            <span>GIFT & COMMUNITY SUPPORT</span>
          </div>
          <h3 className="font-display font-medium text-xl sm:text-2xl text-white">
            Support {organizerName}
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto truncate">
            Back the organizers for <strong className="text-white">{eventTitle}</strong>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 pr-0.5">
          {/* Preset Chips */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
              SELECT GIFT AMOUNT
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = !isCustom && selectedAmount === preset.amount;
                return (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => handleSelectPreset(preset.amount)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-[#C5FF35] text-[#0C0D0E] border-[#C5FF35] font-bold shadow-md"
                        : "bg-white/5 border-white/10 text-white hover:border-white/20"
                    }`}
                  >
                    <span className="font-mono text-xs block">{preset.label}</span>
                    <span
                      className={`text-[9px] block ${
                        isSelected ? "text-[#0C0D0E]/80" : "text-neutral-400"
                      }`}
                    >
                      L{preset.level} {GIFTER_LEVEL_INFO[preset.level].icon}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount */}
            <div className="pt-1">
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
                  placeholder="Or enter custom amount (e.g. 15000)"
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-white/5 border rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none font-mono ${
                    isCustom ? "border-[#C5FF35]" : "border-white/10"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Gifter Level Unlock Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/15 relative shrink-0">
                  <Image
                    src={levelInfo.imageUrl}
                    alt={levelInfo.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <span className="font-display font-bold text-xs sm:text-sm text-white block">
                    {levelInfo.badge}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {levelInfo.name} Status · {levelInfo.icon}
                  </span>
                </div>
              </div>
              <span className="font-mono text-xs sm:text-sm text-[#C5FF35] font-bold">
                ₦{currentGiftAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-tight">
              {levelInfo.description}. Displays on your profile and event supporter feed!
            </p>
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
                placeholder="e.g. Campus Baller or Tade A."
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
              />
            </div>
          )}

          {/* Shoutout Message */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              CHEER NOTE / MESSAGE (OPTIONAL)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Massive shoutout to the DJ crew! Keep the energy electric ⚡"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] resize-none"
            />
          </div>

          {/* Public / Anonymous Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="space-y-0.5">
              <span className="text-xs text-white block font-medium">Show on Supporter Wall</span>
              <span className="text-[10px] text-neutral-400 block">
                Feature your badge and note in public event telemetry
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isPublic ? "bg-[#C5FF35]" : "bg-white/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0C0D0E] transition-transform ${
                  isPublic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || currentGiftAmount < 500}
            className="spicy-btn w-full py-3 bg-[#C5FF35] text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#b5f220] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Heart className="w-4 h-4 fill-[#0C0D0E]" />
            <span>
              {isSubmitting
                ? "Processing Support..."
                : `Send ₦${currentGiftAmount.toLocaleString()} Support`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-3 text-center shrink-0">
          <p className="text-[10px] text-neutral-500 font-mono">
            Direct instant settlement to event organizer · 0% platform fee
          </p>
        </div>
      </div>
    </div>
  );
}
