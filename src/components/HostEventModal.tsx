"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "./Toast";
import { X, Check, ArrowRight } from "lucide-react";
import { EventCategory } from "@/types";

interface HostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HostEventModal({ isOpen, onClose }: HostEventModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("parties");
  const [campus, setCampus] = useState("Main Campus");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState("200 - 500 attendees");
  const [ticketPriceType, setTicketPriceType] = useState<"paid" | "free" | "tiered">("paid");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerRole, setOrganizerRole] = useState("Campus Event Promoter");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [organizerPhone, setOrganizerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [organizerCode, setOrganizerCode] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organizerName.trim() || !organizerEmail.trim()) {
      showToast({
        type: "error",
        title: "Required Fields Missing",
        message: "Please fill in the event title, your name, and contact email.",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = `HOST-PP-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrganizerCode(code);
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast({
        type: "success",
        title: "Event Submitted for Review",
        message: `Your organizer portal ID is ${code}. Our campus team will activate your ticketing within 2 hours.`,
      });
    }, 700);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setTitle("");
    setVenue("");
    setDate("");
    setTime("");
    setOrganizerName("");
    setOrganizerEmail("");
    setOrganizerPhone("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="host-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-[#0E0F0C] border border-neutral-800 text-[#F5F5F0] rounded-3xl shadow-2xl my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141513] border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300 font-semibold">
              ORGANIZER ONBOARDING // TICKET PUBLISHER
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-800"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 bg-[#141513] border border-[#C5FF35] rounded-2xl mx-auto flex items-center justify-center shadow-sm">
              <Check className="w-7 h-7 text-[#C5FF35] stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-[#C5FF35] text-[#11120F] font-bold rounded-full shadow-xs">
                SUBMISSION RECEIVED
              </span>
              <h3 className="text-2xl font-display font-bold text-white tracking-tight">
                Your Event is Under Review
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                We verify all campus events to protect student attendees and maintain our 100% verified organizer standard.
              </p>
            </div>

            <div className="p-5 bg-[#141513] border border-neutral-800 rounded-2xl text-left max-w-md mx-auto space-y-2.5 shadow-sm">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-mono">REFERENCE:</span>
                <span className="font-mono text-[#C5FF35] font-bold">{organizerCode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-mono">EVENT:</span>
                <span className="text-white font-medium">{title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-mono">CAMPUS:</span>
                <span className="text-white font-medium">{campus}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400 font-mono">ORGANIZER:</span>
                <span className="text-white font-medium">{organizerName} ({organizerRole})</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 max-w-sm mx-auto">
              Our campus ambassador will reach out via WhatsApp at <span className="text-white font-mono">{organizerPhone || organizerEmail}</span> with your Gate Scanner App login.
            </p>

            <button
              onClick={resetForm}
              className="py-3 px-8 bg-[#C5FF35] text-[#11120F] hover:bg-[#b0eb26] rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:scale-[1.02]"
            >
              Back to PartyPadi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3
                id="host-modal-title"
                className="text-2xl font-display font-bold text-white tracking-tight"
              >
                Host an Event on PartyPadi
              </h3>
              <p className="text-xs text-neutral-400">
                Reach university students across faculties. Instant payouts, real-time ticket scanning, and zero fraudulent passes.
              </p>
            </div>

            {/* Event Details */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-[#C5FF35] block font-semibold">
                01. Event Overview
              </label>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Neon Nights Campus Rave, Black & Gold Gala"
                    className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Event Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                    >
                      <option value="parties">Parties & Club Nights</option>
                      <option value="concerts">Concerts & Live Sets</option>
                      <option value="dinners">Dinners & Galas</option>
                      <option value="department-week">Department Week Celebration</option>
                      <option value="cultural">Cultural Events</option>
                      <option value="networking">Networking & Tech</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Campus
                    </label>
                    <select
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                    >
                      <option value="Main Campus">Main Campus / General</option>
                      <option value="UNILAG · Akoka">UNILAG · Akoka</option>
                      <option value="OOU · Ago-Iwoye">OOU · Ago-Iwoye</option>
                      <option value="UI · Ibadan">UI · Ibadan</option>
                      <option value="LASU · Ojo">LASU · Ojo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Proposed Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 19:00 WAT"
                      className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Venue / Hall
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. Club Vegas, Campus Amphitheatre, Grand Hall"
                      className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Expected Attendance
                    </label>
                    <select
                      value={expectedAttendance}
                      onChange={(e) => setExpectedAttendance(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                    >
                      <option value="50 - 150 attendees">50 - 150 attendees</option>
                      <option value="200 - 500 attendees">200 - 500 attendees</option>
                      <option value="500 - 1,000 attendees">500 - 1,000 attendees</option>
                      <option value="1,000+ campus festival">1,000+ campus festival</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                      Ticket Pricing Structure
                    </label>
                    <select
                      value={ticketPriceType}
                      onChange={(e) => setTicketPriceType(e.target.value as "paid" | "free" | "tiered")}
                      className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                    >
                      <option value="paid">Fixed Single Paid Ticket</option>
                      <option value="tiered">Multi-Tier (Early Bird / Regular / VIP)</option>
                      <option value="free">Free Student RSVP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Contact */}
            <div className="space-y-3 pt-3 border-t border-neutral-800">
              <label className="text-xs font-mono uppercase tracking-wider text-[#C5FF35] block font-semibold">
                02. Organizer Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Organizer / Association Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="e.g. Vibe Collective, Campus Social Committee"
                    className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={organizerRole}
                    onChange={(e) => setOrganizerRole(e.target.value)}
                    placeholder="e.g. Social Director / Lead Promoter"
                    className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    placeholder="organizer@gmail.com"
                    className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    placeholder="0803 123 4567"
                    className="w-full px-4 py-2.5 text-xs bg-[#141513] border border-neutral-800 rounded-xl text-white focus:border-[#C5FF35] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payout Notice */}
            <div className="p-3.5 bg-[#141513] border border-neutral-800 rounded-2xl flex items-center gap-3 text-xs text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-[#C5FF35] shrink-0" />
              <span>
                Same-day automated payout to any Nigerian bank. Free gate scanner app provided upon listing approval.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#C5FF35] text-[#11120F] hover:bg-[#b5f422] disabled:opacity-50 text-xs font-mono font-bold uppercase tracking-wider rounded-full transition-all shadow-md hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <span>Submitting for Verification...</span>
              ) : (
                <>
                  <span>Submit Event for Campus Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
