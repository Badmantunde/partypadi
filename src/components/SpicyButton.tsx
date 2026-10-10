"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface SpicyButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "lime" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: "right" | "up-right" | "none";
  className?: string;
  disabled?: boolean;
}

export function SpicyButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  icon = "right",
  className = "",
  disabled = false,
}: SpicyButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "lime":
        return "bg-[#C5FF35] text-[#11120F] hover:bg-[#b4f323] hover:shadow-[0_0_25px_rgba(197,255,53,0.4)] border border-[#C5FF35]";
      case "secondary":
        return "bg-neutral-900 text-white hover:bg-black border border-neutral-800 hover:border-neutral-700";
      case "outline":
        return "bg-transparent text-[#11120F] border border-neutral-300 hover:bg-neutral-100/80 hover:border-neutral-400";
      case "ghost":
        return "bg-transparent text-[#11120F] hover:bg-neutral-100 border border-transparent";
      case "primary":
      default:
        return "bg-[#11120F] text-white hover:bg-neutral-800 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] border border-[#11120F]";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-xs";
      case "lg":
        return "px-8 py-4 text-sm";
      case "md":
      default:
        return "px-6 py-3 text-xs sm:text-sm";
    }
  };

  const baseClasses = `
    spicy-btn group inline-flex items-center justify-center gap-2.5 font-mono font-medium rounded-full
    tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
    disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer
    ${getVariantStyles()} ${getSizeStyles()} ${className}
  `;

  const renderIcon = () => {
    if (icon === "right") {
      return (
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      );
    }
    if (icon === "up-right") {
      return (
        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      );
    }
    return null;
  };

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <span>{children}</span>
        {renderIcon()}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      <span>{children}</span>
      {renderIcon()}
    </button>
  );
}
