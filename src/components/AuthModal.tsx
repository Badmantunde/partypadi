"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  User,
  ShieldCheck,
  ArrowRight,
  Check,
  Mail,
  KeyRound,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./Toast";

export function AuthModal() {
  const router = useRouter();
  const {
    authModalOpen,
    closeAuthModal,
    allUsers,
    login,
    signup,
    isSupabaseConfigured,
    signInWithSupabase,
    signUpWithSupabase,
    signInWithMagicLink,
  } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [authMode, setAuthMode] = useState<"password" | "magic_link">("password");
  const [role, setRole] = useState<"partygoer" | "organizer">("partygoer");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState("Main Campus");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const routeUserByRole = (targetRole: "partygoer" | "organizer") => {
    if (targetRole === "organizer") {
      router.push("/organizer");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast({
        type: "error",
        title: "Input Required",
        message: "Please enter your username or email.",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && loginIdentifier.includes("@")) {
        // Attempt Supabase sign in if email provided
        const res = await signInWithSupabase(loginIdentifier, password || undefined);
        if (!res.success) {
          showToast({
            type: "error",
            title: "Supabase Sign In",
            message: res.message,
          });
          setLoading(false);
          return;
        }
      }

      // Synchronize with local profile state
      const success = login(loginIdentifier);
      if (success) {
        showToast({
          type: "success",
          title: "Signed In Successfully",
          message: `Welcome back to PartyPadi!`,
        });
        closeAuthModal();

        const clean = loginIdentifier.trim().toLowerCase().replace(/^@/, "");
        const matched = allUsers.find(
          (u) =>
            u.username.toLowerCase() === clean ||
            u.email.toLowerCase() === clean
        );
        const resolvedRole = matched?.role || "partygoer";
        routeUserByRole(resolvedRole);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = activeTab === "signin" ? loginIdentifier : email;
    if (!targetEmail || !targetEmail.includes("@")) {
      showToast({
        type: "error",
        title: "Valid Email Required",
        message: "Please enter your email to receive a login link.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithMagicLink(targetEmail);
      showToast({
        type: res.success ? "success" : "error",
        title: res.success ? "Magic Link Dispatched!" : "Magic Link Error",
        message: res.message,
      });
      if (res.success) {
        login(targetEmail);
        closeAuthModal();
        routeUserByRole(role);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (usernameDemo: string) => {
    login(usernameDemo);
    showToast({
      type: "success",
      title: "Demo Account Loaded",
      message: `Signed in as @${usernameDemo}`,
    });
    closeAuthModal();
    const isOrg = usernameDemo === "fassa_execs";
    routeUserByRole(isOrg ? "organizer" : "partygoer");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      showToast({
        type: "error",
        title: "Required Fields Missing",
        message: "Please fill in all registration fields.",
      });
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const res = await signUpWithSupabase(email, password || "PartyPadi2026!", {
          fullName,
          username,
          role,
          campus,
        });
        if (!res.success) {
          showToast({
            type: "error",
            title: "Registration Notice",
            message: res.message,
          });
        }
      }

      const success = signup({
        fullName,
        username,
        email,
        role,
        campus,
      });

      if (success) {
        showToast({
          type: "success",
          title: "Account Created!",
          message: `Welcome @${username.replace(/^@/, "")}! Your PartyPadi profile is ready.`,
        });
        closeAuthModal();
        routeUserByRole(role);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#0C0D0E] border border-white/10 text-white rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#C5FF35]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center pt-1 pb-4 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/80">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseConfigured ? "bg-[#C5FF35] animate-pulse" : "bg-sky-400"
              }`}
            />
            <span>
              {isSupabaseConfigured ? "SUPABASE AUTH CONNECTED" : "CAMPUS COMMUNITY AUTH"}
            </span>
          </div>
          <h3 className="font-display font-medium text-xl sm:text-2xl text-white">
            {activeTab === "signin" ? "Sign In to PartyPadi" : "Join Your Campus Circle"}
          </h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            {activeTab === "signin"
              ? "Access your tickets, friends radar, and gathering circles."
              : "Register as a partygoer or official event host."}
          </p>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-full mb-4 text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`py-2 rounded-full transition-all text-center font-bold ${
              activeTab === "signup"
                ? "bg-[#C5FF35] text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`py-2 rounded-full transition-all text-center font-bold ${
              activeTab === "signin"
                ? "bg-white text-[#0C0D0E] shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto pr-0.5 space-y-4">
          {activeTab === "signup" ? (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  SELECT YOUR ROLE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("partygoer")}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      role === "partygoer"
                        ? "bg-white/10 border-[#C5FF35] text-white"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <User className={`w-4 h-4 ${role === "partygoer" ? "text-[#C5FF35]" : ""}`} />
                      {role === "partygoer" && <Check className="w-3.5 h-3.5 text-[#C5FF35]" />}
                    </div>
                    <span className="font-display font-bold text-xs block text-white">Partygoer</span>
                    <span className="text-[9px] text-neutral-400 block leading-tight mt-0.5">
                      Connect with friends & circles
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      role === "organizer"
                        ? "bg-white/10 border-[#C5FF35] text-white"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <ShieldCheck className={`w-4 h-4 ${role === "organizer" ? "text-[#C5FF35]" : ""}`} />
                      {role === "organizer" && <Check className="w-3.5 h-3.5 text-[#C5FF35]" />}
                    </div>
                    <span className="font-display font-bold text-xs block text-white">Organizer</span>
                    <span className="text-[9px] text-neutral-400 block leading-tight mt-0.5">
                      Host events & live metrics
                    </span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Babatunde Adeyemi"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  USERNAME (@TAG) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                    placeholder="tade_vibes"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  PASSWORD {isSupabaseConfigured && "*"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
                />
              </div>

              {/* Campus */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  PRIMARY CAMPUS
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#141517] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5FF35]"
                >
                  <option value="Main Campus">Main Campus / General</option>
                  <option value="UNILAG Akoka">UNILAG (Akoka)</option>
                  <option value="OOU Ago-Iwoye">OOU (Ago-Iwoye)</option>
                  <option value="UI Ibadan">UI (Ibadan)</option>
                  <option value="LASU Ojo">LASU (Ojo)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="spicy-btn w-full py-3 bg-[#C5FF35] text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#b5f220] transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{loading ? "Creating Profile..." : "Create Account"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    USERNAME OR EMAIL
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="@username or you@email.com"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-mono"
                  />
                </div>

                {loginIdentifier.includes("@") && (
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                      PASSWORD (OPTIONAL)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="spicy-btn w-full py-3 bg-white text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? "Signing In..." : "Sign In"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Magic Link OTP Trigger */}
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-[11px] flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C5FF35]" />
                <span>Send Magic Login Link (OTP)</span>
              </button>

              {/* Quick Demo Logins for Instant Testing */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block text-center">
                  OR TEST WITH DEMO ACCOUNTS
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("tade_vibes")}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                  >
                    <span className="font-mono text-xs font-bold text-[#C5FF35] block">@tade_vibes</span>
                    <span className="text-[9px] text-neutral-400 block">Partygoer · Gifter L1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("fassa_execs")}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                  >
                    <span className="font-mono text-xs font-bold text-white block">@fassa_execs</span>
                    <span className="text-[9px] text-neutral-400 block">Organizer · Live Metrics</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 text-center shrink-0">
          <p className="text-[10px] text-neutral-500 font-mono">
            Guest checkout supported · No account required to purchase tickets
          </p>
        </div>
      </div>
    </div>
  );
}
