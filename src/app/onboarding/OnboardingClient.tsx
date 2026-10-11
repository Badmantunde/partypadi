"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toast";
import { getPublicUrl } from "@/lib/urls";
import {
  Sparkles,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
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

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

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
    <div className="min-h-screen bg-[#070809] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-[#C5FF35] selection:text-black relative">
      {/* Subtle Return Link in Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <Link
          href={getPublicUrl("/")}
          className="text-xs font-mono text-neutral-500 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <span>Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {currentUser ? (
        /* Active Session Found Card */
        <div className="max-w-md w-full p-8 rounded-3xl bg-black border border-neutral-800 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
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
              className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#C5FF35] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>
                Enter {currentUser.role === "organizer" ? "Creator Studio" : "Partygoer Dashboard"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => logout()}
              className="w-full py-2.5 text-neutral-400 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign in with another account</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* EXACT REFERENCE MODAL CONTAINER                                           */
        /* Floating black card with glowing purple inset on the left & form on right */
        /* ========================================================================= */
        <div className="w-full max-w-4xl lg:max-w-5xl rounded-3xl border border-neutral-800 bg-black shadow-2xl overflow-hidden p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[580px] lg:min-h-[620px] relative z-10 animate-in fade-in duration-300">
          
          {/* ======================================================================= */}
          {/* LEFT COLUMN: INSET GLOWING PURPLE CARD WITH CENTRED STEPPER             */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center p-6 sm:p-8 min-h-[460px] lg:min-h-full border border-purple-900/40">
            {/* Rich Ethereal Violet / Purple Radial Bloom matching reference */}
            <div
              className="absolute inset-0 pointer-events-none select-none"
              style={{
                background:
                  "radial-gradient(ellipse 95% 75% at 50% 28%, #8B5CF6 0%, #6D28D9 30%, #3B0764 55%, #130722 78%, #030107 100%)",
              }}
            />
            {/* Atmospheric Vignette */}
            <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/60 pointer-events-none" />

            {/* Inner Content Centered */}
            <div className="relative z-10 flex flex-col items-center max-w-[280px] w-full my-auto">
              {/* Logo: Ring with Dot + Brand Text (OnlyPipe style) */}
              <div className="flex items-center gap-2.5 mb-5 select-none">
                <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span className="font-display font-extrabold text-lg text-white tracking-tight">
                  Party Padi
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-tight">
                Get Started with Us
              </h2>
              <p className="text-xs text-neutral-300 font-sans mt-2 max-w-[230px] leading-relaxed">
                Complete these easy steps to register your account.
              </p>

              {/* 3 Stepper Pills */}
              <div className="w-full space-y-2.5 mt-8 max-w-[270px]">
                {STEPS.map((s) => {
                  const isActive = currentStep === s.number;
                  const isCompleted = currentStep > s.number;

                  return (
                    <button
                      key={s.number}
                      type="button"
                      onClick={() => {
                        if (s.number < currentStep) {
                          setCurrentStep(s.number as 1 | 2 | 3);
                        }
                      }}
                      className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all text-xs font-semibold select-none ${
                        isActive
                          ? "bg-white text-black shadow-lg cursor-default"
                          : isCompleted
                          ? "bg-white/15 text-white border border-[#C5FF35]/40 cursor-pointer hover:bg-white/20"
                          : "bg-white/[0.08] text-neutral-400 border border-white/5 cursor-default"
                      }`}
                    >
                      {/* Number badge */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isActive
                            ? "bg-black text-white"
                            : isCompleted
                            ? "bg-[#C5FF35] text-black"
                            : "bg-white/10 text-neutral-400"
                        }`}
                      >
                        {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.number}
                      </div>

                      <span className="truncate">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: HIGH-CONTRAST FORM CANVAS (DIRECT REFERENCE MATCH)        */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center py-6 px-4 sm:px-8 lg:px-10">
            <div className="w-full max-w-sm sm:max-w-md mx-auto">
              
              {/* STEP 1: CREDENTIALS FORM */}
              {currentStep === 1 && (
                <div className="w-full animate-in fade-in duration-200">
                  {/* Centered Heading */}
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                      {authMode === "signup" ? "Sign Up Account" : "Sign In to Account"}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {authMode === "signup"
                        ? "Enter your personal data to create your account."
                        : "Enter your personal data to access your account."}
                    </p>
                  </div>

                  {/* Social Buttons (Google & Github) */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin("partygoer")}
                      className="py-2.5 px-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-transparent hover:bg-white/5 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      title="Quick Partygoer sign in"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoLogin("organizer")}
                      className="py-2.5 px-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-transparent hover:bg-white/5 text-xs font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      title="Quick Organizer sign in"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>Github</span>
                    </button>
                  </div>

                  {/* Or Divider */}
                  <div className="relative my-5 flex items-center justify-center">
                    <div className="w-full border-t border-neutral-800" />
                    <span className="absolute px-3 bg-black text-xs text-neutral-500 font-mono">
                      Or
                    </span>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleStep1Submit} className="space-y-3.5">
                    {authMode === "signup" && (
                      /* First Name & Last Name (2 Columns) */
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="eg. John"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141517] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5FF35] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="eg. Francisco"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141517] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5FF35] transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="eg. johnfrans@gmail.com"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141517] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5FF35] transition-colors"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#141517] border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#C5FF35] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1.5 font-sans">
                        Must be at least 8 characters.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-4 py-3 px-4 rounded-xl bg-white hover:bg-[#C5FF35] text-black font-semibold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isLoading
                        ? "Processing..."
                        : authMode === "signup"
                        ? "Sign Up"
                        : "Log In"}
                    </button>
                  </form>

                  {/* Toggle Sign In / Sign Up Footer */}
                  <p className="mt-5 text-center text-xs text-neutral-400">
                    {authMode === "signup" ? (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthMode("signin")}
                          className="text-white hover:text-[#C5FF35] font-semibold underline underline-offset-2 ml-1 cursor-pointer"
                        >
                          Log in
                        </button>
                      </>
                    ) : (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthMode("signup")}
                          className="text-white hover:text-[#C5FF35] font-semibold underline underline-offset-2 ml-1 cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* STEP 2: SET UP YOUR WORKSPACE (ROLE CHOICE) */}
              {currentStep === 2 && (
                <div className="w-full space-y-6 animate-in fade-in duration-200">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5FF35]">
                      STEP 2 OF 3
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                      Set Up Your Workspace
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Choose how you will participate in the Party Padi ecosystem.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Partygoer */}
                    <div
                      onClick={() => setSelectedRole("partygoer")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                        selectedRole === "partygoer"
                          ? "bg-[#C5FF35]/10 border-[#C5FF35] ring-1 ring-[#C5FF35]"
                          : "bg-[#141517] border-neutral-800 hover:border-neutral-700"
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
                          Discover events, reserve passes, make friend circles, and support hosts.
                        </p>
                      </div>
                    </div>

                    {/* Option 2: Event Organizer */}
                    <div
                      onClick={() => setSelectedRole("organizer")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                        selectedRole === "organizer"
                          ? "bg-[#D7F23A]/10 border-[#D7F23A] ring-1 ring-[#D7F23A]"
                          : "bg-[#141517] border-neutral-800 hover:border-neutral-700"
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
                            Creator Studio
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Publish events, manage ticket tiers, scan passes at the door, and track telemetry.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="py-3 px-4 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStep2Submit}
                      className="flex-1 py-3 rounded-xl bg-white hover:bg-[#C5FF35] text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>Continue to Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SET UP YOUR PROFILE (CAMPUS & VIBES) */}
              {currentStep === 3 && (
                <div className="w-full space-y-6 animate-in fade-in duration-200">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5FF35]">
                      STEP 3 OF 3
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                      Set Up Your Profile
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Select your university campus and favorite vibe preferences.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Campus Selector */}
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                        Primary Campus
                      </label>
                      <select
                        value={campus}
                        onChange={(e) => setCampus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141517] border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#C5FF35] transition-colors"
                      >
                        {CAMPUS_OPTIONS.map((c) => (
                          <option key={c.id} value={c.name} className="bg-[#141517] text-white">
                            {c.name} ({c.label})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Vibe Tags */}
                    <div>
                      <label className="text-xs text-neutral-400 block mb-2 font-medium">
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
                              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#C5FF35] text-black font-bold shadow-sm"
                                  : "bg-[#141517] text-neutral-400 hover:text-white border border-neutral-800"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="py-3 px-4 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleFinishOnboarding}
                      className="flex-1 py-3 rounded-xl bg-white hover:bg-[#C5FF35] text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
}
