"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CampusEvent, AdditionalAttendee } from "@/types";
import { useToast } from "./Toast";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Calendar,
  MapPin,
  ShieldCheck,
  QrCode,
  Copy,
  Download,
  Users,
  Eye,
  Mail,
  User,
} from "lucide-react";

interface TicketModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketModal({ event, isOpen, onClose }: TicketModalProps) {
  const { showToast } = useToast();
  const { currentUser, rsvpEvent } = useAuth();
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [additionalAttendees, setAdditionalAttendees] = useState<AdditionalAttendee[]>([]);
  const [allowFriendsToSee, setAllowFriendsToSee] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketCode, setTicketCode] = useState("");

  // Pre-fill user information if logged in
  useEffect(() => {
    if (isOpen && currentUser) {
      if (!fullName) setFullName(currentUser.fullName);
      if (!email) setEmail(currentUser.email);
    }
  }, [isOpen, currentUser, fullName, email]);

  // Adjust companion fields when quantity changes
  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    const needed = Math.max(0, newQty - 1);
    setAdditionalAttendees((prev) => {
      const next = [...prev];
      if (next.length < needed) {
        while (next.length < needed) {
          next.push({ fullName: "", email: "" });
        }
      } else if (next.length > needed) {
        next.splice(needed);
      }
      return next;
    });
  };

  const updateCompanion = (index: number, field: "fullName" | "email", value: string) => {
    setAdditionalAttendees((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleClose = React.useCallback(() => {
    setIsSuccess(false);
    setSelectedTierId(null);
    setQuantity(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setMatricNumber("");
    setAdditionalAttendees([]);
    setAllowFriendsToSee(true);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !event) return null;

  const activeTier =
    event.ticketTiers.find((t) => t.id === selectedTierId) ||
    event.ticketTiers[0];
  const unitPrice = activeTier ? activeTier.price : 0;
  const subtotal = unitPrice * quantity;
  const fee = 0; // PartyPadi student platform fee is 0
  const total = subtotal + fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      showToast({
        type: "error",
        title: "Required Fields Missing",
        message: "Please enter your full name and student email.",
      });
      return;
    }

    if (quantity >= 2) {
      for (let i = 0; i < quantity - 1; i++) {
        const attendee = additionalAttendees[i];
        if (!attendee?.email?.trim()) {
          showToast({
            type: "error",
            title: `Attendee ${i + 2} Email Required`,
            message: `Please enter the email address for Attendee ${i + 2} (companion ticket).`,
          });
          return;
        }
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedCode = `PP-OOU-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketCode(generatedCode);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Record RSVP in community auth context if signed in
      if (currentUser) {
        rsvpEvent(event.id, allowFriendsToSee, generatedCode);
      }

      showToast({
        type: "success",
        title: "Tickets Reserved Successfully",
        message:
          quantity >= 2
            ? `Your pass ${generatedCode} and companion passes have been issued!`
            : `Your digital pass ${generatedCode} is ready!`,
      });
    }, 800);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(ticketCode);
    showToast({
      type: "info",
      title: "Ticket Code Copied",
      message: `${ticketCode} copied to clipboard.`,
    });
  };

  const downloadPass = () => {
    showToast({
      type: "success",
      title: "Digital Pass Saved",
      message: "Pass saved to your device. Check your email for WhatsApp delivery.",
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl shadow-2xl my-8 overflow-hidden text-[#11120F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#11120F] text-[#F5F5F0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
            <span className="text-[11px] font-mono tracking-widest uppercase font-semibold">
              {isSuccess ? "DIGITAL CAMPUS PASS // VERIFIED" : "PARTYPADI SECURE BOOKING"}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-800"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View: The Authentic Digital Campus Pass */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-[#C5FF35] text-[#11120F] font-bold rounded-full shadow-xs">
                CONFIRMED & READY
              </span>
              <h3 className="text-2xl font-display font-black tracking-tight text-[#11120F]">
                You&apos;re On The Guestlist!
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Present this QR pass at the entrance gate. Instant scanner validation — no paper required.
              </p>
            </div>

            {/* Swiss Digital Ticket Card */}
            <div className="bg-neutral-50/70 border border-neutral-300 rounded-2xl p-6 relative shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                      EVENT PASS // {event.campus}
                    </span>
                    <h4 className="text-lg font-display font-bold leading-tight mt-0.5 text-[#11120F]">
                      {event.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-dashed border-neutral-200">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">DATE & TIME</span>
                      <span className="font-medium text-[#11120F]">{event.shortDate} · {event.time}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">VENUE</span>
                      <span className="font-medium text-[#11120F] truncate block">{event.venue}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">PRIMARY HOLDER</span>
                      <span className="font-medium text-[#11120F]">{fullName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">TIER & QTY</span>
                      <span className="font-medium text-[#11120F]">{activeTier?.name} (x{quantity})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="font-mono text-xs font-bold bg-[#11120F] text-[#C5FF35] px-2.5 py-1 rounded-full">
                      CODE: {ticketCode}
                    </span>
                    <button
                      onClick={copyCode}
                      className="p-1.5 text-neutral-400 hover:text-[#11120F] rounded-full hover:bg-neutral-200/60 transition-colors"
                      title="Copy Ticket Code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* QR Code Simulation */}
                <div className="flex flex-col items-center justify-center p-3 bg-white border border-neutral-200 rounded-xl text-center shadow-xs">
                  <div className="w-28 h-28 bg-[#11120F] rounded-xl p-2.5 flex items-center justify-center relative shadow-sm">
                    <QrCode className="w-full h-full text-[#C5FF35]" />
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 mt-2 tracking-widest uppercase">
                    SCAN AT ENTRANCE
                  </span>
                </div>
              </div>

              {/* Companion Passes List (if quantity >= 2) */}
              {additionalAttendees.length > 0 && (
                <div className="mt-4 pt-3 border-t border-dashed border-neutral-300 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#11120F] uppercase">
                      COMPANION PASSES ISSUED ({additionalAttendees.length}):
                    </span>
                    <span className="text-neutral-500 text-[10px]">Delivered to companion emails</span>
                  </div>
                  <div className="space-y-1.5">
                    {additionalAttendees.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200 text-xs font-mono"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-neutral-400">#{idx + 2}</span>
                          <span className="font-medium text-[#11120F] truncate">
                            {att.fullName ? `${att.fullName} (${att.email})` : att.email}
                          </span>
                        </div>
                        <span className="font-bold text-[#11120F] bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                          {ticketCode}-0{idx + 2}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={downloadPass}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#11120F] text-white hover:bg-neutral-800 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#C5FF35]" />
                Download Ticket Pass
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-6 border border-neutral-300 text-[#11120F] hover:bg-neutral-100 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Booking View */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Event Header Snippet */}
            <div className="flex gap-4 pb-5 border-b border-neutral-200">
              <div className="relative w-20 h-20 bg-[#11120F] shrink-0 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                    {event.categoryLabel}
                  </span>
                  {event.statusBadge && (
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#C5FF35] text-[#11120F] font-bold rounded-full">
                      {event.statusBadge}
                    </span>
                  )}
                </div>
                <h3
                  id="ticket-modal-title"
                  className="text-lg font-display font-bold text-[#11120F] leading-snug truncate"
                >
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#11120F]" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#11120F]" />
                    {event.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Select Tier */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#11120F] font-semibold">
                  01. Select Ticket Tier
                </label>
                <span className="text-[11px] font-mono text-neutral-400">
                  {event.ticketTiers.length} Options Available
                </span>
              </div>

              <div className="space-y-2">
                {event.ticketTiers.map((tier) => {
                  const isSelected = activeTier?.id === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-[#11120F] bg-neutral-50 ring-2 ring-[#11120F] shadow-xs"
                          : "border-neutral-200 bg-white hover:bg-neutral-50/50"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-[#11120F]">
                            {tier.name}
                          </span>
                          {tier.badge && (
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#C5FF35] text-[#11120F] font-semibold rounded-full">
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">{tier.description}</p>
                      </div>

                      <div className="text-right shrink-0 ml-4">
                        <span className="font-mono text-base font-bold text-[#11120F]">
                          {tier.price === 0 ? "FREE" : `₦${tier.price.toLocaleString()}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2 pb-3 border-b border-neutral-200">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#11120F] font-semibold block">
                  02. Ticket Quantity
                </label>
                <span className="text-[11px] text-neutral-500">Max 5 tickets per order</span>
              </div>
              <div className="flex items-center border border-neutral-300 rounded-full bg-neutral-50 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-sm font-mono hover:bg-neutral-200 disabled:opacity-30 transition-colors"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-mono text-sm font-bold min-w-8 text-center text-[#11120F]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(Math.min(5, quantity + 1))}
                  className="px-3.5 py-1.5 text-sm font-mono hover:bg-neutral-200 disabled:opacity-30 transition-colors"
                  disabled={quantity >= 5}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Step 2: Attendee Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#11120F] font-semibold block">
                  03. Attendee Details
                </label>
                {currentUser && (
                  <span className="text-[10px] font-mono text-[#11120F] bg-neutral-100 px-2.5 py-0.5 rounded-full">
                    Signed in as @{currentUser.username}
                  </span>
                )}
              </div>

              {/* Attendee 1 (Primary Holder) */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase text-neutral-500 font-bold block">
                  Attendee 01 (Primary Pass Holder)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Babatunde Adeyemi"
                      className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-[#11120F] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                      Student Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@oouagoiwoye.edu.ng"
                      className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-[#11120F] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0801 234 5678"
                      className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-[#11120F] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                      Department / Matric No. (Optional)
                    </label>
                    <input
                      type="text"
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value)}
                      placeholder="e.g. CSC/2022/104"
                      className="w-full px-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-[#11120F] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Companion Attendees (Required email for Attendee 2 and up) */}
              {quantity >= 2 && (
                <div className="pt-4 border-t border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#11120F]" />
                      <span className="text-[11px] font-mono uppercase font-bold text-[#11120F]">
                        Companion Pass Details (Ticket 2 {quantity > 2 ? `to ${quantity}` : ""})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#C5FF35] text-[#11120F] px-2 py-0.5 rounded-full font-bold">
                      {quantity - 1} Companion Pass{quantity > 2 ? "es" : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Enter the email address for your companion so their personalized digital pass is sent to them.
                  </p>

                  <div className="space-y-3">
                    {Array.from({ length: quantity - 1 }).map((_, idx) => {
                      const attendeeNum = idx + 2;
                      const currentComp = additionalAttendees[idx] || { fullName: "", email: "" };
                      return (
                        <div
                          key={idx}
                          className="p-3.5 bg-neutral-50/80 border border-neutral-200 rounded-2xl space-y-2.5"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#11120F]">
                            <span>
                              Attendee {attendeeNum} {attendeeNum === 2 ? "(Second Person)" : ""}
                            </span>
                            <span className="text-[10px] font-normal text-neutral-400">
                              Pass #{attendeeNum}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                                Attendee {attendeeNum} Email *
                              </label>
                              <input
                                type="email"
                                required
                                value={currentComp.email}
                                onChange={(e) => updateCompanion(idx, "email", e.target.value)}
                                placeholder="companion@student.oouagoiwoye.edu.ng"
                                className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:border-[#11120F] focus:outline-none transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                                Attendee {attendeeNum} Full Name (Optional)
                              </label>
                              <input
                                type="text"
                                value={currentComp.fullName || ""}
                                onChange={(e) => updateCompanion(idx, "fullName", e.target.value)}
                                placeholder="e.g. Fola Coker"
                                className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:border-[#11120F] focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Social Friend Radar Privacy Toggle */}
              <div className="p-3.5 bg-neutral-50/80 border border-neutral-200 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="allowFriendsToSeeToggle"
                  checked={allowFriendsToSee}
                  onChange={(e) => setAllowFriendsToSee(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-black focus:ring-black accent-[#11120F] cursor-pointer"
                />
                <label
                  htmlFor="allowFriendsToSeeToggle"
                  className="text-xs text-[#11120F] cursor-pointer select-none space-y-0.5"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#11120F]" />
                    <span>Allow friends to see that I&apos;m going to this event</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 block leading-tight">
                    When checked, your connected PartyPadi campus friends can see you on their event radar. You can change this anytime in your profile.
                  </span>
                </label>
              </div>
            </div>

            {/* Total Breakdown */}
            <div className="p-4 bg-neutral-50/70 border border-neutral-200 rounded-2xl space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>
                  Ticket Price ({quantity}x {activeTier?.name})
                </span>
                <span className="font-mono">
                  {subtotal === 0 ? "FREE" : `₦${subtotal.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <span>Student Ticketing Fee</span>
                  <span className="text-[9px] font-mono bg-[#C5FF35] px-2 py-0.5 text-[#11120F] font-bold rounded-full">
                    WAIVED
                  </span>
                </span>
                <span className="font-mono">₦0</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold text-sm text-[#11120F]">
                <span className="font-display">Total to Pay</span>
                <span className="font-mono text-lg text-[#11120F]">
                  {total === 0 ? "₦0 (FREE)" : `₦${total.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-[#11120F] shrink-0" />
              <span>
                Verified campus organizer · Direct digital QR pass delivered instantly.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#11120F] text-white hover:bg-neutral-800 disabled:opacity-50 text-xs font-mono font-medium uppercase tracking-wider rounded-full transition-all shadow-md hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <span>Generating Digital Pass...</span>
              ) : (
                <>
                  <span>
                    {total === 0
                      ? "Get Free Campus Pass"
                      : `Confirm & Pay ₦${total.toLocaleString()}`}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
