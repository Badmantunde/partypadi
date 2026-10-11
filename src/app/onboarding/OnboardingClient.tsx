"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PartyPadiLogo } from "@/components/PartyPadiLogo";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { getPublicUrl } from "@/lib/urls";
import {
  Sparkles,
  Building2,
  Ticket,
  Users2,
  Gift,
  ShieldCheck,
  QrCode,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Lock,
  Mail,
  Compass,
  LogOut,
  ExternalLink,
} from "lucide-react";

type RoleOption = "partygoer" | "organizer";
type AuthMode = "signup" | "signin";

const CAMPUS_OPTIONS = [
  { id: "oou", name: "OOU Ago-Iwoye", label: "Olabisi Onabanjo University" },
  { id: "unilag", name: "UNILAG Akoka", label: "University of Lagos" },
  { id: "ui", name: "UI Ibadan", label: "University of Ibadan" },
  { id: "lasu", name: "LASU Ojo", label: "Lagos State University" },
];

export function OnboardingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { currentUser, login, signup, switchRole, logout } = useAuth();

  // Read initial role or mode from URL queries
  const initialRoleParam = searchParams.get("role") as RoleOption | null;
  const initialModeParam = searchParams.get("mode") as AuthMode | null;

  const [selectedRole, setSelectedRole] = useState<RoleOption>(
    initialRoleParam === "organizer" ? "organizer" : "partygoer"
  );
  const [step, setStep] = useState<"choose_role" | "auth_form">(
    initialRoleParam ? "auth_form" : "choose_role"
  );
  const [authMode, setAuthMode] = useState<AuthMode>(
    initialModeParam === "signin" ? "signin" : "signup"
  );

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState("OOU Ago-Iwoye");
  const [isLoading, setIsLoading] = useState(false);

  // If role param changes in URL
  useEffect(() => {
    if (initialRoleParam === "organizer" || initialRoleParam === "partygoer") {
      setSelectedRole(initialRoleParam);
      setStep("auth_form");
    }
  }, [initialRoleParam]);

  const handleSelectRole = (role: RoleOption) => {
    setSelectedRole(role);
    setStep("auth_form");
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast({
        type: "error",
        title: "Missing Fields",
        message: "Please enter your email and password to proceed.",
      });
      return;
    }

    if (authMode === "signup" && !fullName.trim()) {
      showToast({
        type: "error",
        title: "Full Name Required",
        message: "Please provide your full name or organizer brand name.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === "signup") {
        const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
        signup({
          fullName,
          username: username || `user_${Date.now().toString().slice(-4)}`,
          email,
          role: selectedRole,
          campus,
        });
        showToast({
          type: "success",
          title: "Account Created",
          message: `Welcome to Party Padi! Entering your ${
            selectedRole === "organizer" ? "Creator Studio" : "Partygoer Dashboard"
          }.`,
        });
      } else {
        login(email);
        switchRole(selectedRole);
        showToast({
          type: "success",
          title: "Welcome Back",
          message: `Logged in successfully as ${
            selectedRole === "organizer" ? "Organizer" : "Partygoer"
          }.`,
        });
      }

      // Redirect directly into the dedicated app portal
      if (selectedRole === "organizer") {
        router.push("/organizer");
      } else {
        router.push("/dashboard");
      }
    } catch {
      showToast({
        type: "error",
        title: "Authentication Failed",
        message: "Unable to sign in. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: RoleOption) => {
    setIsLoading(true);
    try {
      if (role === "organizer") {
        login("fassa_execs");
        switchRole("organizer");
        showToast({
          type: "success",
          title: "Organizer Studio Loaded",
          message: "Signed in as FASSA Social Committee (Verified Host).",
        });
        router.push("/organizer");
      } else {
        login("tade_vibes");
        switchRole("partygoer");
        showToast({
          type: "success",
          title: "Partygoer Dashboard Loaded",
          message: "Signed in as Tade (OOU Biochem '26).",
        });
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueExisting = () => {
    if (!currentUser) return;
    if (currentUser.role === "organizer") {
      router.push("/organizer");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D0E] text-white flex flex-col justify-between selection:bg-[#00D54B] selection:text-black">
      {/* Top App Header */}
      <header className="w-full border-b border-white/10 bg-[#0C0D0E]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={getPublicUrl("/")}
              className="flex items-center gap-2 transition-transform hover:scale-[1.02]"
              title="Return to Public Website"
            >
              <PartyPadiLogo theme="dark" size="sm" />
            </Link>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D54B] animate-pulse" />
              App Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={getPublicUrl("/")}
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* If user already has an active session */}
        {currentUser ? (
          <div className="max-w-lg mx-auto w-full p-6 sm:p-8 rounded-3xl bg-[#141517] border border-white/10 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-[#00D54B]" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-[#00D54B]/15 text-[#00D54B] border border-[#00D54B]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                ACTIVE SESSION FOUND
              </span>
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                Welcome back, {currentUser.fullName}
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Logged in as <strong className="text-white capitalize">{currentUser.role}</strong> ({currentUser.campus})
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleContinueExisting}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#00D54B] text-black font-mono text-xs font-bold hover:bg-[#D7F23A] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>
                  Enter {currentUser.role === "organizer" ? "Creator Studio" : "Partygoer Dashboard"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  switchRole(currentUser.role === "organizer" ? "partygoer" : "organizer");
                  showToast({
                    type: "info",
                    title: "Role Switched",
                    message: "Switched account perspective. Launching workspace...",
                  });
                }}
                className="w-full py-3 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-xs font-bold hover:bg-white/10 transition-all"
              >
                Switch to {currentUser.role === "organizer" ? "Partygoer View" : "Organizer Studio"}
              </button>

              <button
                onClick={() => {
                  logout();
                  showToast({
                    type: "info",
                    title: "Signed Out",
                    message: "Session cleared. You can now log into a different account.",
                  });
                }}
                className="w-full py-2.5 text-neutral-400 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign in with another account</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Step 1: Role Selection Cards */}
            {step === "choose_role" && (
              <div className="space-y-8">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#00D54B] font-semibold">
                    CAMPUS ONBOARDING
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                    How do you want to use Party Padi?
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Choose your primary role. You can switch between experiences anytime inside your workspace.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {/* Option 1: Partygoer */}
                  <div
                    onClick={() => handleSelectRole("partygoer")}
                    className="group relative p-6 sm:p-8 rounded-3xl bg-[#141517] border border-white/10 hover:border-[#00D54B] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 shadow-xl hover:shadow-[0_0_30px_rgba(0,213,75,0.15)] hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#00D54B]/10 border border-[#00D54B]/30 flex items-center justify-center text-[#00D54B]">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                          PARTYGOER
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h2 className="text-2xl font-display font-bold text-white group-hover:text-[#00D54B] transition-colors">
                          I&apos;m a Partygoer
                        </h2>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Discover campus parties, raves, and cultural events. Reserve digital ticket passes, make squad plans with Padi Circles, and support favorite hosts.
                        </p>
                      </div>

                      <div className="pt-2 space-y-2 text-xs font-mono text-neutral-300">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-3.5 h-3.5 text-[#00D54B] shrink-0" />
                          <span>Instant digital QR passes to phone</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users2 className="w-3.5 h-3.5 text-[#00D54B] shrink-0" />
                          <span>Padi Circles & squad coordination</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="w-3.5 h-3.5 text-[#00D54B] shrink-0" />
                          <span>Gifter badges & creator recognition</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold group-hover:bg-[#00D54B] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>Continue as Partygoer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Option 2: Event Organizer */}
                  <div
                    onClick={() => handleSelectRole("organizer")}
                    className="group relative p-6 sm:p-8 rounded-3xl bg-[#141517] border border-white/10 hover:border-[#D7F23A] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 shadow-xl hover:shadow-[0_0_30px_rgba(215,242,58,0.15)] hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#D7F23A]/10 border border-[#D7F23A]/30 flex items-center justify-center text-[#D7F23A]">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#D7F23A]/15 text-[#D7F23A] border border-[#D7F23A]/30">
                          0% LAUNCH FEE
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h2 className="text-2xl font-display font-bold text-white group-hover:text-[#D7F23A] transition-colors">
                          I&apos;m an Event Organizer
                        </h2>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Host campus raves, live concerts, and dinners. Sell out venues with 0% platform fee, scan passes in real time at the door, and track attendee telemetry.
                        </p>
                      </div>

                      <div className="pt-2 space-y-2 text-xs font-mono text-neutral-300">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#D7F23A] shrink-0" />
                          <span>0% Platform fee during campus beta</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <QrCode className="w-3.5 h-3.5 text-[#D7F23A] shrink-0" />
                          <span>Real-time door scanner & gate verify</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-[#D7F23A] shrink-0" />
                          <span>Live attendee telemetry & waitlist control</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold group-hover:bg-[#D7F23A] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>Continue as Organizer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instant Quick Demo Shortcuts */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-neutral-400">
                  <span>Fast Demo Shortcuts:</span>
                  <button
                    onClick={() => handleDemoLogin("partygoer")}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#00D54B] border border-white/10 transition-colors"
                  >
                    Demo Partygoer (Tade) →
                  </button>
                  <button
                    onClick={() => handleDemoLogin("organizer")}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#D7F23A] border border-white/10 transition-colors"
                  >
                    Demo Organizer (Sub-Zero) →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Auth Form */}
            {step === "auth_form" && (
              <div className="max-w-md mx-auto w-full space-y-6">
                {/* Back to Role Selector */}
                <button
                  type="button"
                  onClick={() => setStep("choose_role")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role ({selectedRole === "organizer" ? "Organizer" : "Partygoer"})</span>
                </button>

                <div className="p-6 sm:p-8 rounded-3xl bg-[#141517] border border-white/10 shadow-2xl space-y-6">
                  {/* Header Badge & Title */}
                  <div className="space-y-1.5 text-center">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        selectedRole === "organizer"
                          ? "bg-[#D7F23A]/15 text-[#D7F23A] border border-[#D7F23A]/30"
                          : "bg-[#00D54B]/15 text-[#00D54B] border border-[#00D54B]/30"
                      }`}
                    >
                      {selectedRole === "organizer" ? "ORGANIZER STUDIO" : "PARTYGOER PORTAL"}
                    </span>
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                      {authMode === "signup" ? "Create your account" : "Sign in to your account"}
                    </h2>
                    <p className="text-xs text-neutral-400">
                      {selectedRole === "organizer"
                        ? "Manage campus events, ticket tiers, and gate telemetry."
                        : "Discover vibes, grab passes, and make memories."}
                    </p>
                  </div>

                  {/* Mode Tabs (Sign Up vs Sign In) */}
                  <div className="flex rounded-full bg-white/5 p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className={`flex-1 py-1.5 text-xs font-mono rounded-full font-bold transition-all ${
                        authMode === "signup"
                          ? "bg-white text-black shadow-xs"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Create Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className={`flex-1 py-1.5 text-xs font-mono rounded-full font-bold transition-all ${
                        authMode === "signin"
                          ? "bg-white text-black shadow-xs"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Sign In
                    </button>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === "signup" && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-300">
                          {selectedRole === "organizer" ? "Organizer / Brand Name" : "Your Full Name"}
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder={
                              selectedRole === "organizer"
                                ? "e.g. Sub-Zero Events"
                                : "e.g. Tade Adeleke"
                            }
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00D54B] transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {authMode === "signup" && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-neutral-300">
                          Campus Location
                        </label>
                        <select
                          value={campus}
                          onChange={(e) => setCampus(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#141517] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#00D54B] transition-colors"
                        >
                          {CAMPUS_OPTIONS.map((c) => (
                            <option key={c.id} value={c.name} className="bg-[#141517] text-white">
                              {c.name} ({c.label})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-300">
                        {selectedRole === "organizer" ? "Brand / Contact Email" : "Student Email"}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. tade@oou.edu.ng"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00D54B] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-300">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#00D54B] transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                        selectedRole === "organizer"
                          ? "bg-[#D7F23A] text-black hover:bg-white"
                          : "bg-[#00D54B] text-black hover:bg-[#D7F23A]"
                      }`}
                    >
                      {isLoading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>
                            {authMode === "signup"
                              ? `Create ${selectedRole === "organizer" ? "Organizer" : "Partygoer"} Account`
                              : "Sign In"}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* 1-Click Demo Quick Fill */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block text-center">
                      OR INSTANT 1-CLICK ACCESS
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin(selectedRole)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span>
                        Use Demo {selectedRole === "organizer" ? "Organizer" : "Partygoer"} Credentials
                      </span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="w-full border-t border-white/10 py-6 text-center text-xs font-mono text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Party Padi Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href={getPublicUrl("/")} className="hover:text-white transition-colors">
              Public Website
            </Link>
            <span>•</span>
            <Link href={getPublicUrl("/events")} className="hover:text-white transition-colors">
              Explore Events
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
