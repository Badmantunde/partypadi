"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PartyPadiLogo } from "./PartyPadiLogo";
import { Menu, X, User, LogOut, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
  const {
    currentUser,
    openAuthModal,
    openProfileModal,
    openCircleModal,
    logout,
  } = useAuth();

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
    { label: "How It Works", href: "/how-it-works" },
    { label: "Organizers", href: "/organizers" },
    { label: "About", href: "/about" },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 flex-nowrap gap-3">
            {/* Left: Star Mark & PartyPadi Wordmark */}
            <div className="flex items-center gap-3.5 shrink-0">
              <Link
                href="/"
                className="outline-none focus-visible:ring-1 focus-visible:ring-white flex items-center gap-2 group transition-transform hover:scale-[1.02] shrink-0"
              >
                <PartyPadiLogo theme="dark" size="md" />
              </Link>

              <div className="hidden 2xl:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider uppercase text-white/80 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] animate-pulse shrink-0" />
                <span className="whitespace-nowrap">OOU · AGO-IWOYE</span>
              </div>
            </div>

            {/* Center: Floating Dark Capsule Navigation (Visible on xl and above) */}
            <nav
              className="hidden xl:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-md shadow-inner shrink-0"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const active = checkIsActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 text-xs font-mono rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
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

            {/* Right: Action Buttons on Desktop (Visible on xl and above) */}
            <div className="hidden xl:flex items-center gap-2.5 shrink-0">
              {/* Host an Event button */}
              <Link
                href="/host"
                className={`text-xs font-mono px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  checkIsActive("/host")
                    ? "bg-[#C5FF35] text-[#0C0D0E] font-bold shadow-[0_0_15px_rgba(197,255,53,0.3)]"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="whitespace-nowrap">Host an Event</span>
                <span className="text-[9px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded font-mono font-semibold whitespace-nowrap">0% Fee</span>
              </Link>

              {/* Account / Auth Button */}
              {currentUser ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={openProfileModal}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all group shadow-xs whitespace-nowrap shrink-0"
                    title="View Profile, Friends & Circles"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#C5FF35] text-[#0C0D0E] font-display font-black text-[11px] flex items-center justify-center shrink-0">
                      {currentUser.fullName.charAt(0)}
                    </span>
                    <span className="font-mono font-bold text-[#C5FF35] whitespace-nowrap">@{currentUser.username}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="text-xs font-mono text-white/90 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
              )}

              <Link
                href="/events"
                className="spicy-btn inline-flex items-center gap-2 px-4 py-2 bg-white text-[#0C0D0E] hover:bg-[#F5F5F0] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-full text-xs font-mono font-medium tracking-tight transition-all duration-300 group whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">Explore Events</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] transition-transform group-hover:scale-125 shrink-0" />
              </Link>
            </div>

            {/* Mobile / Tablet Header Controls (Visible under xl) */}
            <div className="flex xl:hidden items-center gap-2 shrink-0">
              {currentUser ? (
                <button
                  onClick={openProfileModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-[#C5FF35] font-bold whitespace-nowrap shrink-0"
                >
                  <span className="w-4 h-4 rounded-full bg-[#C5FF35] text-black text-[10px] flex items-center justify-center font-bold shrink-0">
                    {currentUser.fullName.charAt(0)}
                  </span>
                  <span className="whitespace-nowrap">@{currentUser.username}</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal("signin")}
                  className="px-3 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-mono font-medium whitespace-nowrap shrink-0"
                >
                  Sign In
                </button>
              )}

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
            {/* Campus Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[11px] font-mono tracking-wider uppercase text-white/90 rounded-full w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
              <span>OOU · AGO-IWOYE (LAUNCH CAMPUS)</span>
            </div>

            {/* User Profile Card in Mobile Menu */}
            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#C5FF35] text-[#0C0D0E] font-bold text-xs flex items-center justify-center">
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-white block">
                        @{currentUser.username}
                      </span>
                      <span className="text-[10px] text-neutral-400 capitalize">
                        {currentUser.role} · {currentUser.friends.length} Friends
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-neutral-400 hover:text-red-400 text-xs p-1"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openProfileModal();
                    }}
                    className="py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white font-medium text-center"
                  >
                    Profile & Passes
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openCircleModal();
                    }}
                    className="py-2 bg-[#C5FF35] text-[#0C0D0E] rounded-xl font-bold text-center"
                  >
                    + New Circle
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("signin");
                  }}
                  className="py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5 text-center font-bold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("signup");
                  }}
                  className="py-2.5 rounded-xl bg-[#C5FF35] text-[#0C0D0E] text-center font-bold"
                >
                  Join PartyPadi
                </button>
              </div>
            )}

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
                href="/host"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full py-3 text-center text-xs font-mono uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 ${
                  checkIsActive("/host")
                    ? "bg-[#C5FF35] text-[#0C0D0E] font-bold shadow-md"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                <span>Host an Event (0% Commission)</span>
                {checkIsActive("/host") && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
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
