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
  Eye,
  EyeOff,
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

const VIBE_TAGS = [
  "Parties & Raves",
  "Campus Concerts",
  "Department Galas",
  "Cultural & Alte",
  "Sound Clashes",
  "Tech & Networking",
];

const STEPS = [
  { number: 1, title: "Sign up your account" },
  { number: 2, title: "Set up your workspace" },
  { number: 3, title: "Set up your profile" },
];

export function OnboardingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { currentUser, login, signup, switchRole, logout } = useAuth();

  const initialRoleParam = searchParams.get("role") as RoleOption | null;
  const initialModeParam = searchParams.get("mode") as AuthMode | null;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(
    initialRoleParam ? 2 : 1
  );
  const [authMode, setAuthMode] = useState<AuthMode>(
    initialModeParam === "signin" ? "signin" : "signup"
  );
  const [selectedRole, setSelectedRole] = useState<RoleOption>(
    initialRoleParam === "organizer" ? "organizer" : "partygoer"
  );

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [campus, setCampus] = useState("OOU Ago-Iwoye");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([
    "Parties & Raves",
    "Campus Concerts",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialRoleParam === "organizer" || initialRoleParam === "partygoer") {
      setSelectedRole(initialRoleParam);
    }
  }, [initialRoleParam]);

  const toggleVibe = (tag: string) => {
    setSelectedVibes((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Step 1: Account credentials submission
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast({
        type: "error",
        title: "Required Fields Missing",
        message: "Please enter your email and password.",
      });
      return;
    }

    if (password.length < 8) {
      showToast({
        type: "error",
        title: "Password Too Short",
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    if (authMode === "signup") {
      if (!firstName.trim() || !lastName.trim()) {
        showToast({
          type: "error",
          title: "Name Required",
          message: "Please provide your first and last name.",
        });
        return;
      }
      // Advance to Step 2 (Workspace / Role Selection)
      setCurrentStep(2);
    } else {
      // Direct sign in
      handleDirectSignIn();
    }
  };

  const handleDirectSignIn = () => {
    setIsLoading(true);
    try {
      login(email);
      showToast({
        type: "success",
        title: "Welcome Back",
        message: "Signed in to your Party Padi account.",
      });
      if (selectedRole === "organizer") {
        router.push("/organizer");
      } else {
        router.push("/dashboard");
      }
    } catch {
      showToast({
        type: "error",
        title: "Sign In Failed",
        message: "Unable to sign in. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 -> Step 3
  const handleStep2Submit = () => {
    setCurrentStep(3);
  };

  // Step 3 -> Finish Onboarding and enter dashboard
  const handleFinishOnboarding = () => {
    setIsLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || "Party Padi Member";
    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");

    try {
      signup({
        fullName,
        username: username || `padi_${Date.now().toString().slice(-4)}`,
        email,
        role: selectedRole,
        campus,
        bio: `${campus} · ${selectedVibes.slice(0, 2).join(" & ")} vibes`,
      });

      showToast({
        type: "success",
        title: "Account Activated!",
        message: `Welcome ${firstName}! Launching your ${
          selectedRole === "organizer" ? "Creator Studio" : "Partygoer Dashboard"
        }...`,
      });

      if (selectedRole === "organizer") {
        router.push("/organizer");
      } else {
        router.push("/dashboard");
      }
    } catch {
      showToast({
        type: "error",
        title: "Registration Error",
        message: "Could not complete account setup. Please retry.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Fast Demo Logins
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

  return (
    <div className="min-h-screen bg-[#070809] text-white flex flex-col justify-between selection:bg-[#C5FF35] selection:text-black">
      {/* Top Bar with Brand & Public Website Link */}
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
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] animate-pulse" />
              App Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
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

      {/* Main Center Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {currentUser ? (
          /* Active Session Card */
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0C0D0E] border border-white/10 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#C5FF35]/10 border border-[#C5FF35]/30 flex items-center justify-center mx-auto text-[#C5FF35]">
              <User className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-[#C5FF35]/15 text-[#C5FF35] border border-[#C5FF35]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
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
                onClick={() => {
                  if (currentUser.role === "organizer") {
                    router.push("/organizer");
                  } else {
                    router.push("/dashboard");
                  }
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C5FF35] text-black font-mono text-xs font-bold hover:bg-[#D7F23A] transition-all flex items-center justify-center gap-2 shadow-lg"
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
          /* Split-Screen Reference Modal Container */
          <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0C0D0E] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] animate-in fade-in duration-300">
            {/* ========================================================================= */}
            {/* LEFT SIDE: AMBIENT NEON GLOW & VERTICAL STEPPER (INSPIRED BY REFERENCE)  */}
            {/* ========================================================================= */}
            <div className="lg:col-span-5 relative p-8 sm:p-10 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 bg-black min-h-[340px] lg:min-h-full">
              {/* Vibrant Atmospheric Mesh Glow Overlay (Neon Violet + Neon Lime) */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
                {/* Upper Left Deep Vibe Violet Bloom */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#7B3FFF]/50 blur-[90px]" />
                {/* Central Soft Neon Lime Aura */}
                <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-[#C5FF35]/25 blur-[100px]" />
                {/* Lower Right Neon Radiance */}
                <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#C5FF35]/35 blur-[95px]" />
                {/* Ambient Subtle Vignette */}
                <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/85" />
              </div>

              {/* Top Logo & Branding */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C5FF35] shadow-[0_0_12px_#C5FF35]" />
                  <span className="font-display font-black text-lg text-white tracking-tight">
                    Party Padi
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  Campus Beta
                </span>
              </div>

              {/* Center Stage: Title & Step Indicator Capsules */}
              <div className="relative z-10 my-auto py-8 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
                    Get Started with Us
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-xs leading-relaxed">
                    Complete these easy steps to register your campus account.
                  </p>
                </div>

                {/* Vertical Stepper Capsules Stack (Directly from Reference) */}
                <div className="space-y-3 max-w-sm pt-2">
                  {STEPS.map((stepItem) => {
                    const isActive = currentStep === stepItem.number;
                    const isCompleted = currentStep > stepItem.number;

                    return (
                      <div
                        key={stepItem.number}
                        onClick={() => {
                          // Allow stepping back to previous completed steps
                          if (stepItem.number < currentStep) {
                            setCurrentStep(stepItem.number as 1 | 2 | 3);
                          }
                        }}
                        className={`w-full py-3 px-4 rounded-2xl flex items-center gap-3 transition-all duration-200 select-none ${
                          isActive
                            ? "bg-white text-black font-bold shadow-xl scale-[1.02]"
                            : isCompleted
                            ? "bg-white/10 border border-[#C5FF35]/40 text-white cursor-pointer hover:bg-white/15"
                            : "bg-white/5 border border-white/10 text-white/50"
                        }`}
                      >
                        {/* Number Badge or Checkmark */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                            isActive
                              ? "bg-black text-white"
                              : isCompleted
                              ? "bg-[#C5FF35] text-black"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            stepItem.number
                          )}
                        </div>

                        {/* Title */}
                        <span className="text-xs font-mono font-semibold truncate">
                          {stepItem.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Guarantee Badge */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>0% Commission During Campus Beta</span>
                <span className="text-[#C5FF35]">● Live</span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT SIDE: AUTHENTICATION & FORM STAGE                                  */}
            {/* ========================================================================= */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0C0D0E]">
              {/* STEP 1: ACCOUNT CREDENTIALS (SIGN UP OR SIGN IN) */}
              {currentStep === 1 && (
                <div className="space-y-6 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  {/* Top Header */}
                  <div className="space-y-1.5">
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                      {authMode === "signup" ? "Sign Up Account" : "Sign In to Account"}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {authMode === "signup"
                        ? "Enter your personal data to create your account."
                        : "Welcome back! Enter your student or organizer credentials."}
                    </p>
                  </div>

                  {/* Fast 1-Click Demo / Social Logins (Reference Inspired) */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin("partygoer")}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5FF35]" />
                      <span>Demo Partygoer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoLogin("organizer")}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#D7F23A]" />
                      <span>Demo Organizer</span>
                    </button>
                  </div>

                  {/* Divider Line */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-full border-t border-white/10" />
                    <span className="absolute px-3 bg-[#0C0D0E] text-[11px] font-mono text-neutral-500 uppercase">
                      Or
                    </span>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleStep1Submit} className="space-y-4">
                    {authMode === "signup" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-neutral-300">
                            First Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="eg. Tade"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] transition-colors"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-neutral-300">
                            Last Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="eg. Adeleke"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="eg. tade@oou.edu.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-300">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-500">
                        Must be at least 8 characters.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-2xl bg-white text-black hover:bg-[#C5FF35] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
                    >
                      <span>
                        {authMode === "signup" ? "Sign Up" : "Sign In"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Mode Switch Footer */}
                  <div className="pt-2 text-center text-xs font-mono text-neutral-400">
                    {authMode === "signup" ? (
                      <span>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthMode("signin")}
                          className="text-white hover:text-[#C5FF35] font-bold underline underline-offset-4"
                        >
                          Log in
                        </button>
                      </span>
                    ) : (
                      <span>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthMode("signup")}
                          className="text-white hover:text-[#C5FF35] font-bold underline underline-offset-4"
                        >
                          Sign up
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: SET UP YOUR WORKSPACE / ROLE SELECTION */}
              {currentStep === 2 && (
                <div className="space-y-6 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5FF35]">
                      STEP 2 OF 3
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                      Set Up Your Workspace
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Choose how you will participate in the Party Padi ecosystem.
                    </p>
                  </div>

                  {/* Role Choice Cards */}
                  <div className="space-y-3">
                    {/* Option 1: Partygoer */}
                    <div
                      onClick={() => setSelectedRole("partygoer")}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        selectedRole === "partygoer"
                          ? "bg-[#C5FF35]/10 border-[#C5FF35] ring-1 ring-[#C5FF35]"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#C5FF35]/15 text-[#C5FF35] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                           <h4 className="font-display font-bold text-sm text-white">
                            Partygoer
                          </h4>
                          <span className="text-[10px] font-mono text-[#C5FF35] font-bold uppercase">
                            Campus Discovery
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Discover events, reserve digital passes, make friend circles, and support hosts.
                        </p>
                      </div>
                    </div>

                    {/* Option 2: Event Organizer */}
                    <div
                      onClick={() => setSelectedRole("organizer")}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        selectedRole === "organizer"
                          ? "bg-[#D7F23A]/10 border-[#D7F23A] ring-1 ring-[#D7F23A]"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#D7F23A]/15 text-[#D7F23A] flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-sm text-white">
                            Event Organizer
                          </h4>
                          <span className="text-[10px] font-mono text-[#D7F23A] font-bold uppercase">
                            0% Platform Fee
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Publish events, manage ticket tiers, scan passes at the door, and track telemetry.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStep2Submit}
                      className="flex-1 py-3 rounded-2xl bg-white text-black hover:bg-[#C5FF35] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <span>Continue to Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SET UP YOUR PROFILE (CAMPUS & VIBES) */}
              {currentStep === 3 && (
                <div className="space-y-6 max-w-md mx-auto w-full animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5FF35]">
                      STEP 3 OF 3
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                      Set Up Your Profile
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Select your university campus and favorite vibe preferences.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Campus Selector */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-300">
                        Primary Campus
                      </label>
                      <select
                        value={campus}
                        onChange={(e) => setCampus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141517] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#C5FF35] transition-colors"
                      >
                        {CAMPUS_OPTIONS.map((c) => (
                          <option key={c.id} value={c.name} className="bg-[#141517] text-white">
                            {c.name} ({c.label})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Vibe Tags Pills */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono text-neutral-300 block">
                        What vibes are you into?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {VIBE_TAGS.map((tag) => {
                          const isSelected = selectedVibes.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleVibe(tag)}
                              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                                isSelected
                                  ? "bg-[#C5FF35] text-black font-bold shadow-sm"
                                  : "bg-white/5 text-neutral-400 hover:text-white border border-white/10"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleFinishOnboarding}
                      className="flex-1 py-3 rounded-2xl bg-[#C5FF35] text-black hover:bg-[#D7F23A] font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      <span>
                        {isLoading
                          ? "Setting Up Workspace..."
                          : `Launch My ${selectedRole === "organizer" ? "Creator Studio" : "Dashboard"}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
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
