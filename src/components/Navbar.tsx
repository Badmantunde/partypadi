"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PartyPadiLogo } from "./PartyPadiLogo";
import { Menu, X, ArrowRight } from "lucide-react";
import { getAppUrl } from "@/lib/urls";
import { AuthModal } from "./AuthModal";
import { ProfileModal } from "./ProfileModal";
import { PartyCircleModal } from "./PartyCircleModal";

interface NavbarProps {
  onOpenHostModal?: () => void;
}

export function Navbar({ onOpenHostModal }: NavbarProps = {}) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Discover", href: "/events" },
    { label: "Padi Circles", href: "/circles" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Organizers", href: "/organizers" },
    { label: "How It Works", href: "/how-it-works" },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#0C0D0E]/95 border-b border-white/10 backdrop-blur-md shadow-lg"
            : "bg-[#0C0D0E] border-b border-white/5"
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Desktop Layout (xl and above): Fluid 3-Section Flex that Prevents Overlaps */}
          <div className="hidden xl:flex items-center justify-between h-20 w-full gap-4 xl:gap-6 2xl:gap-8">
            {/* Left: Star Mark & PartyPadi Wordmark */}
            <div className="flex items-center shrink-0 min-w-0">
              <Link
                href="/"
                className="outline-none focus-visible:ring-1 focus-visible:ring-white flex items-center gap-2 group transition-transform hover:scale-[1.02] shrink-0"
              >
                <PartyPadiLogo theme="dark" size="md" />
              </Link>
            </div>

            {/* Center: Floating Dark Capsule Navigation (Centered in free space) */}
            <nav
              className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md shadow-inner shrink-0 mx-auto"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const active = checkIsActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative px-3 2xl:px-3.5 py-1.5 text-xs font-mono rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-white/15 text-white font-bold border border-white/25 shadow-xs"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] shadow-[0_0_8px_#C5FF35] shrink-0" />
                    )}
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Action Buttons on Desktop (Right-aligned, never overlaps center or logo) */}
            <div className="flex items-center justify-end gap-2 2xl:gap-2.5 shrink-0">
              {/* Host an Event button */}
              <Link
                href={getAppUrl("/onboarding", { role: "organizer" })}
                className="text-xs font-mono px-3 2xl:px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-white/80 hover:text-white hover:bg-white/5"
              >
                <span className="whitespace-nowrap">Host an Event</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap transition-colors bg-[#C5FF35]/20 text-[#C5FF35] border border-[#C5FF35]/30">
                  0% Fee
                </span>
              </Link>

              {/* Sign In */}
              <Link
                href={getAppUrl("/onboarding", { mode: "signin" })}
                className="text-xs font-mono text-white/90 hover:text-white px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>

              {/* Launch App */}
              <Link
                href={getAppUrl("/onboarding")}
                className="spicy-btn inline-flex items-center gap-1.5 px-4 py-2 bg-[#C5FF35] text-black hover:bg-[#D7F23A] rounded-full text-xs font-mono font-bold tracking-tight transition-all shadow-md whitespace-nowrap shrink-0"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mobile / Tablet Header Controls (Visible under xl) */}
          <div className="flex xl:hidden items-center justify-between h-16 sm:h-20 w-full flex-nowrap">
            <Link
              href="/"
              className="outline-none focus-visible:ring-1 focus-visible:ring-white flex items-center gap-2 group transition-transform hover:scale-[1.02] shrink-0"
            >
              <PartyPadiLogo theme="dark" size="md" />
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href={getAppUrl("/onboarding", { mode: "signin" })}
                className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-mono font-medium whitespace-nowrap shrink-0"
              >
                Sign In
              </Link>

              <Link
                href={getAppUrl("/onboarding")}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#C5FF35] text-black text-[11px] font-mono font-bold rounded-full whitespace-nowrap shrink-0"
              >
                <span>Launch App</span>
                <span className="w-1 h-1 rounded-full bg-black" />
              </Link>

              <Link
                href="/events"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-white text-black text-[11px] font-mono font-bold rounded-full whitespace-nowrap shrink-0"
              >
                <span>Explore</span>
                <span className="w-1 h-1 rounded-full bg-[#C5FF35]" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-full border border-white/10 transition-colors shrink-0"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Visible on screens < xl when toggled) */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-b border-white/10 bg-[#0C0D0E]/98 backdrop-blur-xl px-5 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">

            {/* Action Buttons in Mobile Menu */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
              <Link
                href={getAppUrl("/onboarding", { mode: "signin" })}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5 text-center font-bold"
              >
                Sign In
              </Link>
              <Link
                href={getAppUrl("/onboarding", { mode: "signup" })}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl bg-[#C5FF35] text-black text-center font-bold"
              >
                Launch App
              </Link>
            </div>

            <nav className="flex flex-col space-y-1 pt-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const active = checkIsActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-3 px-3.5 text-sm font-display rounded-xl border flex items-center justify-between transition-colors ${
                      active
                        ? "bg-white/15 text-[#C5FF35] font-bold border-[#C5FF35]/30 shadow-xs"
                        : "text-white/90 hover:bg-white/5 border-white/5 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {active ? (
                        <span className="w-2 h-2 rounded-full bg-[#C5FF35] shadow-[0_0_8px_#C5FF35]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                      <span>{link.label}</span>
                    </div>
                    <span className="text-xs font-mono text-white/50">{active ? "ACTIVE" : "→"}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href={getAppUrl("/onboarding", { role: "organizer" })}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-mono uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/5"
              >
                <span>Host an Event (0% Commission)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              </Link>
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="spicy-btn w-full py-3 text-center text-xs font-mono uppercase tracking-wider bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Explore All Events</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Community Modals mounted across all pages */}
      <AuthModal />
      <ProfileModal />
      <PartyCircleModal />
    </>
  );
}
