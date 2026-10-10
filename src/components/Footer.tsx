"use client";

import React from "react";
import Link from "next/link";
import { PartyPadiLogo } from "./PartyPadiLogo";

interface FooterProps {
  onOpenHostModal?: () => void;
}

export function Footer({ onOpenHostModal }: FooterProps = {}) {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-[#0C0D0E] text-[#F5F5F0] border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12 sm:space-y-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Col (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <PartyPadiLogo theme="dark" size="lg" showTagline />
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              The campus-first event discovery and ticketing platform. Connecting university students to authentic experiences, parties, concerts, and departmental dinners.
            </p>
            <div className="pt-2 text-[11px] font-mono text-neutral-400">
              INITIAL LAUNCH: <span className="text-[#C5FF35]">OOU AGO-IWOYE</span>
            </div>
          </div>

            {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold block">
              DISCOVER
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/events?category=parties" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Parties & Club Nights
                </Link>
              </li>
              <li>
                <Link href="/events?category=concerts" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Campus Concerts
                </Link>
              </li>
              <li>
                <Link href="/events?category=galas" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Department Galas
                </Link>
              </li>
              <li>
                <Link href="/#padi-circle" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Padi Circle Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizers (Col 7-8) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold block">
              FOR ORGANIZERS
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                {onOpenHostModal ? (
                  <button
                    type="button"
                    onClick={onOpenHostModal}
                    className="text-neutral-300 hover:text-[#C5FF35] transition-colors text-left"
                  >
                    Publish an Event Studio
                  </button>
                ) : (
                  <Link
                    href="/host"
                    className="text-neutral-300 hover:text-[#C5FF35] transition-colors"
                  >
                    Publish an Event Studio
                  </Link>
                )}
              </li>
              <li>
                <Link href="/how-it-works#scanner" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Gate Scanner App
                </Link>
              </li>
              <li>
                <Link href="/organizers#payouts" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Payouts & Banking
                </Link>
              </li>
              <li>
                <Link href="/organizers#faculty" className="text-neutral-300 hover:text-[#C5FF35] transition-colors">
                  Faculty Association Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Universities & Contact (Col 9-12) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold block">
              CAMPUSES & CONTACT
            </span>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center justify-between">
                <span>OOU (Ago-Iwoye)</span>
                <span className="text-[9px] font-mono bg-[#C5FF35] text-[#11120F] px-2 py-0.5 rounded-full font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>UNILAG (Akoka)</span>
                <span className="text-[9px] font-mono bg-neutral-800 px-2 py-0.5 rounded-full">NEXT</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>UI (Ibadan)</span>
                <span className="text-[9px] font-mono bg-neutral-800 px-2 py-0.5 rounded-full">SOON</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span>LASU (Ojo)</span>
                <span className="text-[9px] font-mono bg-neutral-800 px-2 py-0.5 rounded-full">SOON</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 space-y-1">
              <span className="text-[10px] font-mono text-neutral-400 block">CAMPUS AMBASSADORS</span>
              <a
                href="/about#ambassadors"
                className="text-xs text-[#C5FF35] hover:underline flex items-center gap-1 font-mono"
              >
                Learn more & apply ↗
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Swiss Grid Alignment & Legal */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {currentYear} PARTYPADI TICKETING INC.</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer transition-colors">
              PRIVACY POLICY
            </span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer transition-colors">
              TERMS OF SERVICE
            </span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer transition-colors">
              ORGANIZER AGREEMENT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
            <span>BUILT WITH SWISS PRECISION FOR CAMPUS CULTURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
