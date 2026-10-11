"use client";

import React from "react";
import Image from "next/image";
import { GifterLevel } from "@/types";
import { GIFTER_LEVEL_INFO } from "@/context/AuthContext";

interface GifterBadgeProps {
  level: GifterLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showMeaning?: boolean;
  className?: string;
  theme?: "dark" | "light";
}

const BADGE_STYLES: Record<
  GifterLevel,
  {
    bgDark: string;
    borderDark: string;
    textDark: string;
    bgLight: string;
    borderLight: string;
    textLight: string;
    glow: string;
    ring: string;
  }
> = {
  1: {
    // Padi - Green
    bgDark: "bg-emerald-500/10",
    borderDark: "border-emerald-500/30",
    textDark: "text-emerald-400",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    textLight: "text-emerald-800",
    glow: "rgba(16,185,129,0.25)",
    ring: "ring-emerald-500/30",
  },
  2: {
    // Plug - Blue
    bgDark: "bg-sky-500/10",
    borderDark: "border-sky-500/30",
    textDark: "text-sky-400",
    bgLight: "bg-sky-50",
    borderLight: "border-sky-200",
    textLight: "text-sky-800",
    glow: "rgba(56,189,248,0.25)",
    ring: "ring-sky-500/30",
  },
  3: {
    // Hype Padi - Violet
    bgDark: "bg-purple-500/15",
    borderDark: "border-purple-500/35",
    textDark: "text-purple-300",
    bgLight: "bg-purple-50",
    borderLight: "border-purple-200",
    textLight: "text-purple-800",
    glow: "rgba(168,85,247,0.3)",
    ring: "ring-purple-500/30",
  },
  4: {
    // Big Padi - Silver
    bgDark: "bg-slate-300/10",
    borderDark: "border-slate-300/35",
    textDark: "text-slate-200",
    bgLight: "bg-slate-100",
    borderLight: "border-slate-300",
    textLight: "text-slate-800",
    glow: "rgba(226,232,240,0.3)",
    ring: "ring-slate-300/40",
  },
  5: {
    // Headliner - Gold
    bgDark: "bg-amber-400/15",
    borderDark: "border-amber-400/40",
    textDark: "text-amber-300",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-300",
    textLight: "text-amber-800",
    glow: "rgba(245,158,11,0.35)",
    ring: "ring-amber-400/40",
  },
  6: {
    // Legend - Gold and Violet
    bgDark: "bg-gradient-to-r from-purple-500/20 to-amber-500/20",
    borderDark: "border-amber-400/60",
    textDark: "text-amber-200",
    bgLight: "bg-gradient-to-r from-purple-100 to-amber-100",
    borderLight: "border-amber-400",
    textLight: "text-amber-900",
    glow: "rgba(245,158,11,0.5)",
    ring: "ring-amber-400/50",
  },
};

export function GifterBadge({
  level,
  size = "sm",
  showLabel = true,
  showMeaning = false,
  className = "",
  theme = "dark",
}: GifterBadgeProps) {
  const info = GIFTER_LEVEL_INFO[level] || GIFTER_LEVEL_INFO[1];
  const styles = BADGE_STYLES[level] || BADGE_STYLES[1];

  // Small version: optimized for usernames, comments, tables, and pills
  if (size === "sm") {
    const isDark = theme === "dark";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold tracking-tight transition-all shrink-0 ${
          isDark
            ? `${styles.bgDark} ${styles.borderDark} ${styles.textDark}`
            : `${styles.bgLight} ${styles.borderLight} ${styles.textLight}`
        } ${className}`}
        title={`${info.name} (${info.meaning})`}
      >
        <span className="w-3.5 h-3.5 rounded-full overflow-hidden relative shrink-0 block">
          <Image
            src={info.imageUrl}
            alt={info.name}
            fill
            sizes="14px"
            className="object-contain"
          />
        </span>
        {showLabel && <span>{info.name}</span>}
      </span>
    );
  }

  // Medium version: cards, supporter lists, organizer profiles
  if (size === "md") {
    const isDark = theme === "dark";
    return (
      <div
        className={`inline-flex items-center gap-2.5 p-2 rounded-2xl border transition-all ${
          isDark
            ? `${styles.bgDark} ${styles.borderDark} text-white`
            : `${styles.bgLight} ${styles.borderLight} text-neutral-900`
        } ${className}`}
      >
        <div
          className={`w-9 h-9 rounded-xl overflow-hidden relative shrink-0 p-1 bg-black/20 ring-1 ${styles.ring}`}
          style={{ boxShadow: `0 0 16px ${styles.glow}` }}
        >
          <Image
            src={info.imageUrl}
            alt={info.name}
            fill
            sizes="36px"
            className="object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-bold text-xs ${
                isDark ? styles.textDark : styles.textLight
              }`}
            >
              {info.name}
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                isDark ? "bg-white/10 text-white/70" : "bg-black/10 text-black/70"
              }`}
            >
              Lvl {level}
            </span>
          </div>
          {showMeaning ? (
            <span className="text-[10px] font-mono text-neutral-400 block line-clamp-1">
              {info.meaning}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-neutral-400 block">
              {info.description}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Large version: Gifter Profile showcases, Leaderboard podium cards, milestone celebrations
  return (
    <div
      className={`relative p-5 rounded-3xl border text-center flex flex-col items-center justify-center transition-all ${
        theme === "dark"
          ? `${styles.bgDark} ${styles.borderDark} text-white`
          : `${styles.bgLight} ${styles.borderLight} text-neutral-900`
      } ${className}`}
      style={{ boxShadow: `0 0 35px ${styles.glow}` }}
    >
      <div className="relative mb-3">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 bg-black/40 ring-2 relative overflow-hidden flex items-center justify-center transition-transform hover:scale-105"
          style={{ borderColor: info.color }}
        >
          <Image
            src={info.imageUrl}
            alt={info.name}
            fill
            sizes="80px"
            className="object-contain p-1"
          />
        </div>
        <div
          className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-black shadow-md"
          style={{ backgroundColor: info.color }}
        >
          Lvl {level}
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-display font-bold text-base sm:text-lg tracking-tight">
          {info.name}
        </h4>
        <p className="text-xs font-mono font-medium opacity-80">
          {info.badgeStyle}
        </p>
        <p className="text-[11px] text-neutral-400 font-sans max-w-[200px] mx-auto pt-1">
          {info.meaning}
        </p>
      </div>
    </div>
  );
}
