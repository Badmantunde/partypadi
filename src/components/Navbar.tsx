"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PartyPadiLogo } from "./PartyPadiLogo";
import { Menu, X, User, LogOut, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "./AuthModal";
import { ProfileModal } from "./ProfileModal";
import { PartyCircleModal } from "./PartyCircleModal";

interface NavbarProps {
  onOpenHostModal?: () => void;
}

export function Navbar({ onOpenHostModal }: NavbarProps = {}) {
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
    { label: "How It Works", href: "/how-it-works" },
    { label: "Organizers", href: "/organizers" },
    { label: "About", href: "/about" },
  ];

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
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Star Mark & PartyPadi Wordmark */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="outline-none focus-visible:ring-1 focus-visible:ring-white flex items-center gap-2 group transition-transform hover:scale-[1.02]"
              >
                <PartyPadiLogo theme="dark" size="md" />
              </Link>

              <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider uppercase text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] animate-pulse" />
                <span>OOU · AGO-IWOYE</span>
              </div>
            </div>

            {/* Center: Floating Dark Capsule Navigation */}
            <nav
              className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md shadow-inner"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-1.5 text-xs font-mono text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Action Buttons */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Host an Event button */}
              {onOpenHostModal ? (
                <button
                  type="button"
                  onClick={onOpenHostModal}
                  className="text-xs font-mono text-white/80 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-all"
                >
                  Host an Event
                </button>
              ) : (
                <Link
                  href="/host"
                  className="text-xs font-mono text-white/80 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-all"
                >
                  Host an Event
                </Link>
              )}

              {/* Account / Auth Button */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openProfileModal}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-white transition-all group shadow-xs"
                    title="View Profile, Friends & Circles"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#C5FF35] text-[#0C0D0E] font-display font-black text-[11px] flex items-center justify-center">
                      {currentUser.fullName.charAt(0)}
                    </span>
                    <span className="font-mono font-bold text-[#C5FF35]">@{currentUser.username}</span>
                    <span className="text-[10px] font-mono text-white/50 uppercase hidden xl:inline">
                      ({currentUser.role})
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="text-xs font-mono text-white/90 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  Sign In
                </button>
              )}

              <Link
                href="/events"
                className="spicy-btn inline-flex items-center gap-2 px-4 py-2 bg-white text-[#0C0D0E] hover:bg-[#F5F5F0] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-full text-xs font-mono font-medium tracking-tight transition-all duration-300 group"
              >
                <span>Explore Events</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] transition-transform group-hover:scale-125" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              {currentUser ? (
                <button
                  onClick={openProfileModal}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-[#C5FF35] font-bold"
                >
                  <span className="w-4 h-4 rounded-full bg-[#C5FF35] text-black text-[10px] flex items-center justify-center font-bold">
                    {currentUser.fullName.charAt(0)}
                  </span>
                  <span>@{currentUser.username}</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal("signin")}
                  className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-mono font-medium"
                >
                  Sign In
                </button>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:bg-white/10 rounded-full border border-white/10 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-white/10 bg-[#0C0D0E]/98 backdrop-blur-xl px-5 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
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

            <nav className="flex flex-col space-y-1.5 pt-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-3.5 text-sm font-display font-medium text-white/90 hover:bg-white/5 rounded-xl border-b border-white/5 flex items-center justify-between transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-white/40">→</span>
                </Link>
              ))}
            </nav>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/host"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-mono uppercase tracking-wider border border-white/20 text-white rounded-full hover:bg-white/5 transition-all"
              >
                Host an Event (0% Commission)
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
