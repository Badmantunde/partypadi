"use client";

import React, { useState } from "react";
import { X, Sparkles, User, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./Toast";

export function AuthModal() {
  const { authModalOpen, closeAuthModal, login, signup } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [role, setRole] = useState<"partygoer" | "organizer">("partygoer");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [campus, setCampus] = useState("Main Campus");
  const [loginIdentifier, setLoginIdentifier] = useState("");

  if (!authModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast({
        type: "error",
        title: "Input Required",
        message: "Please enter your username or email.",
      });
      return;
    }

    const success = login(loginIdentifier);
    if (success) {
      showToast({
        type: "success",
        title: "Signed In Successfully",
        message: `Welcome back to PartyPadi!`,
      });
      closeAuthModal();
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
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      showToast({
        type: "error",
        title: "Required Fields Missing",
        message: "Please fill in all registration fields.",
      });
      return;
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
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#0C0D0E] border border-white/10 text-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#C5FF35]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center pt-2 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
            <span>CAMPUS COMMUNITY AUTH</span>
          </div>
          <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
            {activeTab === "signin" ? "Sign In to PartyPadi" : "Join Your Campus Circle"}
          </h3>
          <p className="text-xs text-neutral-400">
            {activeTab === "signin"
              ? "Access your tickets, friend radar, and gatherings."
              : "Create an account as a partygoer or event organizer."}
          </p>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-full mb-6 text-xs font-mono">
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

        {activeTab === "signup" ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                SELECT YOUR ROLE
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole("partygoer")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
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
                  <span className="text-[10px] text-neutral-400 block leading-tight mt-0.5">
                    Connect with friends & circles
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("organizer")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
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
                  <span className="text-[10px] text-neutral-400 block leading-tight mt-0.5">
                    Host events & 0% fee tickets
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
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
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
                  className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35] font-mono"
                />
              </div>
              <span className="text-[9px] text-neutral-500 font-mono block mt-1">
                Friends will search this tag to add you to circles.
              </span>
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
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5FF35]"
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
                className="w-full px-4 py-2.5 bg-[#141517] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C5FF35]"
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
              className="spicy-btn w-full py-3 bg-[#C5FF35] text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#b5f220] transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="spicy-btn w-full py-3 bg-white text-[#0C0D0E] font-mono font-bold text-xs uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Quick Demo Logins for Instant Testing */}
            <div className="pt-4 border-t border-white/10 space-y-2">
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
                  <span className="text-[9px] text-neutral-400 block">Partygoer · Campus VIP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("fassa_execs")}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-white block">@fassa_execs</span>
                  <span className="text-[9px] text-neutral-400 block">Organizer · Social Directorate</span>
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="pt-5 text-center">
          <p className="text-[10px] text-neutral-500 font-mono">
            Guest checkout is always supported · No account required to buy tickets
          </p>
        </div>
      </div>
    </div>
  );
}
